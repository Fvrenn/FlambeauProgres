"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Card, CardBody, CardHeader } from "@heroui/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implémenter la logique de connexion avec le backend
    console.log("Login attempt:", { email, password });
    
    // Simulation d'une requête
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center pb-6">
          <h1 className="text-2xl font-bold text-gray-800">Connexion</h1>
          <p className="text-gray-600 text-center">
            Connectez-vous à votre compte Flambeau Progrès
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="bordered"
            />
            <Input
              type="password"
              label="Mot de passe"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="bordered"
            />
            <div className="flex items-center justify-between text-sm">
              <Link href="#" className="text-blue-600 hover:text-blue-800">
                Mot de passe oublié ?
              </Link>
            </div>
            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={isLoading}
              disabled={!email || !password}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Vous n'avez pas de compte ?{" "}
              <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Créer un compte
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
