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

import { signUp } from "@/lib/auth-client";
import FlambeauProgres from "@/public/logo/logo-flambeau-progres.svg";
const SignupFormSchema = z
  .object({
    prenom: z.string().min(1, "Le prénom est requis."),
    nom: z.string().min(1, "Le nom est requis."),
    email: z
      .email("Adresse e-mail invalide.")
      .min(1, "L'adresse e-mail est requise."),
    motDePasse: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    confirmerMotDePasse: z
      .string()
      .min(1, "La confirmation du mot de passe est requise."),
  })
  .refine((data) => data.motDePasse === data.confirmerMotDePasse, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmerMotDePasse"],
  });

export default function SignupForm() {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const router = useRouter();

  const form = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    mode: "onBlur",
    defaultValues: {
      prenom: "",
      nom: "",
      email: "",
      motDePasse: "",
      confirmerMotDePasse: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignupFormSchema>) {
    await signUp.email(
      {
        email: values.email,
        name: `${values.prenom} ${values.nom}`,
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
    <div className="rounded-large bg-dashboard-panel border border-dashboard-border shadow-none flex w-full max-w-sm flex-col gap-4 px-8 pt-6 pb-10">
      <div className="flex flex-col items-center pb-6">
        <Image
          alt="Logo Flambeau Progrès"
          className="h-auto w-[60px]"
          height={68}
          src={FlambeauProgres}
          width={50}
        />
        <p className="text-xl font-medium">Créer un compte</p>
        <p className="text-small text-default-500">
          Inscrivez-vous pour accéder à la plateforme
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
            label="Prénom"
            placeholder="Entrez votre prénom"
            type="text"
            variant="faded"
            {...form.register("prenom")}
            errorMessage={form.formState.errors.prenom?.message}
            isInvalid={!!form.formState.errors.prenom}
          />
          <Input
            isRequired
            label="Nom"
            placeholder="Entrez votre nom"
            type="text"
            variant="faded"
            {...form.register("nom")}
            errorMessage={form.formState.errors.nom?.message}
            isInvalid={!!form.formState.errors.nom}
          />
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
          <Input
            isRequired
            label="Confirmer le mot de passe"
            placeholder="Confirmez votre mot de passe"
            type={isVisible ? "text" : "password"}
            variant="faded"
            {...form.register("confirmerMotDePasse")}
            errorMessage={form.formState.errors.confirmerMotDePasse?.message}
            isInvalid={!!form.formState.errors.confirmerMotDePasse}
          />
          <Button className="w-full" color="primary" type="submit">
            S'inscrire
          </Button>
        </Form>
      </FormProvider>
      <p className="text-small text-center">
        Vous avez déjà un compte ?&nbsp;
        <Link href="/login" size="sm">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
