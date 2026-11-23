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

// Candidate assessment subdomain(s). Comma-separated; e.g. "careers.oyuns.mn".
// "careers.localhost" always works for local development.
const assessmentHosts = (process.env.ASSESSMENT_HOST || "careers.oyuns.mn")
  .split(",")
  .map((h) => h.trim().toLowerCase())
  .filter(Boolean);

function requestHost(request: NextRequest) {
  const raw = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  return raw.split(",")[0].trim().toLowerCase().replace(/:\d+$/, "");
}

function isAssessmentHost(host: string) {
  return assessmentHosts.includes(host) || host === "careers.localhost";
}

function noindex(response: NextResponse) {
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
  return response;
}

function assessmentMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/assessment/")) return noindex(NextResponse.next());
  if (pathname.startsWith("/api/")) return noindex(new NextResponse(null, { status: 404 }));
  if (pathname.includes(".")) return noindex(NextResponse.next()); // static files

  if (pathname === "/" || pathname === "/assessment") {
    const url = request.nextUrl.clone();
    url.pathname = "/assessment";
    return noindex(NextResponse.rewrite(url));
  }

  // Any other path on the subdomain goes to the single assessment page.
  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  return noindex(NextResponse.redirect(url));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAssessmentHost(requestHost(request))) return assessmentMiddleware(request);

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
