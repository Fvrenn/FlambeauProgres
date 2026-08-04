import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

import { buildWpLoginUrl } from "@/lib/wp-redirect";
import { CURRENT_URL_HEADER } from "@/lib/current-url";

const AUTH_PROVIDER = process.env.AUTH_PROVIDER ?? "better-auth";

export async function middleware(request: NextRequest) {
  if (AUTH_PROVIDER === "wordpress") {
    const isWpAuthenticated = request.cookies
      .getAll()
      .some((cookie) => cookie.name.startsWith("wordpress_logged_in"));

    if (!isWpAuthenticated) {
      return NextResponse.redirect(
        buildWpLoginUrl(request.nextUrl.toString()),
      );
    }

    const requestHeaders = new Headers(request.headers);

    requestHeaders.set(CURRENT_URL_HEADER, request.nextUrl.toString());

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const sessionCookie = getSessionCookie(request, {
    cookiePrefix: "better-auth",
  });

  if (!sessionCookie) {
    const url = request.nextUrl.clone();

    url.pathname = "/login";

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|login|signup|_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|svg|webp|gif|pdf|glb|webmanifest|woff|woff2)$).*)",
  ],
};
