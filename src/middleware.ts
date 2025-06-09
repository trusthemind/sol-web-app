import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, type Locale } from "./lib/i18n";

function getLocale(request: NextRequest): Locale {
  // Check if there's a locale cookie
  const localeCookie = request.cookies.get("locale")?.value;
  if (localeCookie && locales.includes(localeCookie as Locale)) {
    return localeCookie as Locale;
  }

  // Check Accept-Language header for simple language preference
  const acceptLanguage = request.headers.get("accept-language") || "";
  
  if (acceptLanguage.includes("uk") || acceptLanguage.includes("ua")) {
    return "ua";
  }
  
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip if pathname already starts with a locale
  const pathnameHasLocale = locales.some(locale => 
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If pathname already has a locale, don't redirect
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Only redirect if we're at the root or a path without locale
  const locale = getLocale(request);
  
  // Create the new URL with locale
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next|.*\\.|favicon.ico).*)",
  ],
};