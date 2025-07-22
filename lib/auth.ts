import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { resend } from "./resend";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CHEF",
        required: false,
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data) {
      await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: data.user.email,
        subject: "Reset your password",
        html: `Click the link to reset your password: ${data.url}`,
      });
    },
  },
  plugins: [
    nextCookies(),
    organization()
  ],
});