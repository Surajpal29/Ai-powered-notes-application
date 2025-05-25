import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Middleware to protect authenticated routes
 * Redirects to sign-in page if user is not authenticated
 */
export async function middleware(request) {
  // Get the pathname
  const path = request.nextUrl.pathname;
  
  // Public paths that don't require authentication
  const isPublicPath = path === '/' || path.startsWith('/auth/');
  
  try {
    // Get the token and verify authentication
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Redirect authenticated users away from auth pages
    if (isPublicPath && token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect unauthenticated users to sign in
    if (!isPublicPath && !token) {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api/auth/* (NextAuth.js paths)
     * 2. /_next/* (Next.js internals)
     * 3. /static/* (static files)
     * 4. /favicon.ico, /robots.txt (public files)
     */
    '/((?!api/auth|_next|static|favicon.ico|robots.txt).*)',
  ],
}; 