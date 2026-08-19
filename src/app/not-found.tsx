import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-dashboard flex h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-6xl font-bold text-default-300">404</p>
      <h1 className="text-2xl font-semibold">Page introuvable</h1>
      <p className="max-w-md text-default-500">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        className="mt-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
        href="/"
      >
        Retour au tableau de bord
      </Link>
    </div>
  );
}
