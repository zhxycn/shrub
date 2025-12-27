import { Elysia } from 'elysia';
import { config } from '../../config';

export const auth = (app: Elysia) => app
  .derive(({ headers }) => {
    if (!config.auth.secret) {
      return {
        isAuthorized: true,
      };
    }

    const authHeader = headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    return {
      isAuthorized: token === config.auth.secret,
    };
  });
