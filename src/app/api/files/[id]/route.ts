import { readFile } from "fs/promises";

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getUser } from "@/lib/auth-server";
import { canAccessJustification } from "@/lib/auth-guards";
import { StorageService } from "@/services/storage.service";

export const runtime = "nodejs";

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
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Erreur lors de la lecture du fichier:", error);

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
