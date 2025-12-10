import path from "path";
import { writeFile, mkdir } from "fs/promises";

export interface IStorageService {
  uploadFile(file: File, folder: string): Promise<{ url: string; pathname: string }>;
}

export class StorageService {
  /**
   * Upload un fichier localement dans le dossier public.
   * Cette méthode est adaptée pour un hébergement sur un serveur standard (VPS, dédié).
   * @param file Le fichier à uploader
   * @param folder Le dossier de destination (ex: "justifications")
   */
  static async uploadFile(file: File, folder: string = "uploads"): Promise<{ url: string; pathname: string }> {
    // 1. Validation basique
    if (!file) {
      throw new Error("Aucun fichier fourni");
    }

    try {
      // 2. Préparation du buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // 3. Configuration des chemins
      // Le fichier sera stocké dans ./public/{folder} pour être accessible via HTTP
      const uploadDir = path.join(process.cwd(), "public", folder);
      
      // S'assurer que le dossier existe
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (error: any) {
        if (error.code !== 'EEXIST') throw error;
      }

      // 4. Génération d'un nom unique pour éviter les collisions
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const extension = path.extname(file.name);
      const basename = path.basename(file.name, extension);
      // Nettoyage du nom de fichier (enlève les espaces et caractères spéciaux simples)
      const safeBasename = basename.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      const uniqueFilename = `${safeBasename}-${uniqueSuffix}${extension}`;
      
      const finalPath = path.join(uploadDir, uniqueFilename);

      // 5. Écriture du fichier sur le disque
      await writeFile(finalPath, buffer);

      console.log(`[StorageService] Fichier uploadé avec succès: ${finalPath}`);

      // 6. Retourner l'URL publique
      // Next.js sert les fichiers du dossier 'public' à la racine
      return {
        url: `/${folder}/${uniqueFilename}`,
        pathname: finalPath
      };

    } catch (error) {
      console.error("[StorageService] Erreur d'upload:", error);
      throw new Error("Échec de l'upload du fichier vers le stockage local");
    }
  }
}
