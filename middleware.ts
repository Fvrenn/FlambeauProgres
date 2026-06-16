import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request, {
        cookiePrefix: "better-auth"
    });

    if (!sessionCookie) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api/auth|login|signup|_next/static|_next/image|favicon.ico).*)'
    ],
};