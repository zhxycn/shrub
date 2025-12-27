import { Elysia } from 'elysia';
import { openapi } from '@elysiajs/openapi';
import { config } from './config';
import { auth, guard } from './modules/auth';
import { create, createSchema, get, getSchema, remove, removeSchema } from './modules/app';

export const app = new Elysia()
  .use(openapi())
  .use(auth)
  .post('/', create, {
    ...createSchema,
    beforeHandle: guard,
  })
  .get('/:code', get, getSchema)
  .delete('/:code', remove, {
    ...removeSchema,
    beforeHandle: guard,
  })
  .listen(config.port);
