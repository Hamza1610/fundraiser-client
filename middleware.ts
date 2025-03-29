// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set(
    'Content-Security-Policy',
    "script-src 'self' https://js.stripe.com blob:;" +
    "connect-src 'self' https://api.stripe.com;" +
    "frame-src 'self' https://js.stripe.com;" +
    "style-src 'self' 'unsafe-inline';"
  );
  return response;
}