import { NextRequest, NextResponse } from "next/server";

import { buildWpLoginUrl } from "@/lib/wp-redirect";
import { CURRENT_URL_HEADER } from "@/lib/current-url";
import { urlPublique } from "@/lib/public-url";
import { construireCsp, ENTETE_CSP, genererNonce } from "@/lib/csp";
import { ROUTE_DECONNEXION } from "@/config/navigation";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === ROUTE_DECONNEXION) {
    return NextResponse.next();
  }

  const isWpAuthenticated = request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith("wordpress_logged_in"));

  const urlCourante = urlPublique(request.nextUrl, request.headers);

  if (!isWpAuthenticated) {
    return NextResponse.redirect(buildWpLoginUrl(urlCourante));
  }

  const csp = construireCsp(
    genererNonce(),
    process.env.NODE_ENV === "development",
  );
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set(CURRENT_URL_HEADER, urlCourante);
  requestHeaders.set(ENTETE_CSP, csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set(ENTETE_CSP, csp);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|svg|webp|gif|pdf|glb|webmanifest|woff|woff2)$).*)",
  ],
};
