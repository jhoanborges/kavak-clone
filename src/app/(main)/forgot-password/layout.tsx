import { buildMetadata } from "@/lib/seo";

// Transaccional: útil para el usuario, ruido para el índice.
export const metadata = buildMetadata({
  title: "Recuperar contraseña",
  description: "Te enviamos un enlace para restablecer tu contraseña.",
  path: "/forgot-password",
  noindex: true,
});

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
