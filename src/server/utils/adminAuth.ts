import { NextRequest, NextResponse } from 'next/server';
import { env } from '~/env';

// Basic auth middleware for admin panel
export async function adminAuthMiddleware(request: NextRequest) {
  // Get the authorization header
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
  const base64Auth = authHeader.split(' ')[1] ?? '';
  const decodedAuth = Buffer.from(base64Auth, 'base64').toString('utf-8');
  const [username, password] = decodedAuth.split(':');

  // Compare with environment variables
  if (username !== env.ADMIN_USERNAME || password !== env.ADMIN_PASSWORD) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }

  // Authentication successful, proceed to the actual handler
  return null;
}

// Function to check admin authentication for API routes
export function isAdminAuthenticated(req: Request): boolean {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  // Decode the base64 auth string
  const base64Auth = authHeader.split(' ')[1] ?? '';
  const decodedAuth = Buffer.from(base64Auth, 'base64').toString('utf-8');
  const [username, password] = decodedAuth.split(':');

  // Compare with environment variables
  return username === env.ADMIN_USERNAME && password === env.ADMIN_PASSWORD;
}
