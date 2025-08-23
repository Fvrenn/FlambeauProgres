import { getUser } from "@/src/lib/auth-session";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  redirect("/dashboard");
  
  return null;
}