import PerfilCliente from "@/components/perfil/PerfilCliente";
import { buildMetadata } from "@/lib/seo";

// Área privada: nada que indexar. `noindex` evita que el perfil (que sin auth
// real es una demo) aparezca en buscadores.
export const metadata = buildMetadata({
  title: "Mi perfil",
  description: "Gestiona tu cuenta, favoritos y citas en VALUE.",
  path: "/perfil",
  noindex: true,
});

export default function PerfilPage() {
  return (
    <main className="flex-1 bg-muted">
      <PerfilCliente />
    </main>
  );
}
