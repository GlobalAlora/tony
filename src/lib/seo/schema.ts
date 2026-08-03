import {
  ALL_SOCIAL_URLS,
  CREATOR,
} from "@/lib/constants/creator-data";
import { getFaqItems } from "@/lib/constants/faq";
import { SITE_URL } from "@/lib/constants/site";

/**
 * Single @graph combining ProfilePage + Person + FAQPage, cross-referenced
 * by @id. Built from the same live-merged data the visible page renders
 * from (via getFaqItems), so the JSON-LD can never state a stale follower
 * count the HTML doesn't also show — that consistency is what generative
 * engines use as a trust signal.
 *
 * No `image` field on Person: a real hero photo now exists (see
 * HeroCarousel), but it's a rotating carousel of 11 photos rather than one
 * canonical portrait, so there's no single correct URL for this field yet.
 */
export async function getHomePageJsonLd() {
  const faqItems = await getFaqItems();
  const personId = `${SITE_URL}/#person`;
  const profilePageId = `${SITE_URL}/#profile`;
  const faqId = `${SITE_URL}/#faq`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": profilePageId,
        url: SITE_URL,
        name: `${CREATOR.displayName} — Media Kit`,
        inLanguage: "es-AR",
        mainEntity: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: CREATOR.fullName,
        alternateName: CREATOR.displayName,
        url: SITE_URL,
        jobTitle: "Creador de contenido",
        description: CREATOR.tagline,
        address: {
          "@type": "PostalAddress",
          addressLocality: CREATOR.location.city,
          addressRegion: CREATOR.location.province,
          addressCountry: CREATOR.location.countryCode,
        },
        email: `mailto:${CREATOR.email}`,
        sameAs: ALL_SOCIAL_URLS,
      },
      {
        "@type": "FAQPage",
        "@id": faqId,
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}
