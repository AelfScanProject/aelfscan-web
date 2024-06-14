import { NextRequest, NextResponse } from 'next/server';
const matcher = ['/nft', '/nftItem'];
export function middleware(request: NextRequest) {
  // Check that the request path matches your plug-in route
  if (matcher.some((prefix) => request.nextUrl.pathname.startsWith(prefix))) {
    return NextResponse.rewrite(new URL('/pluginsPage', request.url));
  }
  return NextResponse.next();
}

// Specify which paths the Middleware should be applied to
export const config = {
  matcher: matcher,
};
