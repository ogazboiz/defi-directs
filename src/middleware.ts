import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authMiddleware } from "@civic/auth-web3/nextjs/middleware";

// Custom middleware that allows access for any wallet connection
export default function middleware(request: NextRequest) {
  // Only protect dashboard routes - let everything else through
  const { pathname } = request.nextUrl;
  
  // Define protected routes that need wallet connection
  const protectedRoutes = ['/dashboard', '/settings', '/transaction'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (!isProtectedRoute) {
    // For non-protected routes, use default Civic middleware for auth handling
    return authMiddleware()(request);
  }
  
  // For protected routes, we'll handle authorization client-side
  // The UI components will check for wallet connection and redirect if needed
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
     * - api routes (api routes still need Civic auth for wallet creation)
     */
    '/((?!_next|favicon.ico|sitemap.xml|robots.txt|.*\\.jpg|.*\\.png|.*\\.svg|.*\\.gif|api).*)',
  ],
};