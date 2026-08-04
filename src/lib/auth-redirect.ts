import { redirect } from "next/navigation";

import { buildWpLoginUrl } from "@/lib/wp-redirect";
import { getCurrentUrl } from "@/lib/current-url";

const AUTH_PROVIDER = process.env.AUTH_PROVIDER ?? "better-auth";

export async function redirectToLogin(): Promise<never> {
  if (AUTH_PROVIDER === "wordpress") {
    const currentUrl = await getCurrentUrl();

    redirect(buildWpLoginUrl(currentUrl));
  }

  redirect("/login");
}
