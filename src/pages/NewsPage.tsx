import { PageHero } from "../components/common/PageHero";
import { NewsSection } from "../sections/NewsSection";
import { useModals } from "../context/useModals";
import { SEO } from "../components/common/SEO";
import { SITE_URL } from "../config/seo";
import { newsData } from "../data/news";

export const NewsPage = () => {
  const { openArticle } = useModals();

  const newsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "LORDZ ESPORTS News & Dispatches",
    description: "Official competitive reports and announcements from LORDZ ESPORTS.",
    url: `${SITE_URL}/news`,
    numberOfItems: newsData.length,
    itemListElement: newsData.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "NewsArticle",
        headline: item.title,
        description: item.excerpt,
        datePublished: "2026-09-12",
        author: {
          "@type": "Organization",
          name: "LORDZ ESPORTS",
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "LORDZ ESPORTS",
          url: SITE_URL,
        },
        image: item.coverImage || item.image || `${SITE_URL}/og-image.jpg`,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#070709]">
      <SEO
        title="LORD ESPORTS News | Official Reports, Tournament Briefs &amp; Roster Updates"
        description="Stay up to date with the latest dispatches, competitive match debriefs, tournament announcements, and roster updates from LORDZ ESPORTS."
        canonicalPath="/news"
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "News", item: "/news" },
        ]}
        structuredData={newsSchema}
      />

      <PageHero
        badge="EDITORIAL & MEDIA DISPATCHES"
        title="LATEST FROM"
        titleHighlight="LORD"
        subtitle="Roster movements, official tournament briefings, tier-1 scrim announcements, and competitive post-match debriefs."
      />

      <NewsSection onSelectArticle={openArticle} showHeader={false} />
    </div>
  );
};
