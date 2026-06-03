"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@heroui/link";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";

import { signIn } from "@/lib/auth-client";
import FlambeauProgres from "@/public/logo/logo-flambeau-progres.svg";

const LoginFormSchema = z.object({
  email: z
    .string()
    .email("Adresse e-mail invalide.")
    .min(1, "L'adresse e-mail est requise."),
  motDePasse: z.string().min(1, "Le mot de passe est requis."),
});

export default function LoginForm() {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      motDePasse: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    await signIn.email(
      {
        email: values.email,
        password: values.motDePasse,
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (error) => {
          addToast({
            title: "Erreur",
            description: error.error.message,
            color: "danger",
          });
        },
      },
    );
  }

  return (
    <div className="rounded-large bg-content1 shadow-small flex w-full max-w-sm flex-col gap-4 px-8 pt-6 pb-10">
      <div className="flex flex-col items-center pb-6">
        <Image
          alt="Logo Flambeau Progrès"
          height={60}
          src={FlambeauProgres}
          width={60}
        />
        <p className="text-xl font-medium">Se connecter</p>
        <p className="text-small text-default-500">
          Connectez-vous pour accéder à la plateforme
        </p>
      </div>
      <FormProvider {...form}>
        <Form
          className="flex flex-col gap-3"
          validationBehavior="native"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Input
            isRequired
            label="Adresse e-mail"
            placeholder="Entrez votre e-mail"
            type="email"
            variant="faded"
            {...form.register("email")}
            errorMessage={form.formState.errors.email?.message}
            isInvalid={!!form.formState.errors.email}
          />
          <Input
            isRequired
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="text-default-400 pointer-events-none text-2xl"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="text-default-400 pointer-events-none text-2xl"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="Mot de passe"
            placeholder="Entrez votre mot de passe"
            type={isVisible ? "text" : "password"}
            variant="faded"
            {...form.register("motDePasse")}
            errorMessage={form.formState.errors.motDePasse?.message}
            isInvalid={!!form.formState.errors.motDePasse}
          />
          <Button className="w-full" color="primary" type="submit">
            Se connecter
          </Button>
        </Form>
      </FormProvider>
      <p className="text-small text-center">
        Vous n'avez pas de compte ?&nbsp;
        <Link href="/signup" size="sm">
          S'inscrire
        </Link>
      </p>
    </div>
  );
}
