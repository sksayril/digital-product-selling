import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect admin routes in the frontend
  if (path.startsWith('/admin')) {
    // Get the authorization header (if any)
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      });
    }

    // Decode the base64 auth string
    try {
      const base64Auth = authHeader.split(' ')[1] ?? '';
      const decodedAuth = Buffer.from(base64Auth, 'base64').toString('utf-8');
      const [username, password] = decodedAuth.split(':');

      // Get admin credentials from environment variables
      const adminUsername = process.env.ADMIN_USERNAME;
      const adminPassword = process.env.ADMIN_PASSWORD;

      // Compare with environment variables
      if (username !== adminUsername || password !== adminPassword) {
        return new NextResponse('Unauthorized', {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Admin Area"',
          },
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      });
    }
  }

  return NextResponse.next();
}

// Only apply middleware to admin routes
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
