import { generateContent } from "./controllers/contentController";
import { getAllTopics, getTopicWithCards } from "./controllers/topicController";

// Cloudflare Workers types
interface Env {
  MONGODB_URI: string;
  GEMINI_API_KEY: string;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Handle CORS preflight requests
function handleCORS(request: Request): Response | null {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  return null;
}

// Add CORS headers to response
function addCORSHeaders(response: Response): Response {
  const newResponse = new Response(response.body, response);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newResponse.headers.set(key, value);
  });
  return newResponse;
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    const corsResponse = handleCORS(request);
    if (corsResponse) return corsResponse;

    try {
      // Health check endpoints
      if (path === '/ping') {
        return addCORSHeaders(new Response(JSON.stringify({ message: "Hello, TypeScript with Cloudflare Workers!" }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      }

      if (path === '/' || path === '/health') {
        return addCORSHeaders(new Response(JSON.stringify({ status: "ping-pong" }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      }

      // API routes
      if (path.startsWith('/api/')) {
        const apiPath = path.replace('/api', '');

        // Content generation endpoint
        if (apiPath === '/request' && request.method === 'POST') {
          const response = await generateContent(request, env);
          return addCORSHeaders(response);
        }

        // Get all topics
        if (apiPath === '/topics' && request.method === 'GET') {
          const response = await getAllTopics(env);
          return addCORSHeaders(response);
        }

        // Get topic with cards
        if (apiPath.startsWith('/topics-content/') && request.method === 'GET') {
          const response = await getTopicWithCards(request, env);
          return addCORSHeaders(response);
        }
      }

      // 404 for unmatched routes
      return addCORSHeaders(new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      }));

    } catch (error) {
      console.error('Error handling request:', error);
      return addCORSHeaders(new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
  },
};
