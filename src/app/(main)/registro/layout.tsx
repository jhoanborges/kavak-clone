import { buildMetadata } from "@/lib/seo";

/**
 * Cubre todo el flujo de registro: /registro, /verificar, /continuar,
 * /agendar y /agendar/exito. Los cinco son pasos transaccionales — noindex,
 * y ninguno debe competir en búsqueda con las páginas de catálogo.
 */
export const metadata = buildMetadata({
  title: "Crear cuenta",
  description: "Crea tu cuenta para apartar tu auto o agendar una visita.",
  path: "/registro",
  noindex: true,
});

export default function RegistroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
