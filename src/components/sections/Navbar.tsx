"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, User, ChevronDown, Menu, X, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { toggleFavorite } from "@/redux/slices/carsSlice";
import { CARS } from "@/data/cars";
import { APP_NAME } from "@/lib/config";

const navLinks = [
  { label: "Obtén un crédito", href: "#" },
  { label: "Compra un auto", href: "/compra" },
  { label: "Vende tu auto", href: "#" },
  { label: "Cuida tu auto", href: "#" },
  { label: "Nosotros", href: "#", hasDropdown: true },
];

function toSlug(car: { brand: string; model: string; id: number }) {
  return `${car.brand}-${car.model}-${car.id}`
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function formatPrice(n: number) {
  return "$" + n.toLocaleString("es-MX");
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  const favRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const favoriteIds = useSelector((state: RootState) => state.cars.favorites);
  const favoriteCars = CARS.filter((c) => favoriteIds.includes(c.id));

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (favRef.current && !favRef.current.contains(e.target as Node)) {
        setFavOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span style={{ fontFamily: "Arial Black, Arial, sans-serif" }} className="font-black text-lg tracking-wider text-foreground">
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-0.5 text-sm text-foreground/80 hover:text-foreground px-3 py-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer whitespace-nowrap"
            >
              {link.label}
              {link.hasDropdown && <ChevronDown className="size-3.5 opacity-60" />}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Mexico flag */}
          <button className="hidden md:flex items-center gap-1 text-sm px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer transition-colors">
            <span className="text-base">🇲🇽</span>
          </button>

          {/* Favorites button + dropdown */}
          <div ref={favRef} className="relative hidden md:block">
            <button
              onClick={() => setFavOpen((v) => !v)}
              className="relative flex items-center p-1.5 hover:bg-muted rounded-md cursor-pointer transition-colors"
              aria-label="Favoritos"
            >
              <Heart className={`size-4 transition-colors ${favoriteCars.length > 0 ? "fill-red-500 text-red-500" : "text-foreground/70"}`} />
              {favoriteCars.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {favoriteCars.length}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {favOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">
                    Favoritos {favoriteCars.length > 0 && <span className="text-muted-foreground font-normal">({favoriteCars.length})</span>}
                  </span>
                  {favoriteCars.length > 0 && (
                    <Link href="/compra" onClick={() => setFavOpen(false)} className="text-xs text-primary hover:underline">
                      Ver todos
                    </Link>
                  )}
                </div>

                {favoriteCars.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-10 px-4 text-center">
                    <Heart className="size-8 text-muted-foreground/40" />
                    <p className="text-sm font-medium text-foreground">Sin favoritos aún</p>
                    <p className="text-xs text-muted-foreground">Dale al corazón en cualquier auto para guardarlo aquí.</p>
                    <Link
                      href="/compra"
                      onClick={() => setFavOpen(false)}
                      className="mt-1 text-xs text-primary hover:underline font-medium"
                    >
                      Explorar autos →
                    </Link>
                  </div>
                ) : (
                  <ul className="max-h-72 overflow-y-auto divide-y divide-border">
                    {favoriteCars.map((car) => (
                      <li key={car.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors group">
                        <Link
                          href={`/compra/${toSlug(car)}`}
                          onClick={() => setFavOpen(false)}
                          className="flex items-center gap-3 flex-1 min-w-0"
                        >
                          <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                            <Image
                              src={car.image}
                              alt={`${car.brand} ${car.model}`}
                              fill
                              className="object-cover"
                              sizes="56px"
                              unoptimized
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {car.brand} {car.model}
                            </p>
                            <p className="text-xs text-muted-foreground">{car.year} · {formatPrice(car.price)}</p>
                          </div>
                        </Link>
                        <button
                          onClick={() => dispatch(toggleFavorite(car.id))}
                          className="shrink-0 p-1.5 rounded-full hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                          aria-label="Quitar de favoritos"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1.5 cursor-pointer" asChild>
            <Link href="/login">
              <User className="size-3.5" />
              Ingresar
            </Link>
          </Button>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-1.5 hover:bg-muted rounded-md cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center justify-between text-sm text-foreground/80 hover:text-foreground px-3 py-2.5 rounded-md hover:bg-muted transition-colors cursor-pointer"
            >
              {link.label}
              {link.hasDropdown && <ChevronDown className="size-4 opacity-50" />}
            </Link>
          ))}
          <div className="pt-2 border-t border-border mt-1 flex flex-col gap-2">
            <Link
              href="/compra"
              className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <Heart className={`size-4 ${favoriteCars.length > 0 ? "fill-red-500 text-red-500" : ""}`} />
              Favoritos
              {favoriteCars.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {favoriteCars.length}
                </span>
              )}
            </Link>
            <Button className="w-full cursor-pointer" size="sm" asChild>
              <Link href="/login">
                <User className="size-3.5" />
                Ingresar
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
