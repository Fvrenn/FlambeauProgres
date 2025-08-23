import { getUser } from "@/src/lib/auth-session";
import { Navbar } from "@/src/components/navbar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const isAdmin = user?.role === "ADMIN";
  const isReferent = user?.role === "REFERENT";

  return (
    <div className="relative flex flex-col h-screen">
      <Navbar isAdmin={isAdmin} isReferent={isReferent} />
      <main className="ml-72 container mx-auto pt-6 px-6 flex-grow">
        {children}
      </main>
    </div>
  );
}