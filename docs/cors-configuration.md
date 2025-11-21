# CORS Configuration

## Overview

This NestJS/Fastify API manages CORS (Cross-Origin Resource Sharing) rules in the server bootstrap file.

## Configuration

The CORS setup is located in `src/server/server.ts` within the `bootstrap()` function:

```typescript
app.enableCors(createCorsConfig());
```

### Environment Variables

Configure CORS using these environment variables:

- **`CORS_ORIGIN`**: Allowed origin(s) (default: `*`)
  - Single origin: `https://example.com`
  - Multiple origins (comma-separated): `https://app.example.com,https://admin.example.com`
  - Allow all origins (development only): `*`
- **`CORS_CREDENTIALS`**: Enable credentials (default: `false`)
  - Set to `true` to allow cookies and authentication headers
  - Must be a string `"true"` or `"false"` in `.env` file

### Default Configuration

The default configuration allows all origins without credentials. This is suitable for **development only** and should be updated before production deployment.

```typescript
{
  origin: "*",
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}
```

### Configuration Examples

**Development (current default)**:

```bash
CORS_ORIGIN=*
CORS_CREDENTIALS=false
```

**Production with single frontend**:

```bash
CORS_ORIGIN=https://app.example.com
CORS_CREDENTIALS=true
```

**Production with multiple frontends**:

```bash
CORS_ORIGIN=https://app.example.com,https://admin.example.com,https://mobile.example.com
CORS_CREDENTIALS=true
```

**Staging environment**:

```bash
CORS_ORIGIN=https://staging.example.com
CORS_CREDENTIALS=false
```

## Related Files

1. **`src/server/server.ts`**: Main bootstrap configuration
2. **`src/server/cors/cors.ts`**: CORS builder function
3. **`src/server/cors/cors.constants.ts`**: Default CORS configuration constants
4. **`src/server/cors/cors.types.ts`**: TypeScript type definitions
5. **`src/server/cors/cors.spec.ts`**: CORS configuration tests
6. **`.env.example`**: Environment variables examples

## Best Practices

1. **Development vs Production**: The default `origin: "*"` is intentionally permissive for early development. Replace it with specific domain(s) before deploying to production.
2. **Security**: Never use `origin: "*"` with `credentials: true` - this combination is rejected by browsers.
3. **Multiple Origins**: When specifying multiple origins, use comma-separated values without spaces.
4. **Credentials**: Only enable `credentials: true` when your frontend needs to send cookies or authentication headers.
5. **Testing**: Include CORS rules validation in your integration tests.

## Debugging

To debug CORS issues:

1. Check response headers in browser DevTools
2. Test manually with `curl`:

```bash
curl -H "Origin: https://example.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     http://localhost:3000/api/endpoint
```

Expected response headers should include:

```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```
