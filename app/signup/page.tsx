"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "CHEF", // Rôle par défaut
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/login?message=Compte créé avec succès");
      } else {
        setError(data.error || "Erreur lors de la création du compte");
      }
    } catch (error) {
      setError("Erreur lors de la création du compte");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#bbd0ff] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Panneau principal avec bordures arrondies */}
        <div className="bg-white rounded-[55px] p-8 shadow-lg relative">
          {/* Accent décoratif en haut */}
          <div className="absolute -top-4 left-12 w-20 h-8 bg-[#d9ed92] rounded-[30px]"></div>
          <div className="absolute -top-2 right-8 w-24 h-6 bg-[#feb38f] rounded-[20px]"></div>
          
          <div className="pt-6">
            <h1 className="text-4xl font-bold text-center text-[#171717] mb-2 font-LuckiestGuy">
              Inscription
            </h1>
            <p className="text-center text-gray-600 mb-8 font-DMSans">
              Rejoins la communauté des Flambeaux
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-[30px] text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 font-DMSans">
                  Nom complet
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-[30px] focus:outline-none focus:ring-2 focus:ring-[#b8c0ff] focus:border-transparent font-DMSans"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-DMSans">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-[30px] focus:outline-none focus:ring-2 focus:ring-[#b8c0ff] focus:border-transparent font-DMSans"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 font-DMSans">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-[30px] focus:outline-none focus:ring-2 focus:ring-[#b8c0ff] focus:border-transparent font-DMSans"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2 font-DMSans">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-[30px] focus:outline-none focus:ring-2 focus:ring-[#b8c0ff] focus:border-transparent font-DMSans"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#d9ed92] text-[#171717] py-3 px-4 rounded-[30px] font-medium hover:bg-[#c9dd82] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-DMSans"
              >
                {isLoading ? "Création..." : "Créer mon compte"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 font-DMSans">
                Déjà un compte ?{" "}
                <Link href="/login" className="text-[#b8c0ff] hover:underline font-medium">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>

          {/* Accent décoratif en bas */}
          <div className="absolute -bottom-3 left-6 w-18 h-6 bg-[#b8c0ff] rounded-[20px]"></div>
        </div>

        {/* Formes décoratives */}
        <div className="mt-8 flex justify-between items-center px-8">
          <div className="w-12 h-12 bg-[#feb38f] rounded-[20px] transform -rotate-12"></div>
          <div className="w-10 h-10 bg-[#d9ed92] rounded-[15px] transform rotate-12"></div>
        </div>
      </div>
    </div>
  );
}
