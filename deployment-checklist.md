# Remote API Deployment Checklist

## Environment Variables Required
The following environment variables must be set on your remote server (Render.com):

### Database Configuration
```
DATABASE_URL=your_neon_database_connection_string
```

### Redis/Upstash Configuration (for rate limiting)
```
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
```

### API Configuration
```
API_URL=https://wallet-api-ejp8.onrender.com/api
PORT=5001
NODE_ENV=production
```

## Common Issues and Solutions

### 1. 502 Bad Gateway on Summary Endpoint
**Cause**: Database connection issues or Redis configuration problems
**Solution**: 
- Verify DATABASE_URL is correct and accessible
- Check Redis credentials are valid
- Ensure database tables exist (transactions table)

### 2. Cron Job Issues
**Cause**: API_URL environment variable not set
**Solution**: Set API_URL to your deployed API URL

### 3. Rate Limiting Problems
**Cause**: Redis connection failures
**Solution**: 
- Verify UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
- Check if Redis service is accessible from your deployment

## Testing Commands
Test your deployed API with these curl commands:

```bash
# Test health endpoint
curl https://wallet-api-ejp8.onrender.com/api/health

# Test transactions endpoint
curl https://wallet-api-ejp8.onrender.com/api/transactions/test_user_id

# Test summary endpoint
curl https://wallet-api-ejp8.onrender.com/api/transactions/summary/test_user_id
```

## Deployment Steps
1. Set all required environment variables in your deployment platform
2. Deploy the backend code
3. Test all endpoints after deployment
4. Check server logs for any errors
5. Verify database connections are working

## Debugging Tips
- Check deployment platform logs for startup errors
- Verify database connection strings
- Test Redis connectivity
- Monitor API responses for specific error messages
