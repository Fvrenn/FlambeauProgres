import { NextResponse } from "next/server";

import { getSessionWp, oublierSessionWp } from "@/lib/wordpress-auth";
import { buildWpLogoutUrl } from "@/lib/wp-redirect";

export async function GET() {
  const session = await getSessionWp();

  await oublierSessionWp();

  const wp = session.statut === "connecte" ? session.wp : undefined;

  return NextResponse.redirect(
    buildWpLogoutUrl({ logoutUrl: wp?.logout_url, nonce: wp?.logout_nonce }),
  );
}
