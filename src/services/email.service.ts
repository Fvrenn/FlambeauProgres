import nodemailer, { type Transporter } from "nodemailer";

import {
  newMessageEmail,
  newRealisationEmail,
  validationEmail,
} from "@/lib/email-templates";

type EmailContent = {
  subject: string;
  html: string;
  text: string;
};

type SendOptions = {
  messageId?: string;
  headers?: Record<string, string>;
};

const MISSING_CONFIG_MESSAGE =
  "Configuration SMTP incomplète (SMTP_HOST et EMAIL_FROM requis) : les emails ne seront pas envoyés.";

function missingConfig(): string[] {
  const missing: string[] = [];

  if (!process.env.SMTP_HOST) {
    missing.push("SMTP_HOST");
  }

  if (!process.env.EMAIL_FROM) {
    missing.push("EMAIL_FROM");
  }

  return missing;
}

if (missingConfig().length > 0) {
  console.warn(MISSING_CONFIG_MESSAGE);
}

let warnedOnSend = false;
let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 25),
      secure: false,
      tls: { rejectUnauthorized: false },
    });
  }

  return transporter;
}

function threadMessageId(justificationId: string): string {
  return `<justification-${justificationId}@flambeau-progres.app>`;
}

export class EmailService {
  private static async send(
    to: string,
    content: EmailContent,
    options?: SendOptions,
  ): Promise<void> {
    const missing = missingConfig();

    if (missing.length > 0) {
      if (!warnedOnSend) {
        warnedOnSend = true;
        console.warn(
          `${MISSING_CONFIG_MESSAGE} Variable(s) manquante(s) : ${missing.join(", ")}.`,
        );
      }

      return;
    }

    if (!to) {
      return;
    }

    try {
      await getTransporter().sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject: content.subject,
        html: content.html,
        text: content.text,
        replyTo: process.env.EMAIL_REPLY_TO || undefined,
        messageId: options?.messageId,
        headers: options?.headers,
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email à", to, ":", error);
    }
  }

  static sendNewMessage(opts: {
    to: string;
    authorName: string;
    etapeName: string;
    objectifCode: string;
    messageText: string | null;
    replyUrl: string;
    justificationId: string;
  }): Promise<void> {
    const threadId = threadMessageId(opts.justificationId);

    return this.send(opts.to, newMessageEmail(opts), {
      headers: {
        "In-Reply-To": threadId,
        References: threadId,
      },
    });
  }

  static sendNewRealisation(opts: {
    to: string;
    chefName: string;
    etapeName: string;
    objectifCode: string;
    objectifDescription: string;
    reviewUrl: string;
    justificationId: string;
  }): Promise<void> {
    return this.send(opts.to, newRealisationEmail(opts), {
      messageId: threadMessageId(opts.justificationId),
    });
  }

  static sendValidation(opts: {
    to: string;
    chefName: string;
    referentName: string;
    etapeName: string;
    objectifCode: string;
    objectifDescription: string;
    viewUrl: string;
    justificationId: string;
  }): Promise<void> {
    const threadId = threadMessageId(opts.justificationId);

    return this.send(opts.to, validationEmail(opts), {
      headers: {
        "In-Reply-To": threadId,
        References: threadId,
      },
    });
  }
}
