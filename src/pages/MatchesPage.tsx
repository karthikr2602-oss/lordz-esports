import { useEffect } from "react";
import { PageHero } from "../components/common/PageHero";
import { MatchCenterSection } from "../sections/MatchCenterSection";
import { useModals } from "../context/useModals";

export const MatchesPage = () => {
  const { watchMatch } = useModals();

  useEffect(() => {
    document.title = "LORDZ ESPORTS — Match Center & Broadcasts";
  }, []);

  return (
    <div className="min-h-screen bg-[#050505]">
      <PageHero
        badge="BROADCAST CENTER"
        title="MATCH"
        titleHighlight="CENTER"
        subtitle="Real-time tournament broadcasts, upcoming scheduled scrims, and verified match results across all game titles."
      />

      <MatchCenterSection onWatchMatch={watchMatch} showHeader={false} />
    </div>
  );
};
