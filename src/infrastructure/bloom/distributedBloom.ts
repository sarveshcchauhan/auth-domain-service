import { BloomFilter } from "bloom-filters";
import { redisClient } from "../cache/redis.client";

/**
 * Distributed Bloom Filter stored in Redis
 * Key: "bloom:emails"
 */

const EXPECTED_USERS = 1000000;
const FALSE_POSITIVE_RATE = 0.01;

export class DistributedBloomFilter {

  private bloom: BloomFilter;

  private readonly redisKey = "bloom:emails";

  constructor() {
    this.bloom = BloomFilter.create(EXPECTED_USERS, FALSE_POSITIVE_RATE);
    this.syncFromRedis();
  }

  async syncFromRedis() {
    const data = await redisClient.getBuffer(this.redisKey);
    if (data) {
      this.bloom = BloomFilter.from(JSON.parse(data.toString()), 0.1);
    }
  }

  async add(value: string) {
    this.bloom.add(value);
    await redisClient.set(this.redisKey, JSON.stringify(this.bloom.saveAsJSON()));
  }

  has(value: string) {
    return this.bloom.has(value);
  }

}