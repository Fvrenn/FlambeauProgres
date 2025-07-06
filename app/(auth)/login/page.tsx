import { Input, Button, Link, Card, CardBody } from "@/components/ui";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card theme="auth" className="w-full max-w-md">
        <CardBody className="p-8">
          {/* Titre de bienvenue */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Bienvenue</h1>
            <p className="text-gray-600 text-sm">
              Connectez-vous à votre espace Flambeau Progrès pour accéder à vos
              badges, suivre votre progression et découvrir de nouvelles
              aventures.
            </p>
          </div>

          {/* Formulaire */}
          <form className="space-y-6">
            {/* Input Email */}
            <div className="flex flex-col gap-5">
              <Input
                theme="default"
                type="email"
                label="Email"
                placeholder="Entrez votre adresse email"
                labelPlacement="outside"
              />
              <Input
                theme="default"
                type="password"
                label="Mot de passe"
                placeholder="Entrez votre mot de passe"
              />
            </div>

            {/* Bouton mot de passe oublié */}
            <div className="flex justify-end">
              <Link theme="auth" href="" size="sm" className="text-sm">
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton Sign In */}
            <Button theme="default" type="submit" fullWidth>
              Se connecter
            </Button>
          </form>

          {/* Lien inscription */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Vous n'avez pas de compte ?{" "}
              <Link theme="auth" href="/register" className="font-medium">
                Inscrivez-vous
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
