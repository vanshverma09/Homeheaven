import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basic in-memory store for rate limiting (Note: In production with serverless, use Redis/Upstash)
const rateLimit = new Map();

export function middleware(request: NextRequest) {
  // 1. Basic Rate Limiting for APIs
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const limit = 100; // max requests
    const windowMs = 60 * 1000; // 1 minute

    const current = rateLimit.get(ip) || { count: 0, startTime: Date.now() };

    if (Date.now() - current.startTime > windowMs) {
      current.count = 1;
      current.startTime = Date.now();
    } else {
      current.count += 1;
    }

    rateLimit.set(ip, current);

    if (current.count > limit) {
      return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  const response = NextResponse.next();

  // 2. Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  // Disable caching for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, max-age=0');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
