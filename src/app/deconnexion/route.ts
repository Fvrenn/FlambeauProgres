import { NextResponse } from "next/server";

import { oublierSessionWp } from "@/lib/wordpress-auth";
import { buildWpLogoutUrl } from "@/lib/wp-redirect";

export async function GET() {
  await oublierSessionWp();

  return NextResponse.redirect(buildWpLogoutUrl());
}
