import { Link } from "react-router-dom";
import { PageHero } from "../components/common/PageHero";
import { PlayersSection } from "../sections/PlayersSection";
import { Vote, ArrowRight } from "lucide-react";
import { SEO } from "../components/common/SEO";
import { SITE_URL } from "../config/seo";
import { playersData } from "../data/players";

export const PlayersPage = () => {
  const playersSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "LORDZ ESPORTS Official Athlete Roster",
    description: "Championship esports athletes representing LORDZ ESPORTS.",
    url: `${SITE_URL}/players`,
    numberOfItems: playersData.length,
    itemListElement: playersData.map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Person",
        name: p.realName,
        alternateName: p.ign,
        jobTitle: `${p.role} - Pro Free Fire Athlete`,
        description: p.about,
        image: p.image?.startsWith("http") ? p.image : `${SITE_URL}${p.image || "/players/player-beast.jpg"}`,
        worksFor: {
          "@type": "SportsOrganization",
          name: "LORDZ ESPORTS",
          url: SITE_URL,
        },
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <SEO
        title="LORD ESPORTS Players | Official Pro Athlete Roster"
        description="Meet the championship esports athletes of LORDZ ESPORTS competing across national Free Fire and Free Fire MAX circuits: BEAST, SHADOW, FALCON, and VIPER."
        canonicalPath="/players"
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Players", item: "/players" },
        ]}
        structuredData={playersSchema}
      />

      <PageHero
        badge="PRO ATHLETE ROSTER"
        title="MEET THE"
        titleHighlight="CHAMPIONS"
        subtitle="The championship athletes representing Lord Esports across premier national mobile stages."
      />

      {/* Community Voting CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 -mb-4">
        <Link
          to="/voting"
          className="group flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FFBE32]/15 via-[#121217] to-[#0A0A0D] border border-[#FFBE32]/40 hover:border-[#FFBE32] hover:shadow-[0_0_30px_rgba(255,190,50,0.2)] transition-all"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#FFBE32] text-black shrink-0 shadow-[0_0_15px_rgba(255,190,50,0.4)]">
              <Vote className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFBE32]">
                  COMMUNITY FAN POLL
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#FFBE32]/20 text-[#FFBE32] text-[9px] font-heading font-black uppercase">
                  LIVE
                </span>
              </div>
              <h3 className="font-heading font-black text-sm sm:text-base text-white uppercase tracking-wider group-hover:text-[#FFBE32] transition-colors">
                Vote for your Lord MVP of the Season
              </h3>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-heading font-black text-[#FFBE32] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
            <span>Cast Your Vote</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </Link>
      </div>

      <PlayersSection showHeader={false} />
    </div>
  );
};
