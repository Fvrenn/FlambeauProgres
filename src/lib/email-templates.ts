type EmailContent = {
  subject: string;
  html: string;
  text: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout(opts: {
  heading: string;
  bodyHtml: string;
  buttonUrl: string;
  buttonLabel: string;
}): string {
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#f5f5f4;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:24px 0;">
<tr><td align="center">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;border:1px solid #e7e5e4;">
<tr><td style="padding:24px 28px;">
<h1 style="margin:0 0 16px;font-size:18px;color:#111827;">${escapeHtml(opts.heading)}</h1>
${opts.bodyHtml}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 4px;">
<tr><td style="border-radius:8px;background:#c2410c;">
<a href="${opts.buttonUrl}" style="display:inline-block;padding:12px 22px;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;">${escapeHtml(opts.buttonLabel)}</a>
</td></tr>
</table>
</td></tr>
</table>
<p style="margin:16px 0 0;font-size:12px;color:#9ca3af;">Flambeau Progrès</p>
</td></tr>
</table>
</body></html>`;
}

export function newMessageEmail(opts: {
  authorName: string;
  objectifCode: string;
  messageText: string | null;
  replyUrl: string;
}): EmailContent {
  const preview = opts.messageText ?? "📎 Pièce jointe";

  const bodyHtml = `<p style="margin:0 0 12px;font-size:14px;">${escapeHtml(opts.authorName)} vous a écrit au sujet de « ${escapeHtml(opts.objectifCode)} » :</p>
<blockquote style="margin:0;padding:12px 16px;border-left:3px solid #c2410c;background:#fafaf9;font-size:14px;color:#374151;">${escapeHtml(preview)}</blockquote>`;

  return {
    subject: `Nouveau message — ${opts.objectifCode}`,
    html: layout({
      heading: "Nouveau message",
      bodyHtml,
      buttonUrl: opts.replyUrl,
      buttonLabel: "Répondre",
    }),
    text: `${opts.authorName} vous a écrit au sujet de « ${opts.objectifCode} » :\n\n${preview}\n\nRépondre : ${opts.replyUrl}`,
  };
}

export function newRealisationEmail(opts: {
  chefName: string;
  etapeName: string;
  reviewUrl: string;
}): EmailContent {
  const bodyHtml = `<p style="margin:0;font-size:14px;">${escapeHtml(opts.chefName)} a soumis une nouvelle réalisation à valider pour l'étape « ${escapeHtml(opts.etapeName)} ».</p>`;

  return {
    subject: `Nouvelle réalisation à valider — ${opts.etapeName}`,
    html: layout({
      heading: "Nouvelle réalisation à valider",
      bodyHtml,
      buttonUrl: opts.reviewUrl,
      buttonLabel: "Voir la réalisation",
    }),
    text: `${opts.chefName} a soumis une nouvelle réalisation à valider pour l'étape « ${opts.etapeName} ».\n\nVoir la réalisation : ${opts.reviewUrl}`,
  };
}

export function validationEmail(opts: {
  objectifCode: string;
  viewUrl: string;
}): EmailContent {
  const bodyHtml = `<p style="margin:0;font-size:14px;">Votre réalisation « ${escapeHtml(opts.objectifCode)} » a été validée par votre référent. Bravo !</p>`;

  return {
    subject: `Réalisation validée — ${opts.objectifCode}`,
    html: layout({
      heading: "Réalisation validée",
      bodyHtml,
      buttonUrl: opts.viewUrl,
      buttonLabel: "Voir la discussion",
    }),
    text: `Votre réalisation « ${opts.objectifCode} » a été validée par votre référent. Bravo !\n\nVoir : ${opts.viewUrl}`,
  };
}
