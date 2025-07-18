"use client";
import { Input, Button, Link, Card, CardBody } from "@/components/ui";
import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { addToast, ToastProvider } from "@heroui/toast";
import { useRouter } from "next/navigation";
import { usePasswordVisibility } from "@/hooks/usePasswordVisibility";
import { Star2, Eye, EyeClosed  } from "@solar-icons/react";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const passwordVisibility = usePasswordVisibility();
  const confirmPasswordVisibility = usePasswordVisibility();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== passwordConfirmation) {
      addToast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "solid",
      });
      return;
    }

    await signUp.email({
      email,
      password,
      name: `${firstName} ${lastName}`,
      callbackURL: "/",
      fetchOptions: {
        onResponse: () => setLoading(false),
        onRequest: () => setLoading(true),
        onError: (ctx) =>
          addToast({
            title: "Erreur",
            description: ctx.error.message,
            variant: "solid",
          }),
        onSuccess: async () => router.push("/"),
      },
    });
  };

  // Composant inline pour l'icône toggle (réutilisable)
  const PasswordToggle = ({ isVisible, onToggle }: { isVisible: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm p-1 hover:bg-gray-100 transition-colors"
      aria-label={isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
    >
      {isVisible ? (
        <EyeClosed size={20} className="text-gray-500 hover:text-gray-700 transition-colors" />
      ) : (
        <Eye size={20} className="text-gray-500 hover:text-gray-700 transition-colors" />
      )}
    </button>
  );

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
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              <div className="flex gap-5">
                <Input
                  theme="default"
                  type="text"
                  label="Prénom"
                  placeholder="Entrez votre prénom"
                  labelPlacement="outside"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <Input
                  theme="default"
                  type="text"
                  label="Nom"
                  placeholder="Entrez votre nom"
                  labelPlacement="outside"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <Input
                theme="default"
                type="email"
                label="Email"
                placeholder="Entrez votre adresse email"
                labelPlacement="outside"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                theme="default"
                type={passwordVisibility.type}
                label="Mot de passe"
                placeholder="Créez un mot de passe"
                labelPlacement="outside"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                endContent={
                  <PasswordToggle 
                    isVisible={passwordVisibility.isVisible} 
                    onToggle={passwordVisibility.toggleVisibility} 
                  />
                }
              />
              
              <Input
                theme="default"
                type={confirmPasswordVisibility.type}
                label="Confirmer le mot de passe"
                placeholder="Confirmez votre mot de passe"
                labelPlacement="outside"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                endContent={
                  <PasswordToggle 
                    isVisible={confirmPasswordVisibility.isVisible} 
                    onToggle={confirmPasswordVisibility.toggleVisibility} 
                  />
                }
              />
            </div>

            {/* Bouton Sign Up */}
            <Button theme="default" type="submit" fullWidth disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center">
                  <Star2
                    weight="Linear"
                    size={24}
                    color="#0f4159"
                    className="animate-spin"
                  />
                </span>
              ) : (
                "Créer mon compte"
              )}
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