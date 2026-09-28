import { NextResponse } from "next/server";

import { buildWpLogoutUrl } from "@/lib/wp-redirect";

export function GET() {
  return NextResponse.redirect(buildWpLogoutUrl());
}
