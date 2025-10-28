// Temporarily disabled Clerk authentication
// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// const protectedRoute = createRouteMatcher([
//   '/',
//   '/upcoming',
//   '/meeting(.*)',
//   '/previous',
//   '/recordings',
//   '/personal-room',
// ]);

// export default clerkMiddleware((auth, req) => {
//   if (protectedRoute(req)) auth().protect();
// });

// Temporary no-op middleware - just passes through all requests
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
