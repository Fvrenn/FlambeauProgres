import { put } from "@vercel/blob";
import path from "path";

export interface IStorageService {
  uploadFile(file: File, folder: string): Promise<{ url: string; pathname: string }>;
  // deleteFile(url: string): Promise<void>; // À implémenter si besoin
}

export class StorageService {
  /**
   * Upload un fichier vers le stockage distant (Vercel Blob).
   * @param file Le fichier à uploader
   * @param folder Le dossier de destination (ex: "justifications")
   */
  static async uploadFile(file: File, folder: string = "uploads"): Promise<{ url: string; pathname: string }> {
    // 1. Validation basique
    if (!file) {
      throw new Error("Aucun fichier fourni");
    }

    // 2. Génération du chemin
    // Vercel Blob gère automatiquement l'unicité des noms si on le souhaite, 
    // mais pour garder une structure propre, on peut préfixer.
    const filename = file.name; 
    const contentType = file.type || "application/octet-stream";
    
    // Le 'pathname' dans put() est le chemin complet souhaité.
    // Ex: justifications/mon-image.jpg
    const destinationPath = `${folder}/${filename}`;

    try {
      // 3. Upload vers Vercel Blob
      // 'access: public' est requis pour que les images soient accessibles par les utilisateurs.
      const blob = await put(destinationPath, file, {
        access: "public",
        contentType: contentType,
        // On peut ajouter addRandomSuffix: true par défaut, mais false permet d'écraser si voulu.
        // Ici on laisse true (défaut) ou on le met explicitement pour éviter les collisions.
        addRandomSuffix: true, 
      });

      return {
        url: blob.url,
        pathname: blob.pathname
      };

    } catch (error) {
      console.error("[StorageService] Erreur d'upload:", error);
      throw new Error("Échec de l'upload du fichier");
    }
  }
}
