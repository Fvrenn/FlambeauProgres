import { redirect } from "next/navigation";

import { buildWpLoginUrl } from "@/lib/wp-redirect";
import { getCurrentUrl } from "@/lib/current-url";

export async function redirectToLogin(): Promise<never> {
  const currentUrl = await getCurrentUrl();

  redirect(buildWpLoginUrl(currentUrl));
}
