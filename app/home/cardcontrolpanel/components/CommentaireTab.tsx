import React from "react";
import { Input } from "@heroui/react";

export default function CommentaireTab() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow p-6">
        {/* Message principal */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
            A
          </div>
          <div>
            <span className="font-semibold">Admin Alice</span>
            <span className="ml-2 text-xs text-gray-400">2024-03-15</span>
          </div>
        </div>
        <div className="ml-12 mb-4 text-gray-800">
          Voici un commentaire important concernant les nouvelles
          fonctionnalités.
        </div>
        {/* Réponse */}
        <div className="flex items-start gap-3 ml-8 border-l-2 border-gray-100 pl-4">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
            U
          </div>
          <div>
            <div>
              <span className="font-semibold">User Bob</span>
              <span className="ml-2 text-xs text-gray-400">
                2024-03-16
              </span>
            </div>
            <div className="text-gray-700">
              Merci pour cette information. Pouvez-vous donner plus de
              détails&nbsp;?
            </div>
          </div>
        </div>
        {/* Champ de réponse */}
        <form className="mt-6 flex gap-2">
          <Input
            className="flex-1"
            placeholder="Écrire une réponse…"
            size="md"
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
          >
            Répondre
          </button>
        </form>
      </div>
    </div>
  );
}