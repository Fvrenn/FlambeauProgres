import { readFile } from "fs/promises";

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getUser } from "@/lib/auth-server";
import { canAccessJustification } from "@/lib/auth-guards";
import { StorageService } from "@/services/storage.service";

// Lecture du système de fichiers → runtime Node.js obligatoire.
export const runtime = "nodejs";

/**
 * Sert un fichier de justification de façon AUTHENTIFIÉE.
 * Seuls le Chef propriétaire ou un Référent assigné à l'étape peuvent y accéder.
 * Remplace l'ancien accès public via /public.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const fichier = await prisma.fichier.findUnique({
      where: { id },
      select: {
        justificationId: true,
        cheminFichier: true,
        mimeType: true,
        nomOriginal: true,
      },
    });

    if (!fichier) {
      return NextResponse.json(
        { error: "Fichier introuvable" },
        { status: 404 },
      );
    }

    const role = "role" in user ? user.role : undefined;
    const allowed = await canAccessJustification(
      user.id,
      role,
      fichier.justificationId,
    );

    if (!allowed) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    let data: Buffer;

    try {
      data = await readFile(StorageService.resolvePath(fichier.cheminFichier));
    } catch {
      return NextResponse.json(
        { error: "Fichier introuvable" },
        { status: 404 },
      );
    }

    const safeName = fichier.nomOriginal.replace(/["\\\r\n]/g, "");

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": fichier.mimeType || "application/octet-stream",
        "Content-Disposition": `inline; filename="${safeName}"`,
        // Empêche le navigateur de "renifler" le type → neutralise un fichier piégé.
        "X-Content-Type-Options": "nosniff",
        // Contenu sensible (RGPD) : pas de cache partagé.
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Erreur lors de la lecture du fichier:", error);

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
