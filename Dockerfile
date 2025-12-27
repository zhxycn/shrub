FROM oven/bun AS build

WORKDIR /app

COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install

COPY ./src ./src

ENV NODE_ENV=production

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--outfile server \
	src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/server server

ENV NODE_ENV=production \
	PORT=3000 \
	REDIS_HOST=redis \
	REDIS_PORT=6379 \
	REDIS_DB=0 \
	REDIS_PASSWORD= \
	DEFAULT_TTL=86400 \
	BASE_URL=http://localhost:3000 \
	AUTH_SECRET=secret

CMD ["./server"]

EXPOSE ${PORT}