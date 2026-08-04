import { buildMetadata } from "@/lib/seo";

// Transaccional: útil para el usuario, ruido para el índice.
export const metadata = buildMetadata({
  title: "Ingresar",
  description: "Accede a tu cuenta para dar seguimiento a tu compra o cita.",
  path: "/login",
  noindex: true,
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
