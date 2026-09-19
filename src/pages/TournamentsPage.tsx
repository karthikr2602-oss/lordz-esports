import { useEffect } from "react";
import { PageHero } from "../components/common/PageHero";
import { TournamentsSection } from "../sections/TournamentsSection";
import { useModals } from "../context/useModals";

export const TournamentsPage = () => {
  const { openJoinTournament } = useModals();

  useEffect(() => {
    document.title = "LORDZ ESPORTS — Tournament Arena & Scrims";
  }, []);

  return (
    <div className="min-h-screen bg-[#050505]">
      <PageHero
        badge="COMPETITIVE CIRCUITS"
        title="TOURNAMENT"
        titleHighlight="ARENA"
        subtitle="Register your squad, compete for verified cash prize pools, and earn national circuit ranking in official Free Fire and Free Fire MAX championships."
      />

      <TournamentsSection onSelectTournament={openJoinTournament} showHeader={false} />
    </div>
  );
};
