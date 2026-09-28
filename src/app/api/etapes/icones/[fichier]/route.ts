import { NextRequest, NextResponse } from "next/server";

import { EtapeIconeService } from "@/services/etape-icone.service";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ fichier: string }> },
) {
  const { fichier } = await params;
  const icone = await EtapeIconeService.read(fichier);

  if (!icone) {
    return NextResponse.json({ error: "Icône introuvable" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(icone), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
