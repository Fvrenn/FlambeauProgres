import path from "path";
import { writeFile, mkdir, readFile, unlink } from "fs/promises";
import { mkdirSync } from "fs";

import { type ReglesFichier, validerFichier } from "@/lib/fichiers";

const UPLOAD_DIR =
  process.env.UPLOAD_DIR ||
  path.join(/*turbopackIgnore: true*/ process.cwd(), "uploads");

mkdirSync(UPLOAD_DIR, { recursive: true });

export interface StoredFile {
  storedPath: string;
  fileName: string;
}

export class StorageService {
  static validate(file: File, regles: ReglesFichier): void {
    if (!file) {
      throw new Error("Aucun fichier fourni");
    }

    const erreur = validerFichier(file, regles);

    if (erreur) {
      throw new Error(erreur);
    }
  }

  static async uploadFile(
    file: File,
    folder: string,
    regles: ReglesFichier,
  ): Promise<StoredFile> {
    this.validate(file, regles);

    const buffer = Buffer.from(await file.arrayBuffer());

    const safeFolder =
      folder.replace(/[^a-z0-9_-]/gi, "").toLowerCase() || "uploads";
    const targetDir = path.join(
      /*turbopackIgnore: true*/ UPLOAD_DIR,
      safeFolder,
    );

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

    await writeFile(
      path.join(/*turbopackIgnore: true*/ targetDir, fileName),
      buffer,
    );

    return {
      storedPath: `${safeFolder}/${fileName}`,
      fileName,
    };
  }

  static async read(storedPath: string): Promise<Buffer> {
    return readFile(this.resolvePath(storedPath));
  }

  static async deleteFile(storedPath: string): Promise<void> {
    try {
      await unlink(this.resolvePath(storedPath));
    } catch {
      return;
    }
  }

  static resolvePath(storedPath: string): string {
    const baseDir = path.resolve(/*turbopackIgnore: true*/ UPLOAD_DIR);
    const relative = storedPath.replace(/^[/\\]+/, "");
    const resolved = path.resolve(/*turbopackIgnore: true*/ baseDir, relative);

    if (resolved !== baseDir && !resolved.startsWith(baseDir + path.sep)) {
      throw new Error("Chemin de fichier invalide");
    }

    return resolved;
  }
}
