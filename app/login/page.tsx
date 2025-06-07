"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
      } else {
        setError(data.error || "Erreur de connexion");
      }
    } catch (error) {
      setError("Erreur de connexion");
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
          <div className="absolute -top-4 left-8 w-24 h-8 bg-[#b8c0ff] rounded-[30px]"></div>
          <div className="absolute -top-2 right-12 w-16 h-6 bg-[#d9ed92] rounded-[20px]"></div>
          
          <div className="pt-6">
            <h1 className="text-4xl font-bold text-center text-[#171717] mb-2 font-LuckiestGuy">
              Connexion
            </h1>
            <p className="text-center text-gray-600 mb-8 font-DMSans">
              Connecte-toi à ton compte Flambeau
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-[30px] text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-DMSans">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-[30px] focus:outline-none focus:ring-2 focus:ring-[#b8c0ff] focus:border-transparent font-DMSans"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#b8c0ff] text-white py-3 px-4 rounded-[30px] font-medium hover:bg-[#a8b0ef] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-DMSans"
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 font-DMSans">
                Pas encore de compte ?{" "}
                <Link href="/signup" className="text-[#b8c0ff] hover:underline font-medium">
                  S'inscrire
                </Link>
              </p>
            </div>
          </div>

          {/* Accent décoratif en bas */}
          <div className="absolute -bottom-3 right-6 w-20 h-6 bg-[#feb38f] rounded-[20px]"></div>
        </div>

        {/* Forme décorative */}
        <div className="mt-8 flex justify-center">
          <div className="w-16 h-16 bg-[#d9ed92] rounded-[25px] transform rotate-45"></div>
        </div>
      </div>
    </div>
  );
}
