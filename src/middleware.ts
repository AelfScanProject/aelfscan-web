import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check that the request path matches your plug-in route
  if (request.nextUrl.pathname.startsWith('/nft')) {
    return NextResponse.rewrite(new URL('/pluginsPage', request.url));
  } else if (request.nextUrl.pathname.startsWith('/nftItem')) {
    return NextResponse.rewrite(new URL('/pluginsPage', request.url));
  }
  return NextResponse.next();
}

// Specify which paths the Middleware should be applied to
export const config = {
  matcher: ['/nft/:path*', '/nft', '/nftItem', '/nftItem/:path*'],
};
