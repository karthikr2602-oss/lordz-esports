import { useEffect } from "react";
import { PageHero } from "../components/common/PageHero";
import { FlameOfGlorySection } from "../sections/FlameOfGlorySection";
import { useModals } from "../context/useModals";

export const FlameOfGloryPage = () => {
  const { openJoinTournament } = useModals();

  useEffect(() => {
    document.title = "LORDZ ESPORTS — Flame of Glory Leaderboard";
  }, []);

  return (
    <div className="min-h-screen bg-[#070709]">
      <PageHero
        badge="SEASON CHAMPIONSHIP"
        title="FLAME OF"
        titleHighlight="GLORY"
        subtitle="Official Grand Finals standings, match-by-match WWCDs, and circuit position points for India's fiercest rosters."
      />

      <FlameOfGlorySection onOpenJoin={() => openJoinTournament()} showHeader={false} />
    </div>
  );
};
