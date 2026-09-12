import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "../components/common/SectionHeading";
import { flameOfGloryStandings } from "../data/standings";
import { Trophy, Flame, Crown, Shield } from "lucide-react";
import logoImg from "../assets/lordz-logo.png";

interface FlameOfGlorySectionProps {
  onOpenJoin: () => void;
  showHeader?: boolean;
}

export const FlameOfGlorySection = ({
  onOpenJoin,
  showHeader = true,
}: FlameOfGlorySectionProps) => {
  const [showAllRows, setShowAllRows] = useState(false);
  const displayedRows = showAllRows ? flameOfGloryStandings : flameOfGloryStandings.slice(0, 7);

  return (
    <section
      id="flame-of-glory"
      className={`relative ${showHeader ? "py-24" : "py-12 sm:py-16"} px-4 sm:px-6 lg:px-8 bg-[#070709] overflow-hidden`}
    >
      {/* Subtle Championship Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#FFBE32]/8 blur-[160px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto z-10">
        {showHeader && (
          <SectionHeading
            badge="SEASON CHAMPIONSHIP"
            title="FLAME OF GLORY"
            subtitle="OVERALL STANDINGS • OFFICIAL BROADCAST LEADERBOARD"
          />
        )}

        {/* Outer Championship Frame with Gold Trim */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl border-2 border-[#FFBE32]/40 bg-[#0C0C0F] p-4 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(255,190,50,0.12)] overflow-hidden"
        >
          {/* Top Championship Header Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#FFBE32]/25">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFBE32]/15 border border-[#FFBE32]/40 text-[#FFBE32]">
                <Flame className="h-6 w-6 fill-current animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-xs font-bold tracking-[0.2em] text-[#FFBE32] uppercase">
                    MGM : TEAM BROTHERS PRESENTS
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-white">
                  GRAND FINALS LEADERBOARD
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-xs">
              <span className="px-3 py-1 rounded bg-black/60 border border-white/10 text-gray-300 font-mono">
                MATCHES: <strong className="text-white">02 / 06</strong>
              </span>
              <span className="px-3 py-1 rounded bg-red-950/80 border border-red-500/40 text-red-400 font-heading font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                LIVE SYNC
              </span>
            </div>
          </div>

          {/* Table Container */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-heading">
              <thead>
                <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.18em] text-gray-400">
                  <th className="py-3 px-3 w-14">#</th>
                  <th className="py-3 px-4">TEAM NAME</th>
                  <th className="py-3 px-3 text-center" title="Winner / Chicken Dinners">
                    <span className="inline-flex items-center gap-1">
                      <Crown className="h-3.5 w-3.5 text-[#FFBE32]" />
                      <span className="hidden sm:inline">WWCD</span>
                    </span>
                  </th>
                  <th className="py-3 px-3 text-center">MATCHES</th>
                  <th className="py-3 px-3 text-center">POS PTS</th>
                  <th className="py-3 px-3 text-center">FINISHES</th>
                  <th className="py-3 px-4 text-right text-[#FFBE32] font-bold">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {displayedRows.map((row, index) => {
                  const isFirst = row.rank === "01";
                  const isSecond = row.rank === "02";
                  const isThird = row.rank === "03";
                  const isLordz = row.team.includes("LORD");

                  return (
                    <motion.tr
                      key={row.rank}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      className={`group transition-colors ${
                        isLordz
                          ? "bg-[#FFBE32]/10 border-l-4 border-l-[#FFBE32]"
                          : isFirst
                          ? "bg-[#FFBE32]/5 hover:bg-[#FFBE32]/10"
                          : "hover:bg-white/[0.03]"
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3.5 px-3 font-mono font-bold text-sm">
                        <div className="flex items-center gap-1.5">
                          {isFirst && <Crown className="h-4 w-4 text-[#FFBE32]" />}
                          {isSecond && <Trophy className="h-3.5 w-3.5 text-gray-300" />}
                          {isThird && <Trophy className="h-3.5 w-3.5 text-amber-600" />}
                          <span
                            className={
                              isFirst
                                ? "text-[#FFBE32] font-bold"
                                : isLordz
                                ? "text-[#FFBE32]"
                                : "text-gray-400"
                            }
                          >
                            {row.rank}
                          </span>
                        </div>
                      </td>

                      {/* Team */}
                      <td className="py-3.5 px-4 font-bold tracking-wider">
                        <div className="flex items-center gap-2.5">
                          {isLordz ? (
                            <img
                              src={logoImg}
                              alt="Lordz"
                              className="h-5 w-5 object-contain drop-shadow-[0_0_6px_#FFBE32]"
                            />
                          ) : (
                            <div className="h-5 w-5 rounded bg-white/10 flex items-center justify-center text-[9px] font-mono text-gray-400">
                              <Shield className="h-3 w-3 text-gray-500" />
                            </div>
                          )}
                          <span
                            className={
                              isLordz
                                ? "text-[#FFBE32] font-display text-lg tracking-wider"
                                : "text-white group-hover:text-[#FFBE32] transition-colors"
                            }
                          >
                            {row.team}
                          </span>
                          {isLordz && (
                            <span className="rounded bg-[#FFBE32] text-black px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider">
                              HOST
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Chicken Dinner / WWCD */}
                      <td className="py-3.5 px-3 text-center font-mono">
                        {row.chickenDinner !== "00" ? (
                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#FFBE32]/20 text-[#FFBE32] font-bold text-xs">
                            {row.chickenDinner}
                          </span>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>

                      {/* Matches */}
                      <td className="py-3.5 px-3 text-center font-mono text-gray-400">
                        {row.matches}
                      </td>

                      {/* Position Points */}
                      <td className="py-3.5 px-3 text-center font-mono text-gray-300">
                        {row.position}
                      </td>

                      {/* Finishes */}
                      <td className="py-3.5 px-3 text-center font-mono text-gray-300 font-semibold">
                        {row.finishes}
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 text-right font-display text-xl sm:text-2xl font-bold tracking-wider">
                        <span
                          className={
                            isFirst
                              ? "text-[#FFBE32] drop-shadow-[0_0_10px_rgba(255,190,50,0.5)]"
                              : isLordz
                              ? "text-[#FFBE32]"
                              : "text-white"
                          }
                        >
                          {row.total}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Action */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setShowAllRows(!showAllRows)}
              className="inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-widest text-[#FFBE32] hover:text-[#FFCD59] cursor-pointer transition-colors"
            >
              <span>{showAllRows ? "SHOW TOP 7 STANDINGS" : "VIEW FULL STANDINGS (10 TEAMS) →"}</span>
            </button>

            <button
              onClick={onOpenJoin}
              className="px-4 py-2 rounded font-heading text-xs font-bold uppercase tracking-wider bg-[#FFBE32]/10 hover:bg-[#FFBE32] text-[#FFBE32] hover:text-black border border-[#FFBE32]/40 transition-all cursor-pointer"
            >
              REGISTER SQUAD FOR NEXT QUALIFIER
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
