"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signin } from "../services/auth.service";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signin(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="panel--primary__content max-w-md w-full p-8 rounded-lg shadow-lg relative">
        <h2 className="font-LondrinaSolid text-4xl text-white font-bold mb-6 text-center">Connexion</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            className="w-full px-4 py-2 rounded bg-white text-dark font-DMSans"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full px-4 py-2 rounded bg-white text-dark font-DMSans"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 rounded bg-accent text-white font-bold font-LuckiestGuy text-lg hover:bg-orange-400 transition"
          >
            Se connecter
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-white">Pas de compte ?</span>{" "}
          <a href="/signup" className="text-accent underline">Créer un compte</a>
        </div>
      </div>
    </div>
  );
}
