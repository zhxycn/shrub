# Shrub

![Docker Pulls](https://img.shields.io/docker/pulls/zhxycn/shrub) ![Docker Image Size](https://img.shields.io/docker/image-size/zhxycn/shrub)

*Shrub: **Sh**a**r**e H**ub***

A fast, minimal short‑link and paste service

## API

### OpenAPI

Visit `/openapi` endpoint for more details.

### POST `/`

Create a short link or paste:
  - Form fields: `url` or `c` (mutually exclusive), optional `ttl` (default from config)
  - Response: `{"code":"A1b2","expire":"2025-01-01T10:00:00Z","url":"https://example.com/A1b2"}`

### GET `/{code}`

Read a link or paste:
  - Links: `302 Temporary Redirect` to the original URL
  - Pastes: raw bytes

### DELETE `/{code}`

Delete a link or paste:
  - Response: `204 No Content` if successful

## Examples

```sh
# Create a short link
curl -s -F url=https://example.com http://127.0.0.1:8321/
# => {"code":"A1b2","expire":"2025-01-01T10:00:00Z","url":"https://example.com/A1b2"}

# Create a short link with custom TTL
curl -s -F url=https://example.com -F ttl=120 http://127.0.0.1:8321/
# => {"code":"A1b2","expire":"2025-01-01T10:00:00Z","url":"https://example.com/A1b2"}

# Create a paste with custom TTL
echo "hello shrub" | curl -s -F ttl=300 -F "c=@-" http://127.0.0.1:8321/
# => {"code":"A1b2","expire":"2025-01-01T10:00:00Z","url":"https://example.com/A1b2"}

# Create a paste with image
curl -s -F "c=@-" http://127.0.0.1:8321/ < avatar.webp
# => {"code":"A1b2","expire":"2025-01-01T10:00:00Z","url":"https://example.com/A1b2"}

# Delete a link or paste
curl -i -X DELETE http://127.0.0.1:8321/A1b2
# => HTTP/1.1 204 No Content
```

## Self-hosting

### Run with Docker Compose

Create a `.env` file with [.env.example](../.env.example) as template.

Then run:

```sh
docker-compose up -d
```

### Run with Docker

Create a `.env` file with [.env.example](../.env.example) as template.

Then run:

```sh
docker run --env-file .env -d -p 3000:3000 zhxycn/shrub:latest
```

### Run from source

```sh
bun install
bun build --compile --minify-whitespace --minify-syntax --outfile server src/index.ts
chmod +x server
./server
```

## Config

Environment variables such as:
- `PORT=3000`
- `REDIS_HOST=redis`
