import type { Metadata, Viewport } from "next";
import { Inter, Unbounded } from "next/font/google";
import Script from "next/script";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SITE_NAME, SITE_URL } from "@/lib/constants/site";
import { CREATOR, getTotalFollowersDisplay } from "@/lib/constants/creator-data";
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

const TITLE = `${CREATOR.displayName} — Media Kit para Marcas`;

export async function generateMetadata(): Promise<Metadata> {
  const totalFollowers = await getTotalFollowersDisplay();
  const description = `${CREATOR.displayName} es creador de contenido en ${CREATOR.location.city}, ${CREATOR.location.country}: humor, vida universitaria y lifestyle para más de ${totalFollowers} seguidores en redes sociales. Media kit con métricas, audiencia y formulario de propuestas.`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: TITLE,
      template: `%s — ${SITE_NAME}`,
    },
    description,
    applicationName: SITE_NAME,
    authors: [{ name: CREATOR.fullName }],
    category: "Marketing de influencers",
    keywords: [
      "influencer La Plata",
      "creador de contenido TikTok Argentina",
      "media kit influencer Argentina",
      "humor universitario",
      "lifestyle Argentina",
      CREATOR.fullName,
    ],
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "profile",
      locale: "es_AR",
      url: SITE_URL,
      siteName: SITE_NAME,
      title: TITLE,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description,
    },
  };
}

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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0HRZ8HXEXF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0HRZ8HXEXF');
          `}
        </Script>
        <div className="grain-overlay" aria-hidden="true" />
        <SiteHeader />
        <main className="relative z-0 flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
