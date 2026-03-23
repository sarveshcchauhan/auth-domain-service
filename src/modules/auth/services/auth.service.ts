import { UserRepository } from "../repositories/user.repository";
import { hashPassword, comparePassword } from "../../../utils/hash";
import { bloomFilter } from "../../../infrastructure/bloom/bloom.filter";
// import { DistributedBloomFilter } from "../../../infrastructure/bloom/distributedBloom";
import { redisClient } from "../../../infrastructure/cache/redis.client";
import { publishEvent } from "../../../infrastructure/kafka/producer";
import { generateToken } from "../../../utils/jwt";
import { TOPICS } from "../../../infrastructure/kafka/topics";

// Distributed bloom filter Bloom Filter is shared across all service instances via Redis
// const bloomFilter = new DistributedBloomFilter();


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
    const accessToken = generateToken(user.id);
    const refreshToken = generateToken(user.id + "_refresh");

    // store refresh token in Redis
    await redisClient.set(`refresh:${user.id}`, refreshToken, { EX: 7 * 24 * 3600 });

    return { accessToken, refreshToken };
  }

  async refreshToken(userId: string, token: string) {
    const stored = await redisClient.get(`refresh:${userId}`);
    if (!stored || stored !== token) throw new Error("Invalid refresh token");

    // generate new tokens
    const accessToken = generateToken(userId);
    const refreshToken = generateToken(userId + "_refresh");

    await redisClient.set(`refresh:${userId}`, refreshToken, { EX: 7 * 24 * 3600 });

    return { accessToken, refreshToken };
  }

  async deleteUser(id: string) {
    return this.repo.deleteById(id);
  }

}