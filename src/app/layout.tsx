import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { APP_NAME } from "@/lib/config";
import { SITE_URL, SITE_DESCRIPTION, absoluteUrl } from "@/lib/seo";
import { SWRProvider } from "@/lib/swr-provider";
import { ReduxProvider } from "@/redux/provider";
import { ThemeProvider } from "@/components/theme-provider";
import OdooLivechat from "@/components/OdooLivechat";

/**
 * Design System VALUE: Avenir (títulos) + Museo Sans (cuerpo) + Raleway
 * (etiquetas y números).
 *
 * globals.css sólo consume `--font-avenir` / `--font-museo` / `--font-raleway`,
 * así que cambiar una familia se hace ÚNICAMENTE aquí.
 */

/**
 * Etiquetas y números. Raleway variable (100-900), subset latin, self-hosted.
 *
 * NO usar `next/font/google`: aunque también self-hostea el resultado, descarga
 * las fuentes desde fonts.gstatic.com EN BUILD TIME, lo que rompe cualquier
 * build sin salida a internet (Docker aislado, CI offline, red corporativa).
 * Aquí los .woff2 están versionados en el repo, así que el build es hermético.
 *
 * Raleway es SIL Open Font License 1.1 - self-hosting y redistribución
 * permitidos. Subset latin (U+0000-00FF): cubre todo el español, incluidos
 * acentos, ñ, ¿ y ¡. Para actualizarla, ver src/fonts/README.md.
 */
const raleway = localFont({
  src: [
    { path: "../fonts/raleway/Raleway-Variable.woff2", style: "normal" },
    { path: "../fonts/raleway/Raleway-Variable-Italic.woff2", style: "italic" },
  ],
  // Variable: un solo archivo cubre todo el rango de pesos del DS
  // (Light 300 · Medium 500 · SemiBold 600 · Bold 700).
  weight: "100 900",
  display: "swap",
  variable: "--font-raleway",
});

/**
 * Títulos y destacados. Licencia propia, self-hosted (.woff2).
 * Mapeo de los nombres Avenir a pesos CSS - el DS usa Light (Display L) y
 * Medium (Heading 1-4):
 *   Light 35 → 300 · Roman 55 → 400 · Medium 65 → 500 · Heavy 85 → 700 · Black 95 → 900
 * `Avenir-Book` (45) existe en public/fonts/avenir pero el DS no lo lista, así
 * que queda fuera para no cargar peso muerto.
 */
const avenir = localFont({
  src: [
    { path: "../fonts/avenir/Avenir-Light.woff2", weight: "300", style: "normal" },
    { path: "../fonts/avenir/Avenir-LightOblique.woff2", weight: "300", style: "italic" },
    { path: "../fonts/avenir/Avenir-Roman.woff2", weight: "400", style: "normal" },
    { path: "../fonts/avenir/Avenir-Oblique.woff2", weight: "400", style: "italic" },
    { path: "../fonts/avenir/Avenir-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/avenir/Avenir-MediumOblique.woff2", weight: "500", style: "italic" },
    { path: "../fonts/avenir/Avenir-Heavy.woff2", weight: "700", style: "normal" },
    { path: "../fonts/avenir/Avenir-HeavyOblique.woff2", weight: "700", style: "italic" },
    { path: "../fonts/avenir/Avenir-Black.woff2", weight: "900", style: "normal" },
    { path: "../fonts/avenir/Avenir-BlackOblique.woff2", weight: "900", style: "italic" },
  ],
  display: "swap",
  variable: "--font-avenir",
});

/**
 * Cuerpo de texto. Licencia propia, self-hosted (.woff2).
 * El DS usa 300 (Body Text 2), 500 (Body Text 1) y 700/900 para énfasis.
 */
const museoSans = localFont({
  src: [
    { path: "../fonts/museo-sans/MuseoSans-100.woff2", weight: "100", style: "normal" },
    { path: "../fonts/museo-sans/MuseoSans-100Italic.woff2", weight: "100", style: "italic" },
    { path: "../fonts/museo-sans/MuseoSans-300.woff2", weight: "300", style: "normal" },
    { path: "../fonts/museo-sans/MuseoSans-300Italic.woff2", weight: "300", style: "italic" },
    { path: "../fonts/museo-sans/MuseoSans_500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/museo-sans/MuseoSans_500_Italic.woff2", weight: "500", style: "italic" },
    { path: "../fonts/museo-sans/MuseoSans_700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/museo-sans/MuseoSans-700Italic.woff2", weight: "700", style: "italic" },
    { path: "../fonts/museo-sans/MuseoSans_900.woff2", weight: "900", style: "normal" },
    { path: "../fonts/museo-sans/MuseoSans-900Italic.woff2", weight: "900", style: "italic" },
  ],
  display: "swap",
  variable: "--font-museo",
});

export const metadata: Metadata = {
  // Base para resolver canonical / OG / JSON-LD a URLs absolutas.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${APP_NAME} - Compra y Vende tu Auto`,
    // Las páginas hijas sólo declaran su título; la marca se añade aquí.
    template: `%s | ${APP_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/") },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    siteName: APP_NAME,
    title: `${APP_NAME} - Compra y Vende tu Auto`,
    description: SITE_DESCRIPTION,
    locale: "es_MX",
  },
  twitter: { card: "summary_large_image" },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

/** Organization: identifica la marca ante Google (Knowledge Panel, sitelinks). */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: APP_NAME,
  url: absoluteUrl("/"),
  logo: absoluteUrl("/value1024x1024.png"),
  description: SITE_DESCRIPTION,
  areaServed: { "@type": "Country", name: "México" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      // next-themes escribe la clase del tema en <html> antes de hidratar; sin
      // esto React avisaría de un desajuste servidor/cliente que es esperado.
      suppressHydrationWarning
      className={`${avenir.variable} ${museoSans.variable} ${raleway.variable} h-full antialiased`}
      /*
        globals.css pone `scroll-behavior: smooth` (viene del design system, para
        los anclas internos). Este atributo le dice a Next que lo desactive
        durante los cambios de ruta: sin él, cada navegación anima el scroll
        hasta arriba en vez de saltar, y el contenido tarda en aparecer.
      */
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD serializado desde datos estáticos propios, no entrada de usuario
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SWRProvider>
            <ReduxProvider>{children}</ReduxProvider>
          </SWRProvider>
        </ThemeProvider>
        <OdooLivechat />
      </body>
    </html>
  );
}
