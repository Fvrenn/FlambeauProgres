import { getUser } from "@/src/lib/auth-session";
import { redirect } from "next/navigation";
import HomeClient from "@/app/home/homeclient/HomeClient";

export default async function Home() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return <HomeClient />;
}