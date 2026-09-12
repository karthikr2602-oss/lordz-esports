import { useEffect } from "react";
import { PageHero } from "../components/common/PageHero";
import { AboutSection } from "../sections/AboutSection";
import { StatsSection } from "../sections/StatsSection";

export const AboutPage = () => {
  useEffect(() => {
    document.title = "LORDZ ESPORTS — About Organization & Manifesto";
  }, []);

  return (
    <div className="min-h-screen bg-[#050505]">
      <PageHero
        badge="ORGANIZATION PROFILE"
        title="ABOUT"
        titleHighlight="LORDZ"
        subtitle="Born from the fierce competitive pulse of Indian mobile gaming, building legacy through discipline, culture, and dominance."
      />

      <AboutSection showHeader={false} />
      <StatsSection />
    </div>
  );
};
