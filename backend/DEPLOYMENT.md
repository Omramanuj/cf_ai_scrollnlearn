# Cloudflare Workers Deployment Guide

This guide will help you deploy your ScrollLearn backend to Cloudflare Workers.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI**: Install the Cloudflare Workers CLI tool
3. **Node.js**: Version 18 or higher
4. **MongoDB Atlas**: For database (or any MongoDB-compatible database)
5. **Google Gemini API Key**: For AI content generation

## Installation

1. **Install Wrangler CLI globally:**
   ```bash
   npm install -g wrangler
   ```

2. **Install project dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Login to Cloudflare:**
   ```bash
   wrangler login
   ```

## Configuration

### 1. Environment Variables

Set up your environment variables using Wrangler:

```bash
# Set MongoDB connection string
wrangler secret put MONGODB_URI
# Enter your MongoDB Atlas connection string when prompted

# Set Gemini API key
wrangler secret put GEMINI_API_KEY
# Enter your Google Gemini API key when prompted
```

### 2. Update CORS Origins (Optional)

If you want to restrict CORS to specific domains, edit `src/index.ts` and update the `corsHeaders`:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://yourdomain.com', // Replace with your frontend domain
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};
```

## Deployment

### Development/Testing

Run locally for development:

```bash
npm run dev
```

This will start a local development server at `http://localhost:8787`

### Production Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

### Staging Deployment

Deploy to staging environment:

```bash
npm run deploy:staging
```

## API Endpoints

Once deployed, your API will be available at:
- Production: `https://scrolllearn-backend.your-subdomain.workers.dev`
- Staging: `https://scrolllearn-backend-staging.your-subdomain.workers.dev`

### Available Endpoints:

1. **Health Check**
   - `GET /` or `GET /health` - Basic health check
   - `GET /ping` - Ping endpoint

2. **Content Generation**
   - `POST /api/request` - Generate educational content
   - Body: `{ "topic": "string", "level": "string", "description": "string" }`

3. **Topics**
   - `GET /api/topics` - Get all topics
   - `GET /api/topics-content/{topicId}` - Get topic with cards

## Monitoring and Logs

### View Logs

```bash
# View real-time logs
wrangler tail

# View logs for specific environment
wrangler tail --env production
wrangler tail --env staging
```

### Monitor Performance

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to Workers & Pages
3. Select your worker
4. View analytics, logs, and performance metrics

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify MongoDB URI is correct
   - Check if your IP is whitelisted in MongoDB Atlas
   - Ensure the database name is correct

2. **API Key Issues**
   - Verify Gemini API key is valid
   - Check API quota and billing

3. **CORS Issues**
   - Update CORS headers in `src/index.ts`
   - Ensure frontend domain is allowed

4. **Build Issues**
   - Run `npm run build` to check for TypeScript errors
   - Ensure all dependencies are installed

### Debug Mode

Enable debug logging by adding this to your worker:

```typescript
// Add at the top of your handler
console.log('Request URL:', request.url);
console.log('Request Method:', request.method);
console.log('Environment:', Object.keys(env));
```

## Environment Management

### Production Environment
- Use `wrangler deploy` for production
- Set up monitoring and alerts
- Configure custom domain (optional)

### Staging Environment
- Use `wrangler deploy --env staging` for staging
- Test new features before production
- Use separate database if needed

## Custom Domain (Optional)

To use a custom domain:

1. Add your domain to Cloudflare
2. Create a CNAME record pointing to your worker
3. Update `wrangler.toml` with your domain:

```toml
[env.production]
name = "scrolllearn-backend"
route = "api.yourdomain.com/*"
```

## Security Considerations

1. **Environment Variables**: Never commit secrets to version control
2. **CORS**: Restrict origins to your frontend domains
3. **Rate Limiting**: Consider implementing rate limiting
4. **Input Validation**: Validate all input data
5. **Error Handling**: Don't expose sensitive information in errors

## Performance Optimization

1. **Database Connection Pooling**: Already implemented
2. **Caching**: Consider adding response caching
3. **Compression**: Enable gzip compression
4. **CDN**: Cloudflare automatically provides CDN

## Support

For issues specific to:
- **Cloudflare Workers**: [Cloudflare Documentation](https://developers.cloudflare.com/workers/)
- **MongoDB**: [MongoDB Documentation](https://docs.mongodb.com/)
- **Google Gemini**: [Google AI Documentation](https://ai.google.dev/docs)
