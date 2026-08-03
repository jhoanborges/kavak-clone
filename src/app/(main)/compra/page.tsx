import CatalogClient from "@/components/catalog/CatalogClient";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Compra un auto — Seminuevos certificados",
  description:
    "Encuentra tu auto seminuevo certificado: más de 100 unidades revisadas, con garantía y financiamiento. Filtra por marca, modelo, precio y kilometraje.",
  path: "/compra",
});

export default function CompraPage() {
  return (
    <main className="flex-1 bg-muted">
      <CatalogClient />
    </main>
  );
}
