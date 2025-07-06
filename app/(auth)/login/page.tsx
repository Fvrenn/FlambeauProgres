
import { Input, Button, Link, Card, CardBody } from "@/components/ui";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardBody className="p-8">
          {/* Titre de bienvenue */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Bienvenue
            </h1>
            <p className="text-gray-600 text-sm">
              Connectez-vous à votre espace Flambeau Progrès pour accéder à vos badges, 
              suivre votre progression et découvrir de nouvelles aventures scoutes.
            </p>
          </div>

          {/* Formulaire */}
          <form className="space-y-6">
            {/* Input Email */}
            <Input
              type="email"
              label="Email"
              placeholder="Entrez votre adresse email"
            />

            {/* Input Password */}
            <Input
              type="password"
              label="Mot de passe"
              placeholder="Entrez votre mot de passe"
            />

            {/* Bouton mot de passe oublié */}
            <div className="flex justify-end">
              <Button
                variant="light"
                color="primary"
                size="sm"
                className="text-sm"
              >
                Mot de passe oublié ?
              </Button>
            </div>

            {/* Bouton Sign In */}
            <Button
              type="submit"
              fullWidth
              size="lg"
            >
              Se connecter
            </Button>
          </form>

          {/* Lien inscription */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Vous n'avez pas de compte ?{" "}
              <Link 
                href="/register" 
                className="text-primary hover:text-primary-600 font-medium underline"
              >
                Inscrivez-vous
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
