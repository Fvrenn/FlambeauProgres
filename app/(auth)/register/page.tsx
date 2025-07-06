"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Card, CardBody, CardHeader } from "@heroui/react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur quand l'utilisateur tape
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // TODO: Implémenter la logique d'inscription avec le backend
    console.log("Register attempt:", formData);
    
    // Simulation d'une requête
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center pb-6">
          <h1 className="text-2xl font-bold text-gray-800">Inscription</h1>
          <p className="text-gray-600 text-center">
            Créez votre compte Flambeau Progrès
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="text"
                label="Prénom"
                placeholder="Votre prénom"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                variant="bordered"
                isInvalid={!!errors.firstName}
                errorMessage={errors.firstName}
              />
              <Input
                type="text"
                label="Nom"
                placeholder="Votre nom"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                variant="bordered"
                isInvalid={!!errors.lastName}
                errorMessage={errors.lastName}
              />
            </div>
            <Input
              type="email"
              label="Email"
              placeholder="Entrez votre email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              variant="bordered"
              isInvalid={!!errors.email}
              errorMessage={errors.email}
            />
            <Input
              type="password"
              label="Mot de passe"
              placeholder="Créez un mot de passe"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              variant="bordered"
              isInvalid={!!errors.password}
              errorMessage={errors.password}
            />
            <Input
              type="password"
              label="Confirmer le mot de passe"
              placeholder="Confirmez votre mot de passe"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              variant="bordered"
              isInvalid={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword}
            />
            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={isLoading}
              disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword}
            >
              {isLoading ? "Création du compte..." : "Créer mon compte"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Vous avez déjà un compte ?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
