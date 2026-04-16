import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="flex-1 flex flex-col bg-[#f5f5f5]">
        {children}
      </div>
      <Footer />
    </>
  );
}
