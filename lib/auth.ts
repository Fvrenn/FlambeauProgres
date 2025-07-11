import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { resend } from './resend';
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        async sendResetPassword(data) {
            await resend.emails.send({
                from: "noreplay@nowts.app",
                to: data.user.email,
                subject: "Reset Password",
                text: `Reset Password : ${data.url}`
            });
        },
    },
    plugins: [nextCookies()],
});