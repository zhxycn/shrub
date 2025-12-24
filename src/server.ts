import { Elysia } from 'elysia';
import { openapi } from '@elysiajs/openapi';
import { config } from './config';
import { create, createSchema } from './modules/create';
import { get, getSchema } from './modules/get';
import { remove, removeSchema } from './modules/remove';

export const app = new Elysia()
  .use(openapi())
  .post('/', create, createSchema)
  .get('/:code', get, getSchema)
  .delete('/:code', remove, removeSchema)
  .listen(config.port);
