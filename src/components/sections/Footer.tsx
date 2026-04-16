import { Separator } from "@/components/ui/separator";
import { Share2, Camera, Play, Briefcase } from "lucide-react";
import { APP_NAME } from "@/lib/config";

const links = {
  "": ["Compra un auto", "Obtén un crédito", "Vende tu auto", "Cuida tu auto", "Sedes"],
  Recursos: ["Preguntas frecuentes", "Testimonios", "Blog", "Trabaja con nosotros", "Contacto"],
  País: ["México"],
};

const socials = [
  { icon: Share2, label: "Facebook" },
  { icon: Camera, label: "Instagram" },
  { icon: Play, label: "YouTube" },
  { icon: Briefcase, label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-slate-300 mt-8">
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-6">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Logo col */}
          <div className="col-span-2 md:col-span-1">
            <span
              className="text-white font-black text-2xl tracking-wider"
              style={{ fontFamily: "Arial Black, Arial, sans-serif" }}
            >
              {APP_NAME}
            </span>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed max-w-xs">
              La plataforma de compra y venta de autos usados certificados más grande de América Latina.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              {heading && (
                <p className="text-white font-semibold text-sm mb-3">{heading}</p>
              )}
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-slate-700 mb-6" />

        {/* Social + App Stores */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex gap-3">
            {socials.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="size-9 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Icon className="size-4 text-slate-300" />
              </a>
            ))}
          </div>
          {/* App badges */}
          <div className="flex gap-3">
            {["App Store", "Google Play", "AppGallery"].map((store) => (
              <a
                key={store}
                href="#"
                className="px-3 py-1.5 rounded-lg border border-slate-600 text-xs text-slate-300 hover:border-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {store}
              </a>
            ))}
          </div>
        </div>

        <Separator className="bg-slate-700 mb-4" />

        {/* Legal */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          <span>Copyright © 2026 {APP_NAME}. Todos los derechos reservados.</span>
          <a href="#" className="hover:text-slate-300 cursor-pointer">Aviso de Privacidad</a>
          <a href="#" className="hover:text-slate-300 cursor-pointer">Términos y Condiciones</a>
          <a href="#" className="hover:text-slate-300 cursor-pointer">Transparencia</a>
          <a href="#" className="hover:text-slate-300 cursor-pointer">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
