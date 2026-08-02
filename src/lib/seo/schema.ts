import {
  ALL_SOCIAL_URLS,
  CREATOR,
} from "@/lib/constants/creator-data";
import { FAQ_ITEMS } from "@/lib/constants/faq";
import { SITE_URL } from "@/lib/constants/site";

/**
 * Single @graph combining ProfilePage + Person + FAQPage, cross-referenced
 * by @id. Built from the same constants the visible page renders from, so
 * the JSON-LD can never state a fact the HTML doesn't also show — that
 * consistency is what generative engines use as a trust signal.
 *
 * No `image` field on Person yet: there's no real photo in /public yet
 * (see MediaPlaceholder usage in Hero), and a placeholder URL would be a
 * false structured-data claim. Add it once a real hero photo exists.
 */
export function getHomePageJsonLd() {
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
        mainEntity: FAQ_ITEMS.map((item) => ({
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
