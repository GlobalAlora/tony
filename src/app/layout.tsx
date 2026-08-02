import type { Metadata, Viewport } from "next";
import { Inter, Unbounded } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SITE_NAME, SITE_URL } from "@/lib/constants/site";
import { CREATOR } from "@/lib/constants/creator-data";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${CREATOR.displayName} — Media Kit para Marcas`,
    template: `%s — ${SITE_NAME}`,
  },
  description: `${CREATOR.displayName} es creador de contenido en ${CREATOR.location.city}, ${CREATOR.location.country}: humor, vida universitaria y lifestyle para más de 357K seguidores en TikTok e Instagram. Media kit con métricas, audiencia y formulario de propuestas.`,
  applicationName: SITE_NAME,
  authors: [{ name: CREATOR.fullName }],
  category: "Marketing de influencers",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0e",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${unbounded.variable} ${inter.variable} scroll-smooth`}
    >
      <body className="relative flex min-h-screen flex-col bg-surface text-ink antialiased">
        <div className="grain-overlay" aria-hidden="true" />
        <SiteHeader />
        <main className="relative z-0 flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
