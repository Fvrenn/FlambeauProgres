import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    // 1. Vérifie juste si le cookie de session EXISTE
    const sessionCookie = getSessionCookie(request);

    // 2. Si le cookie n'existe pas, on redirige vers le login
    if (!sessionCookie) {
        // Redirige vers /login en gardant les paramètres de l'URL
        // (ex: s'il voulait aller sur /dashboard?id=123)
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // 3. Si le cookie existe, on laisse la requête continuer
    // (Le layout (app)/layout.tsx fera la VRAIE validation)
    return NextResponse.next();
}

// 4. Le Matcher : applique ce middleware à TOUT
// SAUF aux pages publiques (login, api, images, etc.)
export const config = {
    matcher: [
        '/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)'
    ],
};