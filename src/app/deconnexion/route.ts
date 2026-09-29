import { NextResponse } from "next/server";

import { getSessionWp, oublierSessionWp } from "@/lib/wordpress-auth";
import { buildWpLogoutUrl } from "@/lib/wp-redirect";

export async function GET() {
  const session = await getSessionWp();

  await oublierSessionWp();

  const nonce =
    session.statut === "connecte" ? session.wp.logout_nonce : undefined;

  return NextResponse.redirect(buildWpLogoutUrl(nonce));
}
