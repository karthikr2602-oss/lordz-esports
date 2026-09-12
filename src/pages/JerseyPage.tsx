import { useEffect } from "react";
import { PageHero } from "../components/common/PageHero";
import { JerseyShowcaseSection } from "../sections/JerseyShowcaseSection";
import { useModals } from "../context/useModals";

export const JerseyPage = () => {
  const { openJersey } = useModals();

  useEffect(() => {
    document.title = "LORDZ ESPORTS — Official Combat Merchandise & Jersey";
  }, []);

  return (
    <div className="min-h-screen bg-[#070709]">
      <PageHero
        badge="OFFICIAL MERCHANDISE"
        title="WEAR THE"
        titleHighlight="LORDZ"
        subtitle="Engineered for high-pressure competition. Crafted with Dravidian temple heritage, athlete IGN sublimation, and battle flame aesthetics."
      />

      <JerseyShowcaseSection onShopJersey={openJersey} showHeader={false} />
    </div>
  );
};
