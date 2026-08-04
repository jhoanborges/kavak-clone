import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import PromoCards from "@/components/sections/PromoCards";
import OfertasDestacadas from "@/components/sections/OfertasDestacadas";
import CreditSimulator from "@/components/sections/CreditSimulator";
import TrustSection from "@/components/sections/TrustSection";
import WhyUs from "@/components/sections/WhyUs";
import ServicioPremium from "@/components/sections/ServicioPremium";
import ComoFunciona from "@/components/sections/ComoFunciona";
import TipsVideos from "@/components/sections/TipsVideos";
import HowItWorks from "@/components/sections/HowItWorks";
import Reviews from "@/components/sections/Reviews";
import CarTypes from "@/components/sections/CarTypes";
import BlogSection from "@/components/sections/BlogSection";
import BusquedasRecientes from "@/components/sections/BusquedasRecientes";
import Footer from "@/components/sections/Footer";

/**
 * El catálogo de autos inventados con fotos de Unsplash
 * quedaron fuera: el inventario del home sale ahora de la API real, vía
 * <OfertasDestacadas>. Ver docs/api-vehiculos.md.
 *
 * <CatalogoInfinito> existe pero NO va aquí: es para /vehiculos.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <PromoCards />
        <OfertasDestacadas cantidad={4} />
        <CreditSimulator />
        <TrustSection />
        <WhyUs />
        <ServicioPremium />
        <ComoFunciona />
        <TipsVideos />
        {/* OJO: <HowItWorks> (tabs Compra/Vende, 3 pasos) cubre el MISMO tema
            que <ComoFunciona> (5 pasos). Tener las dos en el home repite el
            mensaje y compiten entre sí. Ver nota al entregar. */}
        <HowItWorks />
        <Reviews />
        <CarTypes />
        <BlogSection />
        <BusquedasRecientes />
      </main>
      <Footer />
    </div>
  );
}
