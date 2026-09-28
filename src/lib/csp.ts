export const CSP_BLOQUANTE = false;

export const ENTETE_CSP = CSP_BLOQUANTE
  ? "Content-Security-Policy"
  : "Content-Security-Policy-Report-Only";

const URL_RAPPORTS_CSP =
  "https://glitchtip.logut.fr/api/2/security/?glitchtip_key=c934028aa3d54479ac024dc3312c2f92";

export function genererNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString("base64");
}

export function construireCsp(
  nonce: string,
  estDeveloppement: boolean,
): string {
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
    ["connect-src", ["'self'", "blob:", "https://glitchtip.logut.fr"]],
    ["worker-src", ["'self'", "blob:"]],
    ["object-src", ["'none'"]],
    ["base-uri", ["'self'"]],
    ["form-action", ["'self'"]],
    ["frame-ancestors", ["'self'"]],
    ...(estDeveloppement
      ? []
      : ([["report-uri", [URL_RAPPORTS_CSP]]] as [string, string[]][])),
  ];

  return directives
    .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
    .join("; ");
}
