import { UserRepository } from "../repositories/user.repository";
import { hashPassword, comparePassword } from "../../../utils/hash";
import { bloomFilter } from "../../../infrastructure/bloom/bloom.filter";
// import { DistributedBloomFilter } from "../../../infrastructure/bloom/distributedBloom";
import { redisClient } from "../../../infrastructure/cache/redis.client";
import { publishEvent } from "../../../infrastructure/kafka/producer";
import { generateToken, verifyToken } from "../../../utils/jwt";
import { TOPICS } from "../../../infrastructure/kafka/topics";

// Distributed bloom filter Bloom Filter is shared across all service instances via Redis
// const bloomFilter = new DistributedBloomFilter();

// JWT verify = trust the token
// Hash compare = trust the session

export class AuthService {

  constructor(private repo = new UserRepository()) {}

  async register(data: any) {
    const { email, password } = data;

    if (bloomFilter.has(email)) {
      const cached = await redisClient.get(email);
      if (cached) throw new Error("Email exists");
    }

    const hashed = await hashPassword(password);
    const user = await this.repo.create({ ...data, password: hashed });

    bloomFilter.add(email);
    await redisClient.set(email, "1");

    // publish registration event
    await publishEvent(TOPICS.USER_EVENTS, { type: "USER_REGISTERED", email, userId: user.id });

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new Error("User not found");

    const valid = await comparePassword(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    // generate access + refresh token
    const accessToken = generateToken(user.id, "jwt");
    const refreshToken = generateToken(user.id + "_refresh", "refresh");

    // hash token for session trust
    const hash = await hashPassword(refreshToken)
    
    // store refresh token in Redis
    await redisClient.set(`refresh:${user.id}`, hash, { EX: 7 * 24 * 3600 });

    return { accessToken, refreshToken };
  }

  async refreshToken(userId: string, token: string) {
    //1. Verify JWT Refresh Token
    const payload = verifyToken(token, "refresh");
    if(!payload) throw new Error("Invalid refresh token");

    //2. Fetch from Redis
    const stored = await redisClient.get(`refresh:${userId}`);
    if (!stored || stored !== token) throw new Error("Session expired");
  
    // 3. Compare hashed token
    const isValid = await comparePassword(token, stored);
    if (!isValid) throw new Error("Token mismatch");


    // 4. Generate new tokens
    const accessToken = generateToken(userId, "jwt");
    const refreshToken = generateToken(userId + "_refresh", "refresh");

    // 5. Hash the refresh token
    const hash = await hashPassword(refreshToken);

    // Token rotation instead of deletion
    await redisClient.set(`refresh:${userId}`, hash, { EX: 7 * 24 * 3600 });

    return { accessToken, refreshToken };
  }

  async deleteUser(id: string) {
    return this.repo.deleteById(id);
  }

  async logOut(userId: string) {
    const stored = await redisClient.del(`refresh:${userId}`);
    if (!stored) throw new Error("Invalid token");

    return "Logout successfully";
  }
}