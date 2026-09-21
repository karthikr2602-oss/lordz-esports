import { useEffect } from "react";
import { PageHero } from "../components/common/PageHero";
import { NewsSection } from "../sections/NewsSection";
import { useModals } from "../context/useModals";

export const NewsPage = () => {
  const { openArticle } = useModals();

  useEffect(() => {
    document.title = "LORD ESPORTS — News, Reports & Dispatches";
  }, []);

  return (
    <div className="min-h-screen bg-[#070709]">
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
