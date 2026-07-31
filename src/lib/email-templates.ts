type EmailContent = {
  subject: string;
  html: string;
  text: string;
};

const LOGO_BASE64 =
  "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";

const COLORS = {
  headerBg: "#2f4a35",
  pageBg: "#F3F2E9",
  cardBg: "#eee7d3",
  tagBg: "#FAF6EB",
  tagText: "#c49a0e",
  foreground: "#0f1511",
  bodyText: "#3d3b34",
  muted: "#8b8a81",
  quoteBg: "#FAF6EB",
  buttonBg: "#2f4a35",
  buttonText: "#FFFFFF",
  iconGoldBg: "#f2ecd9",
  iconGoldText: "#c49a0e",
  iconSuccessBg: "#e3f8ef",
  iconSuccessText: "#127f51",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function icon(glyph: string, tone: "gold" | "success"): string {
  const bg = tone === "success" ? COLORS.iconSuccessBg : COLORS.iconGoldBg;
  const color =
    tone === "success" ? COLORS.iconSuccessText : COLORS.iconGoldText;

  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>
<td width="56" height="56" align="center" valign="middle" style="width:56px;height:56px;border-radius:50%;background:${bg};font-size:24px;line-height:56px;color:${color};font-family:Arial,Helvetica,sans-serif;">${glyph}</td>
</tr></table>`;
}

function contextCard(etapeName: string, objectifDescription: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.cardBg};border-radius:14px;margin:0 0 8px;"><tr><td style="padding:16px 18px;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:${COLORS.tagBg};border-radius:999px;padding:4px 10px;">
<span style="font-size:10px;font-weight:bold;letter-spacing:0.05em;text-transform:uppercase;color:${COLORS.tagText};font-family:Arial,Helvetica,sans-serif;">${escapeHtml(etapeName)}</span>
</td></tr></table>
<p style="margin:10px 0 0;font-size:14px;font-weight:bold;line-height:1.4;color:${COLORS.foreground};font-family:Arial,Helvetica,sans-serif;">${escapeHtml(objectifDescription)}</p>
</td></tr></table>`;
}

function layout(opts: {
  iconGlyph: string;
  iconTone: "gold" | "success";
  heading: string;
  bodyHtml: string;
  extraHtml?: string;
  buttonUrl: string;
  buttonLabel: string;
  footNote?: string;
}): string {
  return `<!doctype html><html lang="fr"><body style="margin:0;padding:0;background:${COLORS.pageBg};font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.pageBg};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">

<tr><td style="background:${COLORS.headerBg};padding:16px 28px;border-radius:16px 16px 0 0;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="padding-right:9px;"><img alt="" height="24" src="data:image/png;base64,${LOGO_BASE64}" style="display:block;border:0;" width="18" /></td>
<td style="font-size:16px;font-weight:bold;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">Flambeau Progrès</td>
</tr></table>
</td></tr>

<tr><td style="background:${COLORS.pageBg};padding:36px 32px 8px;">
${icon(opts.iconGlyph, opts.iconTone)}
<h1 style="margin:20px 0 8px;font-size:21px;text-align:center;color:${COLORS.foreground};font-family:Arial,Helvetica,sans-serif;">${escapeHtml(opts.heading)}</h1>
<p style="margin:0 0 24px;font-size:14px;line-height:1.6;text-align:center;color:${COLORS.bodyText};font-family:Arial,Helvetica,sans-serif;">${opts.bodyHtml}</p>
${opts.extraHtml ?? ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 4px;"><tr><td align="center">
<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:999px;background:${COLORS.buttonBg};">
<a href="${opts.buttonUrl}" style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:bold;color:${COLORS.buttonText};text-decoration:none;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(opts.buttonLabel)}</a>
</td></tr></table>
</td></tr></table>
${
  opts.footNote
    ? `<p style="margin:14px 0 0;font-size:13px;text-align:center;color:${COLORS.muted};font-family:Arial,Helvetica,sans-serif;">${escapeHtml(opts.footNote)}</p>`
    : ""
}
</td></tr>

<tr><td style="background:${COLORS.cardBg};padding:16px 28px;border-radius:0 0 16px 16px;text-align:center;">
<p style="margin:0;font-size:12px;color:${COLORS.muted};font-family:Arial,Helvetica,sans-serif;">Flambeau Progrès — application de suivi de progression scoute</p>
</td></tr>

</table>
</td></tr>
</table>
</body></html>`;
}

export function newMessageEmail(opts: {
  authorName: string;
  etapeName: string;
  objectifCode: string;
  messageText: string | null;
  replyUrl: string;
}): EmailContent {
  const preview = opts.messageText ?? "📎 Pièce jointe";

  const quoteHtml = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;"><tr><td style="background:${COLORS.quoteBg};border-radius:10px;padding:14px 16px;">
<p style="margin:0 0 4px;font-size:10px;font-weight:bold;letter-spacing:0.05em;text-transform:uppercase;color:${COLORS.muted};font-family:Arial,Helvetica,sans-serif;">${escapeHtml(opts.etapeName)} · ${escapeHtml(opts.objectifCode)}</p>
<p style="margin:0;font-size:14px;line-height:1.5;color:${COLORS.foreground};font-family:Arial,Helvetica,sans-serif;">${escapeHtml(preview)}</p>
</td></tr></table>`;

  return {
    subject: `[${opts.objectifCode}] Nouveau message`,
    html: layout({
      iconGlyph: "✉",
      iconTone: "gold",
      heading: "Nouveau message",
      bodyHtml: `${escapeHtml(opts.authorName)} vous a écrit :`,
      extraHtml: quoteHtml,
      buttonUrl: opts.replyUrl,
      buttonLabel: "Répondre",
    }),
    text: `${opts.authorName} vous a écrit au sujet de « ${opts.objectifCode} » :\n\n${preview}\n\nRépondre : ${opts.replyUrl}`,
  };
}

export function newRealisationEmail(opts: {
  chefName: string;
  etapeName: string;
  objectifCode: string;
  objectifDescription: string;
  reviewUrl: string;
}): EmailContent {
  return {
    subject: `[${opts.objectifCode}] Nouvelle réalisation à valider`,
    html: layout({
      iconGlyph: "→",
      iconTone: "gold",
      heading: "Nouvelle réalisation à valider",
      bodyHtml: `${escapeHtml(opts.chefName)} a soumis une nouvelle réalisation.`,
      extraHtml: contextCard(opts.etapeName, opts.objectifDescription),
      buttonUrl: opts.reviewUrl,
      buttonLabel: "Voir la réalisation",
    }),
    text: `${opts.chefName} a soumis une nouvelle réalisation pour l'étape « ${opts.etapeName} » (${opts.objectifDescription}).\n\nVoir la réalisation : ${opts.reviewUrl}`,
  };
}

export function validationEmail(opts: {
  chefName: string;
  referentName: string;
  etapeName: string;
  objectifCode: string;
  objectifDescription: string;
  viewUrl: string;
}): EmailContent {
  return {
    subject: `[${opts.objectifCode}] Réalisation validée`,
    html: layout({
      iconGlyph: "✓",
      iconTone: "success",
      heading: "Réalisation validée !",
      bodyHtml: `Bravo ${escapeHtml(opts.chefName)}, ton référent ${escapeHtml(opts.referentName)} vient de valider ta réalisation.`,
      extraHtml: contextCard(opts.etapeName, opts.objectifDescription),
      buttonUrl: opts.viewUrl,
      buttonLabel: "Voir la conversation",
      footNote: `Continue comme ça, ${opts.chefName} !`,
    }),
    text: `Bravo ${opts.chefName}, ton référent ${opts.referentName} vient de valider ta réalisation « ${opts.objectifDescription} » (étape ${opts.etapeName}).\n\nVoir : ${opts.viewUrl}`,
  };
}
