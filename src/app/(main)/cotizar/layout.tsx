import { buildMetadata } from "@/lib/seo";

// cotizar/page.tsx es un client component y no puede exportar `metadata`.
export const metadata = buildMetadata({
  title: "Cotiza y vende tu auto",
  description:
    "Recibe una oferta por tu auto en minutos. Cotización sin costo, sin compromiso y con pago inmediato al cerrar.",
  path: "/cotizar",
});

export default function CotizarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
