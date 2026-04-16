import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import PromoCards from "@/components/sections/PromoCards";
import CreditSimulator from "@/components/sections/CreditSimulator";
import TrustSection from "@/components/sections/TrustSection";
import WhyUs from "@/components/sections/WhyUs";
import CarCarousel from "@/components/sections/CarCarousel";
import TipsVideos from "@/components/sections/TipsVideos";
import HowItWorks from "@/components/sections/HowItWorks";
import Reviews from "@/components/sections/Reviews";
import CarTypes from "@/components/sections/CarTypes";
import BlogSection from "@/components/sections/BlogSection";
import SearchFilters from "@/components/sections/SearchFilters";
import Footer from "@/components/sections/Footer";
import type { CarCard } from "@/components/sections/CarCarousel";

const bestSellers: CarCard[] = [
  { id: 1, name: "Chevrolet Aveo", variant: "1.5 LT A", price: 152999, monthly: 3025, year: 2020, image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=448&h=256&fit=crop&auto=format" },
  { id: 2, name: "MG ZS", variant: "1.5 EXCITE AUTO", price: 205999, monthly: 4109, year: 2022, image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=448&h=256&fit=crop&auto=format" },
  { id: 3, name: "MG MG3", variant: "1.5 EXCITE CVT", price: 169999, monthly: 3212, year: 2021, image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=448&h=256&fit=crop&auto=format" },
  { id: 4, name: "Dfm Seres 3 Pro", variant: "1.5 S LUXURY CVT", price: 246999, monthly: 4878, year: 2023, badge: "Más vendido", image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=448&h=256&fit=crop&auto=format" },
  { id: 5, name: "Chery Tiggo 3 Pro", variant: "1.5 S LUXURY CVT", price: 215999, monthly: 4178, year: 2022, image: "https://images.unsplash.com/photo-1567818735868-e71b99932e29?w=448&h=256&fit=crop&auto=format" },
  { id: 6, name: "Nissan Versa", variant: "1.6 ADVANCE CVT", price: 189999, monthly: 3750, year: 2021, image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=448&h=256&fit=crop&auto=format" },
];

const featured: CarCard[] = [
  { id: 7, name: "Chevrolet Aveo", variant: "1.5 LT A", price: 169999, monthly: 3412, year: 2022, image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=448&h=256&fit=crop&auto=format" },
  { id: 8, name: "Mazda CX-5", variant: "2.5 i Grand Touring", price: 254999, monthly: 5025, year: 2021, badge: "Destacado", image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=448&h=256&fit=crop&auto=format" },
  { id: 9, name: "Kia Soul", variant: "2.0 LX AT", price: 215999, monthly: 4212, year: 2020, image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=448&h=256&fit=crop&auto=format" },
  { id: 10, name: "MG ZS", variant: "1.5 EXCITE AUTO", price: 237999, monthly: 4678, year: 2023, image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=448&h=256&fit=crop&auto=format" },
  { id: 11, name: "MG MG5", variant: "1.5 EXCITE CVT", price: 215999, monthly: 4225, year: 2022, image: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=448&h=256&fit=crop&auto=format" },
  { id: 12, name: "Toyota Corolla", variant: "1.8 LE CVT", price: 278999, monthly: 5512, year: 2022, image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=448&h=256&fit=crop&auto=format" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <PromoCards />
        <CreditSimulator />
        <TrustSection />
        <WhyUs />
        <CarCarousel title="Los más vendidos" cars={bestSellers} />
        <CarCarousel title="Destacados del Catálogo" cars={featured} />
        <TipsVideos />
        <HowItWorks />
        <Reviews />
        <CarTypes />
        <BlogSection />
        <SearchFilters />
      </main>
      <Footer />
    </div>
  );
}
