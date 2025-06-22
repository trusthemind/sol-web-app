import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, type Locale } from "./lib/i18n";
import { AppRoutes } from "./shared/constants/navigation";
import { AuthCookies } from "./shared/types/Cookies.type";

function getLocale(request: NextRequest): Locale {
  const localeCookie = request.cookies.get("locale")?.value;
  if (localeCookie && locales.includes(localeCookie as Locale)) {
    return localeCookie as Locale;
  }

  const acceptLanguage = request.headers.get("accept-language") || "";

  if (acceptLanguage.includes("uk") || acceptLanguage.includes("ua")) {
    return "ua";
  }

  return defaultLocale;
}

function isValidRoute(pathname: string): boolean {
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";
  const validPaths: AppRoutes[] | string[] = Object.values(AppRoutes);

  // Check the clean path, not the original pathname
  if (pathWithoutLocale === AppRoutes.ADMIN) {
    return true;
  }

  return validPaths.includes(pathWithoutLocale as AppRoutes);
}

function isAuthRequired(pathname: string): boolean {
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";
  const publicRoutes = [AppRoutes.AUTH];

  return !publicRoutes.includes(pathWithoutLocale as AppRoutes);
}

function isAuthRoute(pathname: string): boolean {
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";
  return pathWithoutLocale === AppRoutes.AUTH;
}

function createAuthRedirectResponse(
  request: NextRequest,
  locale: Locale
): NextResponse {
  const authUrl = new URL(`/${locale}${AppRoutes.AUTH}`, request.url);
  const response = NextResponse.redirect(authUrl);

  response.cookies.delete(AuthCookies.AUTH_TOKEN);
  return response;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = getLocale(request);

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const authToken = request.cookies.get(AuthCookies.AUTH_TOKEN)?.value;
  const isAuthenticated = !!authToken;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  const cleanPathname = pathnameHasLocale
    ? pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/"
    : pathname;

  // Use cleanPathname instead of pathname for route validation
  if (!isValidRoute(cleanPathname)) {
    const authUrl = new URL(`/${locale}${AppRoutes.AUTH}`, request.url);
    return NextResponse.redirect(authUrl);
  }

  if (isAuthenticated) {
    if (isAuthRoute(cleanPathname)) {
      const dashboardUrl = new URL(
        `/${locale}${AppRoutes.DASHBOARD}`,
        request.url
      );
      return NextResponse.redirect(dashboardUrl);
    }
  } else {
    if (isAuthRequired(cleanPathname)) {
      return createAuthRedirectResponse(request, locale);
    }
  }

  if (!pathnameHasLocale) {
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  const response = NextResponse.next();

  response.headers.set("x-middleware-locale", locale);

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\.|favicon.ico).*)"],
};
