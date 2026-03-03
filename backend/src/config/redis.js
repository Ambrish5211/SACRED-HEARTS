import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import dotenv from "dotenv";
import { Redis } from "ioredis";

// Ensure env vars are loaded when this module is imported standalone (e.g. by the worker)
// Safe to call multiple times — dotenv won't overwrite already-set vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, "../../.env") });

const redis = new Redis(process.env.REDIS_URL);

// BullMQ Workers require maxRetriesPerRequest: null (blocking Redis commands)
export const workerRedis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
});

export default redis;