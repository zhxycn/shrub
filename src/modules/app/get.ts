import { NotFoundError, t } from 'elysia';
import { fileTypeFromBuffer } from 'file-type';
import { redis } from '../../data/redis';

export const getSchema = {
  params: t.Object({
    code: t.String({ minLength: 4, maxLength: 4 }),
  }),
};

export const get = async ({ params: { code } }: { params: { code: string } }) => {
  const key = `shrub:${code}`;
  const [type, url] = await redis.hmget(key, 'type', 'url');

  if (!type) {
    throw new NotFoundError();
  }

  if (type === 'url') {
    if (!url) throw new NotFoundError();
    return Response.redirect(url);
  } else if (type === 'paste') {
    const content = await redis.hgetBuffer(key, 'content');
    if (!content) throw new NotFoundError();

    const type = (await fileTypeFromBuffer(content))?.mime || 'text/plain; charset=utf-8';

    const response = new Response(content as BlobPart);
    response.headers.set('Content-Type', type);
    response.headers.set('Content-Disposition', 'inline');
    return response;
  }
};
