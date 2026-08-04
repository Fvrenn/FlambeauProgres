import { headers } from "next/headers";

export const CURRENT_URL_HEADER = "x-current-url";

export async function getCurrentUrl(): Promise<string | undefined> {
  const headersList = await headers();

  return headersList.get(CURRENT_URL_HEADER) ?? undefined;
}
