import { Resend } from "resend";

import {
  newMessageEmail,
  newRealisationEmail,
  validationEmail,
} from "@/lib/email-templates";

const apiKey = process.env.RESEND_API_KEY;
const from =
  process.env.EMAIL_FROM || "Flambeau Progrès <onboarding@resend.dev>";
const resend = apiKey ? new Resend(apiKey) : null;

type EmailContent = {
  subject: string;
  html: string;
  text: string;
};

function threadMessageId(justificationId: string): string {
  return `<justification-${justificationId}@flambeau-progres.app>`;
}

export class EmailService {
  private static async send(
    to: string,
    content: EmailContent,
    headers?: Record<string, string>,
  ): Promise<void> {
    if (!resend || !to) {
      return;
    }

    try {
      const { error } = await resend.emails.send({
        from,
        to,
        subject: content.subject,
        html: content.html,
        text: content.text,
        headers,
      });

      if (error) {
        console.error("Resend a refusé l'email à", to, ":", error);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
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
      "In-Reply-To": threadId,
      References: threadId,
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
      "Message-ID": threadMessageId(opts.justificationId),
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
      "In-Reply-To": threadId,
      References: threadId,
    });
  }
}
