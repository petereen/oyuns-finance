import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isIndexingAllowed } from "@/lib/indexing";

const locales = ["mn", "ru"];
const defaultLocale = "mn";

function getLocale() {
  // Keep the public, locale-less entry point deterministic. Users can still
  // switch language explicitly from the navbar.
  return defaultLocale;
}

function withRobots(response: NextResponse) {
  if (!isIndexingAllowed()) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
  }
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return withRobots(NextResponse.next());

  // Exclude internal paths, API routes, and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // file extension (svg, png, ico, etc)
  ) {
    return withRobots(NextResponse.next());
  }

  // Redirect if there is no locale
  const locale = getLocale();
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return withRobots(NextResponse.redirect(request.nextUrl));
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
  ],
};
