import path from "path";
import { writeFile, mkdir } from "fs/promises";

/**
 * Types MIME autorisés à l'upload. Volontairement restrictif :
 * PAS de SVG ni de HTML (vecteurs classiques de XSS stocké).
 */
const ALLOWED_MIME_TYPES = new Set<string>([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

/** Taille maximale d'un fichier (8 Mo). */
const MAX_FILE_SIZE = 8 * 1024 * 1024;

/**
 * Dossier de stockage PRIVÉ, hors de /public (donc NON servi publiquement).
 * Configurable via la variable d'environnement UPLOAD_DIR
 * (ex. sur un VPS : /var/data/flambeau/uploads).
 * Par défaut : <racine du projet>/uploads
 */
const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

export interface StoredFile {
  /** Chemin relatif "dossier/nom-de-fichier" — à stocker en base. */
  storedPath: string;
  /** Nom de fichier unique généré sur le disque. */
  fileName: string;
}

export class StorageService {
  /**
   * Valide le type MIME et la taille AVANT toute écriture.
   * Lève une Error explicite (remontée à l'utilisateur par l'action).
   */
  static validate(file: File): void {
    if (!file) {
      throw new Error("Aucun fichier fourni");
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      throw new Error(
        "Type de fichier non autorisé (images, PDF ou Word uniquement)",
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("Fichier trop volumineux (8 Mo maximum)");
    }
  }

  /**
   * Écrit le fichier dans UPLOAD_DIR/<folder> et renvoie son chemin relatif
   * (à stocker en base). Le fichier n'est PAS accessible publiquement : il se
   * sert via la route authentifiée /api/files/[id].
   */
  static async uploadFile(file: File, folder = "uploads"): Promise<StoredFile> {
    this.validate(file);

    const buffer = Buffer.from(await file.arrayBuffer());

    const safeFolder =
      folder.replace(/[^a-z0-9_-]/gi, "").toLowerCase() || "uploads";
    const targetDir = path.join(UPLOAD_DIR, safeFolder);

    await mkdir(targetDir, { recursive: true });

    const extension = path
      .extname(file.name)
      .replace(/[^a-z0-9.]/gi, "")
      .toLowerCase();
    const basename = path
      .basename(file.name, path.extname(file.name))
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileName = `${basename || "fichier"}-${uniqueSuffix}${extension}`;

    await writeFile(path.join(targetDir, fileName), buffer);

    return {
      storedPath: `${safeFolder}/${fileName}`,
      fileName,
    };
  }

  /**
   * Résout un chemin relatif stocké en base vers un chemin absolu sur disque,
   * en garantissant qu'il reste DANS UPLOAD_DIR (protection path traversal).
   */
  static resolvePath(storedPath: string): string {
    const baseDir = path.resolve(UPLOAD_DIR);
    const relative = storedPath.replace(/^[/\\]+/, "");
    const resolved = path.resolve(baseDir, relative);

    if (resolved !== baseDir && !resolved.startsWith(baseDir + path.sep)) {
      throw new Error("Chemin de fichier invalide");
    }

    return resolved;
  }
}
