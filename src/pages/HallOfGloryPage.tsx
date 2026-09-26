import { PageHero } from "../components/common/PageHero";
import { HallOfGlorySection } from "../sections/HallOfGlorySection";
import { SEO } from "../components/common/SEO";

export const HallOfGloryPage = () => {
  return (
    <div className="min-h-screen bg-[#050505]">
      <SEO
        title="LORD ESPORTZ Hall of Glory &amp; Trophy Room"
        description="Honoring landmark championship victories, tournament MVPs, and historic milestones in LORD ESPORTZ history."
        canonicalPath="/tournaments"
      />
      <PageHero
        badge="TROPHY ROOM & ACHIEVEMENTS"
        title="HALL OF"
        titleHighlight="GLORY"
        subtitle="Honoring the landmark championship victories, event MVPs, and historic milestones in LORD ESPORTZ history."
      />

      <HallOfGlorySection showHeader={false} />
    </div>
  );
};
