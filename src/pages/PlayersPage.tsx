import { useEffect } from "react";
import { PageHero } from "../components/common/PageHero";
import { PlayersSection } from "../sections/PlayersSection";

export const PlayersPage = () => {
  useEffect(() => {
    document.title = "LORDZ ESPORTS — Pro Athlete Roster";
  }, []);

  return (
    <div className="min-h-screen bg-[#050505]">
      <PageHero
        badge="PRO ATHLETE ROSTER"
        title="MEET THE"
        titleHighlight="CHAMPIONS"
        subtitle="The championship athletes representing Lordz Esports across premier national mobile stages."
      />

      <PlayersSection showHeader={false} />
    </div>
  );
};
