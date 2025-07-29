import { NextResponse } from 'next/server';

// Simplified middleware for AppKit - no server-side auth needed
// AppKit handles all authentication client-side
export default function middleware() {
  // With AppKit, we handle wallet connection entirely client-side
  // No need for server-side authentication middleware

  // You can add any custom logic here if needed
  // For example, redirecting old routes, etc.

  return NextResponse.next();
}

export const config = {
  // include the paths you wish to secure here
  matcher: [
    /*
     * Match all request paths except:
     * - _next directory (Next.js static files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - image files
     * - api routes (api routes are protected by default)
     */
    '/((?!_next|favicon.ico|sitemap.xml|robots.txt|.*\\.jpg|.*\\.png|.*\\.svg|.*\\.gif|api).*)',
  ],
};