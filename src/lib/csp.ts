const CSP_BLOQUANTE = false;

export const ENTETE_CSP = CSP_BLOQUANTE
  ? "Content-Security-Policy"
  : "Content-Security-Policy-Report-Only";

export function genererNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString("base64");
}

export function construireCsp(options: {
  nonce: string;
  estDeveloppement: boolean;
  urlRapports?: string;
}): string {
  const { nonce, estDeveloppement } = options;
  const urlRapports = estDeveloppement ? undefined : options.urlRapports;

  const directives: [string, string[]][] = [
    ["default-src", ["'self'"]],
    [
      "script-src",
      [
        "'self'",
        `'nonce-${nonce}'`,
        "'strict-dynamic'",
        "'wasm-unsafe-eval'",
        ...(estDeveloppement ? ["'unsafe-eval'"] : []),
      ],
    ],
    ["style-src", ["'self'", "'unsafe-inline'"]],
    ["img-src", ["'self'", "blob:", "data:", "https:"]],
    ["font-src", ["'self'"]],
    [
      "connect-src",
      [
        "'self'",
        "blob:",
        ...(urlRapports ? [new URL(urlRapports).origin] : []),
      ],
    ],
    ["worker-src", ["'self'", "blob:"]],
    ["object-src", ["'none'"]],
    ["base-uri", ["'self'"]],
    ["form-action", ["'self'"]],
    ["frame-ancestors", ["'self'"]],
    ...(urlRapports
      ? ([["report-uri", [urlRapports]]] as [string, string[]][])
      : []),
  ];

  return directives
    .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
    .join("; ");
}
