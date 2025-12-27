import { t, type Context } from 'elysia';
import { redis } from '../../data/redis';

export const removeSchema = {
  params: t.Object({
    code: t.String({ minLength: 4, maxLength: 4 }),
  }),
};

export const remove = async ({ params: { code }, set }: { params: { code: string }; set: Context['set'] }) => {
  const key = `shrub:${code}`;
  await redis.del(key);
  set.status = 204;
};
