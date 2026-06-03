export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold">Accès non autorisé</h1>
      <p className="mt-4 text-lg">
        Vous n'avez pas la permission d'accéder à cette page.
      </p>
      <a className="mt-6 text-primary-500 hover:underline" href="/">
        Retour à l'accueil
      </a>
    </div>
  );
}
