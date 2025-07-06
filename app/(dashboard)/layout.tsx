import { Navbar } from "@/components/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="ml-64 container mx-auto pt-6 px-6 flex-grow">
        {children}
      </main>
    </div>
  );
}
