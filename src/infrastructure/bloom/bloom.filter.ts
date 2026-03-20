import { BloomFilter } from "bloom-filters";

/**
 * Bloom Filter prevents unnecessary database queries.
 * Used for email existence checks.
 */

/**  Usage:
 * bloomFilter.has(email) 
 * bloomFilter.add(email)
 */

const EXPECTED_USERS = 1000000;
const FALSE_POSITIVE_RATE = 0.01;

export const bloomFilter = BloomFilter.create(
  EXPECTED_USERS,
  FALSE_POSITIVE_RATE
);

