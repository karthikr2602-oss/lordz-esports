import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHero } from "../components/common/PageHero";
import { TeamsSection } from "../sections/TeamsSection";

export const TeamsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "LORDZ ESPORTS — The Battlefield & Teams";
  }, []);

  return (
    <div className="min-h-screen bg-[#070709]">
      <PageHero
        badge="ORGANIZATIONS & DIVISIONS"
        title="THE"
        titleHighlight="BATTLEFIELD"
        subtitle="Vetted esports lineups, franchise circuit rankings, win rates, and championship points."
      />

      <TeamsSection onExploreTeams={() => navigate("/flame-of-glory")} showHeader={false} />
    </div>
  );
};
