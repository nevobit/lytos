import { getRedisReadClient, getRedisWriteClient } from '@lytos/constant-definitions';
import { Logger, MonoContext } from '@lytos/core-modules';

const logger = MonoContext.getStateValue("logger") as Logger;

export const getFromCache = async <R>(key: string) => {
    const cache = getRedisReadClient();

    const res = await cache.hget("api-cache", key);

    return res ? (JSON.parse(res) as R) : null;
};

export const setCache = async (key: string, value: unknown) => {
    const cache = getRedisWriteClient();

    await cache.hset("api-cache", key, JSON.stringify(value));
};

export const invalidateCache = async (key: string) => {
    const cache = getRedisWriteClient();

    const res = await cache.hdel("api-cache", key);

    if (res === 0) {
        logger.warn(`[cache] key not found: ${key}`);
    }
};