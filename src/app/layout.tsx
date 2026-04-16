import type { Metadata } from "next";
import "./globals.css";
import { APP_NAME } from "@/lib/config";
import { ReduxProvider } from "@/redux/provider";

export const metadata: Metadata = {
  title: `${APP_NAME} — Compra y Vende tu Auto`,
  description:
    "Compra o vende tu auto seminuevo certificado. Financiamiento a tu medida. Más de 300,000 clientes satisfechos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
