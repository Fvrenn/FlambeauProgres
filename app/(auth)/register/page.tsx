import { Input, Button, Link, Card, CardBody } from "@/components/ui";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card theme="auth" className="w-full max-w-md">
        <CardBody className="p-8">
          {/* Titre de bienvenue */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Rejoignez-nous
            </h1>
            <p className="text-gray-600 text-sm">
              Créez votre compte Flambeau Progrès pour commencer votre aventure
              scoute, débloquer des badges et suivre votre progression.
            </p>
          </div>

          {/* Formulaire */}
          <form className="space-y-6">
            {/* Input fields */}
            <div className="flex flex-col gap-5">
              <div className="flex gap-5">
                <Input
                  theme="default"
                  type="text"
                  label="Prénom"
                  placeholder="Entrez votre prénom"
                  labelPlacement="outside"
                />
                <Input
                  theme="default"
                  type="text"
                  label="Nom"
                  placeholder="Entrez votre nom"
                  labelPlacement="outside"
                />
              </div>

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
                placeholder="Créez un mot de passe"
              />
              <Input
                theme="default"
                type="password"
                label="Confirmer le mot de passe"
                placeholder="Confirmez votre mot de passe"
              />
            </div>

            {/* Bouton Sign Up */}
            <Button theme="default" type="submit" fullWidth>
              Créer mon compte
            </Button>
          </form>

          {/* Lien connexion */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Vous avez déjà un compte ?{" "}
              <Link theme="auth" href="/login" className="font-medium">
                Connectez-vous
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
