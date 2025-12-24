import { t } from 'elysia';
import { customAlphabet } from 'nanoid';
import { config } from '../config';
import { redis } from '../data/redis';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);

export const createSchema = {
  body: t.Union([
    t.Object({
      url: t.String(),
      c: t.Optional(t.Never()),
      ttl: t.Optional(t.Numeric({ default: config.defaultTtl })),
    }, { additionalProperties: false }),
    t.Object({
      c: t.Union([t.String(), t.File()]),
      url: t.Optional(t.Never()),
      ttl: t.Optional(t.Numeric({ default: config.defaultTtl })),
    }, { additionalProperties: false }),
  ]),
};

export const create = async ({ body }: { body: { url?: string; c?: string | File; ttl?: number } }) => {
  let code = nanoid();
  let retries = 0;

  while (await redis.exists(`shrub:${code}`)) {
    code = nanoid();
    retries++;
    if (retries > 10) {
      throw new Error('Failed to generate unique code');
    }
  }

  const ttl = body.ttl || config.defaultTtl;
  const expire = new Date(Date.now() + ttl * 1000).toISOString();
  const key = `shrub:${code}`;

  if (body.url) {
    await redis.hset(key, {
      type: 'url',
      url: body.url,
      expire,
    });
  } else if (body.c) {
    let content: string | Buffer;

    if (typeof body.c === 'string') {
      content = body.c;
    } else {
      const arrayBuffer = await body.c.arrayBuffer();
      content = Buffer.from(arrayBuffer);
    }

    await redis.hset(key, {
      type: 'paste',
      content,
      expire,
    });
  } else {
    throw new Error('Invalid body');
  }

  await redis.expire(key, ttl);

  return {
    code,
    expire,
    url: `${config.baseUrl}/${code}`,
  };
};
