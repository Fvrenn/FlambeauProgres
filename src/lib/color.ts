export const DEFAULT_ETAPE_COLOR = "#FCC226";

function normalizeHex(color: string): string | null {
  const c = color.replace("#", "").trim();

  if (/^[0-9a-fA-F]{3}$/.test(c)) {
    return c
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }

  if (/^[0-9a-fA-F]{6}$/.test(c)) {
    return c;
  }

  return null;
}

const FALLBACK_HEX = normalizeHex(DEFAULT_ETAPE_COLOR) as string;

export function getReadableTextColor(hex: string): string {
  const c = normalizeHex(hex);

  if (!c) return "#000000";

  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.55 ? "#000000" : "#FFFFFF";
}

export function withAlpha(color: string, alpha: number): string {
  const c = normalizeHex(color) ?? FALLBACK_HEX;
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${c}${a}`;
}
