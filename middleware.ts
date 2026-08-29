import { NextRequest, NextResponse } from "next/server";

import { buildWpLoginUrl } from "@/lib/wp-redirect";
import { CURRENT_URL_HEADER } from "@/lib/current-url";
import { urlPublique } from "@/lib/public-url";

export async function middleware(request: NextRequest) {
  const isWpAuthenticated = request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith("wordpress_logged_in"));

  const urlCourante = urlPublique(request.nextUrl, request.headers);

  if (!isWpAuthenticated) {
    return NextResponse.redirect(buildWpLoginUrl(urlCourante));
  }

  const requestHeaders = new Headers(request.headers);

  requestHeaders.set(CURRENT_URL_HEADER, urlCourante);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|svg|webp|gif|pdf|glb|webmanifest|woff|woff2)$).*)",
  ],
};
