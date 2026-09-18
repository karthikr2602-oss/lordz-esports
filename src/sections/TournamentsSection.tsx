import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "../components/common/SectionHeading";
import { tournamentsData, type Tournament } from "../data/tournaments";
import { tournamentsApi } from "../api/tournaments";
import { Trophy, Calendar, Users, Shield, ArrowRight } from "lucide-react";

interface TournamentsSectionProps {
  onSelectTournament: (tournament: Tournament) => void;
  showHeader?: boolean;
}

type GameFilter = "ALL" | "FREE FIRE" | "FREE FIRE MAX" | "BGMI" | "VALORANT" | "OTHER";
type StatusFilter = "ALL" | "LIVE" | "UPCOMING" | "COMPLETED";

export const TournamentsSection = ({
  onSelectTournament,
  showHeader = true,
}: TournamentsSectionProps) => {
  const [tournaments, setTournaments] = useState<Tournament[]>(tournamentsData);
  const [selectedGame, setSelectedGame] = useState<GameFilter>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("ALL");

  useEffect(() => {
    tournamentsApi
      .getAll()
      .then((data) => {
        if (data && data.length > 0) setTournaments(data);
      })
      .catch(() => {});
  }, []);

  const gameFilters: GameFilter[] = [
    "ALL",
    "FREE FIRE",
    "FREE FIRE MAX",
    "BGMI",
    "VALORANT",
    "OTHER",
  ];

  const statusFilters: { label: string; value: StatusFilter }[] = [
    { label: "ALL STATUS", value: "ALL" },
    { label: "LIVE", value: "LIVE" },
    { label: "UPCOMING", value: "UPCOMING" },
    { label: "COMPLETED", value: "COMPLETED" },
  ];

  const filteredTournaments = useMemo(() => {
    return tournaments.filter((t) => {
      const matchGame = selectedGame === "ALL" || t.gameCategory === selectedGame;
      const matchStatus = selectedStatus === "ALL" || t.status === selectedStatus;
      return matchGame && matchStatus;
    });
  }, [tournaments, selectedGame, selectedStatus]);

  return (
    <section
      id="tournaments"
      className={`relative ${showHeader ? "py-24" : "py-12 sm:py-16"} px-4 sm:px-6 lg:px-8 bg-[#050505]`}
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#FFBE32]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {showHeader && (
          <SectionHeading
            badge="COMPETITIVE BRACKETS"
            title="ENTER THE ARENA"
            subtitle="Your next match starts here. Register your roster, compete for verified cash pools, and earn national circuit ranking."
          />
        )}

        {/* Filters Bar */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
          {/* Game category tabs */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
            {gameFilters.map((game) => (
              <button
                key={game}
                onClick={() => setSelectedGame(game)}
                className={`px-3 sm:px-4 py-1.5 text-xs font-heading font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                  selectedGame === game
                    ? "bg-[#FFBE32] text-black shadow-[0_0_15px_rgba(255,190,50,0.3)]"
                    : "bg-[#111113] text-gray-400 hover:text-white hover:bg-[#1A1A1D] border border-white/5"
                }`}
              >
                {game}
              </button>
            ))}
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1 bg-[#0D0D10] p-1 rounded-lg border border-white/10">
            {statusFilters.map((sf) => (
              <button
                key={sf.value}
                onClick={() => setSelectedStatus(sf.value)}
                className={`px-3 py-1 text-[11px] font-heading font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                  selectedStatus === sf.value
                    ? "bg-white/15 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {sf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tournament Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTournaments.length > 0 ? (
              filteredTournaments.map((t, index) => {
                const isLive = t.status === "LIVE";
                const isUpcoming = t.status === "UPCOMING";

                return (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative flex flex-col justify-between rounded-xl bg-[#0C0C0E] border border-white/10 hover:border-[#FFBE32]/60 hover:-translate-y-1.5 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_35px_rgba(255,190,50,0.15)] overflow-hidden"
                  >
                    {/* Top Accent Line */}
                    <div
                      className={`h-[3px] w-full ${
                        isLive
                          ? "bg-red-500 shadow-[0_0_10px_red]"
                          : isUpcoming
                          ? "bg-[#FFBE32]"
                          : "bg-gray-600"
                      }`}
                    />

                    <div className="p-6">
                      {/* Status and Game Header */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-heading font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-gray-300">
                          <Shield className="h-3 w-3 text-[#FFBE32]" />
                          {t.game}
                        </span>

                        <span
                          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-heading font-bold uppercase tracking-wider ${
                            isLive
                              ? "bg-red-950/80 text-red-400 border border-red-500/30 animate-pulse"
                              : isUpcoming
                              ? "bg-amber-950/50 text-[#FFBE32] border border-[#FFBE32]/30"
                              : "bg-neutral-800 text-gray-400"
                          }`}
                        >
                          {isLive && <span className="h-1.5 w-1.5 rounded-full bg-red-500" />}
                          {t.status === "UPCOMING" ? "REGISTRATION OPEN" : t.status}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-2xl tracking-wide uppercase text-white group-hover:text-[#FFBE32] transition-colors leading-tight">
                        {t.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-gray-400 font-body line-clamp-2">
                        {t.tagline}
                      </p>

                      {/* Prize Pool Spotlight */}
                      <div className="mt-5 p-3 rounded-lg bg-black/50 border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-[#FFBE32]" />
                          <span className="text-xs text-gray-400 font-heading uppercase tracking-wider">
                            Prize Pool
                          </span>
                        </div>
                        <span className="font-display text-2xl font-bold text-[#FFBE32] tracking-wider">
                          {t.prizePool}
                        </span>
                      </div>

                      {/* Metadata Grid */}
                      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-gray-500" />
                          <span className="truncate">{t.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 justify-end">
                          <Users className="h-3.5 w-3.5 text-gray-500" />
                          <span>{t.slots}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Button */}
                    <div className="p-6 pt-0">
                      <button
                        onClick={() => onSelectTournament(t)}
                        className="w-full py-2.5 px-4 rounded font-heading text-xs font-bold uppercase tracking-wider bg-[#141417] hover:bg-[#FFBE32] text-[#FFBE32] hover:text-black border border-[#FFBE32]/40 hover:border-[#FFBE32] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer group-hover:shadow-[0_0_15px_rgba(255,190,50,0.2)]"
                      >
                        <span>VIEW TOURNAMENT</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-16 text-center text-gray-500">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30 text-[#FFBE32]" />
                <p className="font-heading text-base uppercase tracking-wider text-gray-400">
                  No tournaments found for this filter combination.
                </p>
                <button
                  onClick={() => {
                    setSelectedGame("ALL");
                    setSelectedStatus("ALL");
                  }}
                  className="mt-3 text-xs text-[#FFBE32] underline cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
