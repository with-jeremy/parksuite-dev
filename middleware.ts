import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define route matchers
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']);
const isPublicRoute = createRouteMatcher(['/', '/(auth)/(.*)', '/(marketing)/(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const authObj = await auth();
  
  // Allow access to public routes without authentication
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }
  
  // Require authentication for /dashboard routes
  if (isDashboardRoute(req)) {
    if (!authObj.userId) {
      const url = new URL('/sign-in', req.url);
      return NextResponse.redirect(url);
    }
    // Allow any signed-in user
    return NextResponse.next();
  }

  // Protect all routes starting with `/admin`
  if (isAdminRoute(req)) {
    // Check if user is authenticated
    if (!authObj.userId) {
      const url = new URL('/sign-in', req.url);
      return NextResponse.redirect(url);
    }
    
    // Check if user is an admin
    if (!(authObj.sessionClaims?.metadata?.role === 'admin')) {
      const url = new URL('/', req.url);
      return NextResponse.redirect(url);
    }
    
    // User is authenticated and has admin role
    return NextResponse.next();
  }
  
  // Default: allow access
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}