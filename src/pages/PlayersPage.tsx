import { useState, useEffect } from "react";
import { PageHero } from "../components/common/PageHero";
import { PlayersSection } from "../sections/PlayersSection";
import { playersApi, type LegendItem, fallbackLegends } from "../api/players";
import { Sparkles, Award, Users } from "lucide-react";
import { motion } from "framer-motion";

export const PlayersPage = () => {
  const [activeTab, setActiveTab] = useState<"active" | "legends">("active");
  const [legends, setLegends] = useState<LegendItem[]>(fallbackLegends);

  useEffect(() => {
    document.title = "LORDZ ESPORTS — Pro Athlete Roster & Legends";
    playersApi
      .getLegends()
      .then((data) => {
        if (data && data.length > 0) setLegends(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#050505]">
      <PageHero
        badge="ATHLETE ROSTER & HALL OF FAME"
        title="MEET THE"
        titleHighlight="CHAMPIONS"
        subtitle="The championship athletes and legendary pioneers who built the Lordz Esports national legacy."
      />

      {/* Roster & Legends Tab Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#0D0D12] border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
            <button
              onClick={() => setActiveTab("active")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "active"
                  ? "bg-[#FFBE32] text-black shadow-[0_0_15px_rgba(255,190,50,0.35)] font-extrabold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Active Pro Roster</span>
            </button>

            <button
              onClick={() => setActiveTab("legends")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "legends"
                  ? "bg-[#FFBE32] text-black shadow-[0_0_15px_rgba(255,190,50,0.35)] font-extrabold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Old Players & Legends</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === "active" ? (
        <PlayersSection showHeader={false} />
      ) : (
        /* Old Players / Legends Section */
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#050505] overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="font-heading text-xs font-bold tracking-[0.25em] text-[#FFBE32] uppercase">
                HALL OF FAME • RETIRED PIONEERS
              </span>
              <h2 className="font-display text-3xl sm:text-4xl uppercase text-white mt-2">
                LEGENDS OF <span className="text-[#FFBE32]">LORDZ ESPORTS</span>
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-gray-400 font-body">
                Honoring the iconic veteran players whose tactical dominance, record-breaking booyahs, and retired jerseys forged our organization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {legends.map((leg, index) => (
                <motion.div
                  key={leg.id || leg.ign}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="p-6 rounded-2xl bg-[#0B0B0E] border border-[#FFBE32]/25 hover:border-[#FFBE32]/70 flex flex-col justify-between transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.8)] relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFBE32]/5 blur-3xl pointer-events-none" />

                  <div>
                    {/* Top Era and Retired Jersey */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <span className="px-2.5 py-0.5 rounded bg-black border border-white/10 text-[10px] font-mono text-[#FFBE32] font-bold">
                        ERA: {leg.activeYears}
                      </span>
                      {leg.retiredJerseyNumber && (
                        <span className="font-mono text-xs font-bold text-amber-300">
                          RETIRED #{leg.retiredJerseyNumber}
                        </span>
                      )}
                    </div>

                    {/* Legend Name */}
                    <div className="mt-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-3xl uppercase tracking-wider text-white group-hover:text-[#FFBE32] transition-colors">
                          {leg.ign}
                        </h3>
                        <Sparkles className="h-4 w-4 text-[#FFBE32]" />
                      </div>
                      <span className="text-xs text-gray-400 font-body block mt-0.5">
                        {leg.realName} • <strong className="text-gray-300 uppercase">{leg.role}</strong>
                      </span>
                    </div>

                    {/* Achievements */}
                    <div className="mt-4 p-3 rounded-xl bg-black/60 border border-white/5 space-y-1">
                      <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#FFBE32] flex items-center gap-1.5">
                        <Award className="h-3.5 w-3.5" /> Hallmark Achievements:
                      </span>
                      <p className="text-gray-300 font-body text-xs">
                        {leg.achievements}
                      </p>
                    </div>

                    {/* Bio */}
                    <p className="mt-4 text-xs text-gray-400 font-body leading-relaxed">
                      {leg.hallOfFameBio}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-500">
                    <span>Lordz Hall of Fame</span>
                    <span className="text-[#FFBE32]">Permanent Inductee</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
