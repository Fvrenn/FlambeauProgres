import { NextResponse } from "next/server";

import { getSessionWp, oublierSessionWp } from "@/lib/wordpress-auth";
import { buildWpLogoutUrl } from "@/lib/wp-redirect";

export async function GET() {
  const session = await getSessionWp();

  await oublierSessionWp();

  return NextResponse.redirect(buildWpLogoutUrl(session?.logout_nonce));
}
