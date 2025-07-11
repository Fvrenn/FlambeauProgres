"use client";

import { Input, Button, Link, Card, CardBody } from "@/components/ui";
import { useState } from "react";
import { ArrowUp } from "@solar-icons/react";
import { signIn } from "@/lib/auth-client";
import { addToast, ToastProvider } from "@heroui/toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
          <div className="space-y-6">
            {/* Input Email */}
            <div className="flex flex-col gap-5">
              <Input
                theme="default"
                type="email"
                label="Email"
                placeholder="Entrez votre adresse email"
                labelPlacement="outside"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                theme="default"
                type="password"
                label="Mot de passe"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Bouton mot de passe oublié */}
            <div className="flex justify-end">
              <Link theme="auth" href="#" size="sm" className="text-sm">
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton Sign In */}
            <Button
              theme="default"
              type="button"
              fullWidth
              disabled={loading}
              onClick={async () => {
                const { data, error } = await signIn.email(
                  {
                    email,
                    password,
                  },
                  {
                    onRequest: (ctx) => {
                      setLoading(true);
                    },
                    onResponse: (ctx) => {
                      setLoading(false);
                    },
                  }
                );
                if (error) {
                  addToast({
                    title: "Erreur",
                    description: error.message,
                    variant: "solid",
                  });
                }
              }}
            >
              {loading ? (
                <ArrowUp size={16} className="animate-spin" />
              ) : (
                "Se connecter"
              )}
            </Button>
          </div>

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
