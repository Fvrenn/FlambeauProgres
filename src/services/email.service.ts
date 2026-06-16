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

export class EmailService {
  private static async send(to: string, content: EmailContent): Promise<void> {
    if (!resend || !to) {
      return;
    }

    try {
      await resend.emails.send({
        from,
        to,
        subject: content.subject,
        html: content.html,
        text: content.text,
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
    }
  }

  static sendNewMessage(opts: {
    to: string;
    authorName: string;
    objectifCode: string;
    messageText: string | null;
    replyUrl: string;
  }): Promise<void> {
    return this.send(opts.to, newMessageEmail(opts));
  }

  static sendNewRealisation(opts: {
    to: string;
    chefName: string;
    etapeName: string;
    reviewUrl: string;
  }): Promise<void> {
    return this.send(opts.to, newRealisationEmail(opts));
  }

  static sendValidation(opts: {
    to: string;
    objectifCode: string;
    viewUrl: string;
  }): Promise<void> {
    return this.send(opts.to, validationEmail(opts));
  }
}
