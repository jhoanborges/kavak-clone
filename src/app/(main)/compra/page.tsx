import CatalogClient from "@/components/catalog/CatalogClient";

export const metadata = {
  title: "Compra un auto — Seminuevos certificados",
  description:
    "Encuentra tu auto seminuevo certificado. Filtra por marca, modelo, precio y más.",
};

export default function CompraPage() {
  return (
    <main className="flex-1 bg-gray-50">
      <CatalogClient />
    </main>
  );
}
