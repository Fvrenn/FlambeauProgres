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
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // 3. Configuration des chemins
      
      const uploadDir = path.join(process.cwd(), "public", folder);
      
      // S'assurer que le dossier existe
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (error: any) {
        if (error.code !== 'EEXIST') throw error;
      }

      
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const extension = path.extname(file.name);
      const basename = path.basename(file.name, extension);
      
      const safeBasename = basename.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      const uniqueFilename = `${safeBasename}-${uniqueSuffix}${extension}`;
      
      const finalPath = path.join(uploadDir, uniqueFilename);

      
      await writeFile(finalPath, buffer);


      // 6. Retourner l'URL publique
      
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
