# goat-it-api

## Installation

```bash
$ pnpm install
```

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Server Configuration
HOST=0.0.0.0
PORT=3000

# CORS Configuration
CORS_ORIGIN=*
CORS_CREDENTIALS=false
```

### CORS Configuration

CORS is configured in `src/server/server.ts`. See [CORS Configuration Documentation](docs/cors-configuration.md) for detailed information.

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```