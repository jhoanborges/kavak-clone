import { buildMetadata } from "@/lib/seo";

// contacto/page.tsx es un client component y no puede exportar `metadata`.
export const metadata = buildMetadata({
  title: "Contacto",
  description:
    "¿Dudas sobre tu compra, crédito o cita? Escríbenos y te respondemos el mismo día hábil.",
  path: "/contacto",
});

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
