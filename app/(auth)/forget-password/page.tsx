"use client";
import { Input, Button } from "@/components/ui";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { addToast, ToastProvider } from "@heroui/toast";

export default function ForgetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const router = useRouter();
  if (!token) {
    return (
      <div className="max-w-md mx-auto w-full p-4">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        <p className="mb-4 text-muted-foreground">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
        <form
          action={async (formdata) => {
            const email = formdata.get("email");
            await authClient.forgetPassword(
              {
                email: email as string,
                redirectTo: "/forget-password",
              },
              {
                onError: (error) => {
                  addToast({
                    title: "Erreur",
                    description:
                      typeof error === "string" ? error : JSON.stringify(error),
                    variant: "solid",
                  });
                },
                onSuccess: () => {
                  addToast({
                    title: "Succès",
                    description:
                      "Un lien de réinitialisation a été envoyé à votre adresse email.",
                    variant: "solid",
                  });
                },
              }
            );
            addToast({
              title: "Lien envoyé",
              description:
                "Un lien de réinitialisation a été envoyé à votre adresse email.",
              variant: "solid",
            });
          }}
          className="flex gap-2"
        >
          <Input
            theme="default"
            type="email"
            label="Email"
            placeholder="Entrez votre adresse email"
            labelPlacement="outside"
            name="email"
          />
          <Button type="submit">Send Reset Link</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <p className="mb-4 text-muted-foreground">
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </p>
      <form
        action={async (formData) => {
          const password = formData.get("password");
          await authClient.resetPassword(
            {
              newPassword: password as string,
              token: token as string,
            },
            {
              onError: (ctx) => {
                addToast({
                  title: "Erreur",
                  description: ctx.error.message,
                  variant: "solid",
                });
              },
              onSuccess: () => {
                addToast({
                  title: "Succès",
                  description: "Votre mot de passe a été réinitialisé.",
                  variant: "solid",
                });
                router.push("/login");
              },
            }
          );
        }}
        className="flex gap-2"
      >
        <Input
          theme="default"
          type="password"
          label="password"
          placeholder="Entrez votre password"
          labelPlacement="outside"
          name="password"
        />
        <Button type="submit">Réinitialiser le mot de passe</Button>
      </form>
    </div>
  );
}
