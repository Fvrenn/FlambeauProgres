import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const ici = path.dirname(fileURLToPath(import.meta.url));
const racine = path.resolve(ici, "../..");
const sortie = path.join(racine, "public/chemise");
const chrome =
  process.env.CHROME_PATH ??
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const profil = fs.mkdtempSync(path.join(os.tmpdir(), "apercus-chemise-"));

const TYPES = {
  ".js": "text/javascript",
  ".html": "text/html",
  ".glb": "model/gltf-binary",
  ".wasm": "application/wasm",
};

let navigateur;

const terminer = (code) => {
  navigateur?.kill();
  setTimeout(() => {
    fs.rmSync(profil, { recursive: true, force: true });
    process.exit(code);
  }, 500);
};

const lireCorps = (req) =>
  new Promise((resolve) => {
    let corps = "";

    req.on("data", (morceau) => (corps += morceau));
    req.on("end", () => resolve(corps));
  });

const serveur = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (req.method === "POST") {
    const corps = await lireCorps(req);

    if (url.pathname === "/save") {
      const nom = path.basename(url.searchParams.get("nom"), ".png");

      await sharp(Buffer.from(corps.split(",")[1], "base64"))
        .webp({ quality: 80, alphaQuality: 90, effort: 6 })
        .toFile(path.join(sortie, `${nom}.webp`));
      console.log(`→ public/chemise/${nom}.webp`);
    }
    res.end();
    if (url.pathname === "/fin") terminer(0);

    return;
  }

  const fichier =
    url.pathname === "/"
      ? path.join(ici, "index.html")
      : url.pathname.startsWith("/three/")
        ? path.join(racine, "node_modules", url.pathname.slice(1))
        : url.pathname.startsWith("/public/")
          ? path.join(racine, url.pathname.slice(1))
          : null;

  if (!fichier || !fs.existsSync(fichier)) {
    res.statusCode = 404;
    res.end();

    return;
  }
  res.setHeader(
    "Content-Type",
    TYPES[path.extname(fichier)] ?? "application/octet-stream",
  );
  fs.createReadStream(fichier).pipe(res);
});

serveur.listen(0, "127.0.0.1", () => {
  navigateur = spawn(
    chrome,
    [
      "--headless=new",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
      "--no-first-run",
      "--disable-extensions",
      `--user-data-dir=${profil}`,
      "--window-size=800,800",
      `http://127.0.0.1:${serveur.address().port}/`,
    ],
    { stdio: "ignore" },
  );
  setTimeout(() => {
    console.error("Délai dépassé : aucun aperçu terminé en 3 minutes.");
    terminer(1);
  }, 180000);
});
