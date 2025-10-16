import { auth } from "@/src//lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. Obtenir la session de manière sécurisée (côté serveur)
    const session = await auth.api.getSession({
        headers: await headers()
    });

    // 2. Si pas de session, on redirige vers la page de login
    if (!session) {
        redirect("/login"); // Redirige vers votre page dans (auth)
    }

    // 3. Si la session existe, on affiche la page
    return (
        <div>
            {/* Vous pouvez mettre une navbar ou un header commun ici */}
            {children}
        </div>
    );
}