import { Redis } from '@upstash/redis'
import { Ratelimit} from '@upstash/ratelimit'
import dotenv from 'dotenv';
dotenv.config();

// Manual Redis configuration to handle environment variable parsing issues
// Remove any trailing semicolons and trim whitespace from the token
const cleanToken = process.env.UPSTASH_REDIS_REST_TOKEN 
  ? process.env.UPSTASH_REDIS_REST_TOKEN.replace(/;+$/, '').trim()
  : null;

console.log("Redis URL:", process.env.UPSTASH_REDIS_REST_URL ? "Set" : "Not set");
console.log("Redis Token:", cleanToken ? "Cleaned and set" : "Not set");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: cleanToken
});

const rateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, "60 s")
});

export default rateLimiter;
