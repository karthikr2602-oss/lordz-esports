import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PageHero } from "../components/common/PageHero";
import { AboutSection } from "../sections/AboutSection";
import { PlayersSection } from "../sections/PlayersSection";
import { TheCollectiveSection } from "../sections/TheCollectiveSection";
import { StatsSection } from "../sections/StatsSection";
import { SEO } from "../components/common/SEO";
import { buildOrganizationSchema } from "../config/seo";
import { Shield, Users, Trophy, Sparkles } from "lucide-react";

export const AboutPage = () => {
  const location = useLocation();
  const [activeAnchor, setActiveAnchor] = useState<string>("manifesto");

  // Handle hash scrolling when navigating to #players, #teams, or #manifesto
  useEffect(() => {
    const hash = location.hash || window.location.hash;
    if (hash) {
      const cleanHash = hash.replace(/^#/, "");
      setActiveAnchor(cleanHash);
      const targetElement = document.getElementById(cleanHash);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash]);

  const scrollToAnchor = (anchorId: string) => {
    setActiveAnchor(anchorId);
    const element = document.getElementById(anchorId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${anchorId}`);
    }
  };

  const navAnchors = [
    { id: "manifesto", label: "Manifesto & Story", icon: Sparkles },
    { id: "players", label: "Pro Athletes Roster", icon: Trophy },
    { id: "teams", label: "The Collective Team", icon: Users },
    { id: "stats", label: "Championship Records", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] selection:bg-[#FFBE32] selection:text-black">
      <SEO
        title="About LORD ESPORTS | Organization History, Pro Athletes & Leadership Collective"
        description="Explore the complete world of LORDZ ESPORTS: Our competitive manifesto, the national champion athletes roster, and the collective engineering and operations team."
        canonicalPath="/about"
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "About", item: "/about" },
        ]}
        structuredData={buildOrganizationSchema()}
      />

      <PageHero
        badge="ORGANIZATION PROFILE & DIRECTORY"
        title="ABOUT"
        titleHighlight="LORD ESPORTS"
        subtitle="The competitive manifesto, national champion athlete roster, and the operational collective powering India's elite clan."
      />

      {/* Floating Sub-Navigation Anchor Bar */}
      <div className="sticky top-[68px] z-30 bg-[#070709]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-[0_10px_25px_rgba(0,0,0,0.7)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {navAnchors.map((anchor) => {
              const Icon = anchor.icon;
              const isActive = activeAnchor === anchor.id;
              return (
                <button
                  key={anchor.id}
                  type="button"
                  onClick={() => scrollToAnchor(anchor.id)}
                  className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#FFBE32] text-black shadow-[0_0_15px_rgba(255,190,50,0.35)]"
                      : "bg-[#101014] text-gray-400 hover:text-white border border-white/10 hover:border-[#FFBE32]/40"
                  }`}
                >
                  <Icon className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${isActive ? "text-black" : "text-[#FFBE32]"}`} />
                  <span>{anchor.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 1. Manifesto & Organization Story Section */}
      <div id="manifesto">
        <AboutSection showHeader={false} defaultTab="manifesto" />
      </div>

      {/* 2. Pro Athletes Section */}
      <div id="players">
        <PlayersSection showHeader={true} />
      </div>

      {/* 3. The Collective & Leadership Team Section */}
      <div id="teams">
        <TheCollectiveSection showHeader={true} />
      </div>

      {/* 4. Championship Records & Statistics */}
      <div id="stats" className="border-t border-white/5">
        <StatsSection />
      </div>
    </div>
  );
};
