import { ToastProvider } from "@heroui/toast";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <ToastProvider />
      {children}
    </div>
  );
}