import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "../components/common/SectionHeading";
import { matchesData, type Match } from "../data/matches";
import { Swords, Play, Clock, Trophy } from "lucide-react";
import logoImg from "../assets/lordz-logo.png";

interface MatchCenterSectionProps {
  onWatchMatch: (match: Match) => void;
  showHeader?: boolean;
}

type TabType = "ALL" | "LIVE" | "UPCOMING" | "RESULT";

export const MatchCenterSection = ({
  onWatchMatch,
  showHeader = true,
}: MatchCenterSectionProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("ALL");

  const filteredMatches = matchesData.filter((m) => {
    if (activeTab === "ALL") return true;
    return m.status === activeTab;
  });

  return (
    <section
      id="matches"
      className={`relative ${showHeader ? "py-24" : "py-12 sm:py-16"} px-4 sm:px-6 lg:px-8 bg-[#050505]`}
    >
      <div className="max-w-7xl mx-auto">
        {showHeader && (
          <SectionHeading
            badge="FIXTURES & RESULTS"
            title="MATCH CENTER"
            subtitle="Real-time tournament broadcasts, upcoming scheduled scrims, and verified match results."
          />
        )}

        {/* Filter Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 rounded-xl bg-[#0D0D10] border border-white/10">
            {(["ALL", "LIVE", "UPCOMING", "RESULT"] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 py-2 rounded-lg font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#FFBE32] text-black shadow-[0_0_15px_rgba(255,190,50,0.35)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab === "RESULT" ? "RESULTS" : tab === "LIVE" ? "LIVE NOW" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Match Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredMatches.map((m) => {
              const isLive = m.status === "LIVE";
              const isUpcoming = m.status === "UPCOMING";

              return (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl bg-[#0C0C0E] border border-white/10 hover:border-[#FFBE32]/50 p-5 sm:p-6 transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex flex-col justify-between"
                >
                  {/* Card Header: Tournament & Status */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div>
                      <span className="font-heading text-xs font-bold text-white uppercase tracking-wider block">
                        {m.tournament}
                      </span>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {m.stage} {m.map ? `• MAP: ${m.map}` : ""}
                      </span>
                    </div>

                    <div>
                      {isLive && (
                        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-[10px] font-heading font-bold text-red-400 uppercase tracking-widest animate-pulse">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                          LIVE
                        </span>
                      )}
                      {isUpcoming && (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-950/40 border border-[#FFBE32]/30 text-[10px] font-heading font-bold text-[#FFBE32] uppercase tracking-widest">
                          <Clock className="h-3 w-3" />
                          UPCOMING
                        </span>
                      )}
                      {m.status === "RESULT" && (
                        <span className="px-2.5 py-0.5 rounded bg-white/10 text-[10px] font-heading font-bold text-gray-300 uppercase tracking-widest">
                          FINAL
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Team Versus Layout */}
                  <div className="py-6 flex items-center justify-between gap-4">
                    {/* Team A */}
                    <div className="flex-1 flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-xl bg-black/60 border border-[#FFBE32]/30 flex items-center justify-center p-2 mb-2 shadow-[0_0_12px_rgba(255,190,50,0.15)]">
                        <img src={logoImg} alt="Lordz" className="h-full w-full object-contain" />
                      </div>
                      <span className="font-display text-base uppercase text-white tracking-wider font-bold truncate max-w-full">
                        {m.teamA.name}
                      </span>
                      {m.teamA.score !== undefined && (
                        <span className="font-display text-2xl font-bold text-[#FFBE32] mt-1">
                          {m.teamA.score} PTS
                        </span>
                      )}
                    </div>

                    {/* VS Badge */}
                    <div className="flex flex-col items-center justify-center px-2">
                      <div className="h-7 w-7 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-gray-400 text-xs font-heading font-bold">
                        VS
                      </div>
                      <span className="text-[10px] font-heading uppercase text-gray-500 mt-1">
                        {m.game}
                      </span>
                    </div>

                    {/* Team B */}
                    <div className="flex-1 flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center p-2 mb-2">
                        <Swords className="h-6 w-6 text-gray-400" />
                      </div>
                      <span className="font-display text-base uppercase text-gray-200 tracking-wider font-bold truncate max-w-full">
                        {m.teamB.name}
                      </span>
                      {m.teamB.score !== undefined && (
                        <span className="font-display text-2xl font-bold text-gray-300 mt-1">
                          {m.teamB.score} PTS
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer Action / Info */}
                  <div className="pt-3 border-t border-white/5">
                    {isLive && (
                      <button
                        onClick={() => onWatchMatch(m)}
                        className="w-full py-2.5 rounded font-heading text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.35)] transition-all"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>WATCH MATCH LIVE</span>
                      </button>
                    )}

                    {isUpcoming && (
                      <div className="flex items-center justify-between bg-black/40 rounded p-2 text-xs">
                        <span className="text-gray-400 font-heading uppercase">STARTS IN:</span>
                        <span className="font-mono text-[#FFBE32] font-bold tracking-widest">
                          02 : 14 : 35
                        </span>
                      </div>
                    )}

                    {m.status === "RESULT" && (
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center gap-1 text-[#FFBE32]">
                          <Trophy className="h-3.5 w-3.5" />
                          <span>Winner: <strong className="text-white">{m.winner}</strong></span>
                        </span>
                        <button
                          onClick={() => onWatchMatch(m)}
                          className="text-gray-300 hover:text-[#FFBE32] font-heading uppercase tracking-wider cursor-pointer"
                        >
                          Recap &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
