import type { Metadata } from "next";
import { AboutSection } from "@/components/about/AboutSection";
import { AudienceSection } from "@/components/audience/AudienceSection";
import { CaseStudiesSection } from "@/components/case-studies/CaseStudiesSection";
import { ContentPillarsSection } from "@/components/content-pillars/ContentPillarsSection";
import { FAQSection } from "@/components/faq/FAQSection";
import { Hero } from "@/components/hero/Hero";
import { ProposalFormSection } from "@/components/proposal-form/ProposalFormSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { StatsSection } from "@/components/stats/StatsSection";
import { CREATOR, getTagline } from "@/lib/constants/creator-data";
import { getHomePageJsonLd } from "@/lib/seo/schema";

const KEYWORDS = [
  "influencer La Plata",
  "creador de contenido TikTok Argentina",
  "media kit influencer Argentina",
  "humor universitario",
  "arquitectura Arqui",
  "lifestyle Argentina TikTok",
  "colaboraciones con marcas Argentina",
];

export async function generateMetadata(): Promise<Metadata> {
  const tagline = await getTagline();

  return {
    title: `${CREATOR.displayName} — Influencer y Creador de Contenido en La Plata, Argentina`,
    description: `Media kit oficial de ${CREATOR.displayName}: métricas de audiencia, pilares de contenido (humor, vida universitaria, lifestyle) y formulario de propuestas para marcas.`,
    keywords: KEYWORDS,
    openGraph: {
      type: "profile",
      locale: "es_AR",
      title: `${CREATOR.displayName} — Media Kit para Marcas`,
      description: tagline,
      siteName: `${CREATOR.displayName} — Media Kit`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${CREATOR.displayName} — Media Kit para Marcas`,
      description: tagline,
    },
  };
}

export default async function HomePage() {
  const jsonLd = await getHomePageJsonLd();

  return (
    <>
      <JsonLd data={jsonLd} />
      <Hero />
      <StatsSection />
      <AboutSection />
      <ContentPillarsSection />
      <AudienceSection />
      <CaseStudiesSection />
      <FAQSection />
      <ProposalFormSection />
    </>
  );
}
