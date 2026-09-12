import { useEffect } from "react";
import { PageHero } from "../components/common/PageHero";
import { CommunitySection } from "../sections/CommunitySection";

export const CommunityPage = () => {
  useEffect(() => {
    document.title = "LORDZ ESPORTS — Community, Discord & Channels";
  }, []);

  return (
    <div className="min-h-screen bg-[#070709]">
      <PageHero
        badge="INDIAN GAMING GUILD"
        title="JOIN THE"
        titleHighlight="COMMUNITY"
        subtitle="Connect with over 100,000+ passionate competitive gamers, tier-1 scrim players, and tournament fans across our official channels."
      />

      <CommunitySection showHeader={false} />
    </div>
  );
};
