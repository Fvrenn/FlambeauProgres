import "@/styles/globals.css";
import { Metadata } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { fontSans } from "@/config/fonts";

export const metadata: Metadata = {
  title: {
    default: "Flambeau Progrès",
    template: `%s - Flambeau Progrès`,
  },
  description:
    "Application de suivi pédagogique des Chefs Flambeaux pour l'acquisition de badges, compétences et réalisations.",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="fr">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers>
          <div className="relative flex flex-col h-screen">
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
