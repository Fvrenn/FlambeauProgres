type EmailContent = {
  subject: string;
  html: string;
  text: string;
};

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
<td style="padding-right:9px;"><img alt="Flambeau Progrès" height="24" src="https://flambeau-progres.timothehege.fr/logo/logo-flambeau-progres.svg" style="display:block;border:0;" width="18" /></td>
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
${opts.footNote
      ? `<p style="margin:14px 0 0;font-size:13px;text-align:center;color:${COLORS.muted};font-family:Arial,Helvetica,sans-serif;">${escapeHtml(opts.footNote)}</p>`
      : ""
    }
</td></tr>

<tr><td style="background:${COLORS.cardBg};padding:16px 28px;border-radius:0 0 16px 16px;text-align:center;">
<p style="margin:0;font-size:12px;color:${COLORS.muted};font-family:Arial,Helvetica,sans-serif;">Flambeau Progrès </p>
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
