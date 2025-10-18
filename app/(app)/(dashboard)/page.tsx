import { title, subtitle } from "@/components/primitives";
import { getUser } from "@/src/lib/auth-server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/src//lib/auth";

export default async function Home() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span>{user.name}</span>

        <form>
          <button
            formAction={async () => {
              "use server";
              await auth.api.signOut({
                headers: await headers(),
              });
              redirect("/login");
            }}
          >
            se deconecter
          </button>
        </form>
      </div>
    </section>
  );
}
