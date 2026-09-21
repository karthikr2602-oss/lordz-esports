import { useEffect } from "react";
import { PageHero } from "../components/common/PageHero";
import { HallOfGlorySection } from "../sections/HallOfGlorySection";

export const HallOfGloryPage = () => {
  useEffect(() => {
    document.title = "LORD ESPORTS — Hall of Glory & Trophies";
  }, []);

  return (
    <div className="min-h-screen bg-[#050505]">
      <PageHero
        badge="TROPHY ROOM & ACHIEVEMENTS"
        title="HALL OF"
        titleHighlight="GLORY"
        subtitle="Honoring the landmark championship victories, event MVPs, and historic milestones in Lord Esports history."
      />

      <HallOfGlorySection showHeader={false} />
    </div>
  );
};
