export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  const { verifierConfigurationUrl } = await import("@/lib/public-url");

  verifierConfigurationUrl();
}
