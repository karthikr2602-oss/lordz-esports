import { motion } from "framer-motion";
import { SectionHeading } from "../components/common/SectionHeading";
import { playersData } from "../data/players";
import jerseyBackImg from "../assets/jersey-back.jpg";
import logoImg from "../assets/lordz-logo.png";
import { Crosshair, Shield, Zap, Target } from "lucide-react";

export const PlayersSection = () => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "IGL":
        return <Shield className="h-4 w-4 text-[#FFBE32]" />;
      case "RUSHER":
        return <Zap className="h-4 w-4 text-[#FFBE32]" />;
      case "SNIPER":
        return <Crosshair className="h-4 w-4 text-[#FFBE32]" />;
      default:
        return <Target className="h-4 w-4 text-[#FFBE32]" />;
    }
  };

  return (
    <section id="players" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#050505] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-[#FFBE32]/6 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <SectionHeading
          badge="PRO ROSTER"
          title="MEET THE PLAYERS"
          subtitle="The championship athletes representing Lordz Esports across premier national mobile stages."
        />

        {/* Players Sports Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {playersData.map((player, index) => {
            const isBeast = player.ign === "BEAST";

            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#141418] via-[#0C0C0E] to-[#070709] border border-white/10 hover:border-[#FFBE32]/70 p-4 sm:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_45px_rgba(255,190,50,0.2)] transition-all duration-300 overflow-hidden"
              >
                {/* Top Chamfer Cut & Gold Strip */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFBE32] to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

                {/* Card Header */}
                <div className="flex items-center justify-between z-10 mb-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-black/70 border border-white/10 text-[10px] font-heading font-bold uppercase tracking-wider text-gray-300">
                    {getRoleIcon(player.role)}
                    <span>{player.role}</span>
                  </div>

                  {/* Indian Flag & Jersey Number */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs" title="India">🇮🇳</span>
                    <span className="font-mono font-bold text-sm text-[#FFBE32]">
                      #{player.jerseyNumber}
                    </span>
                  </div>
                </div>

                {/* Athlete Visual Anchor */}
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-black/60 border border-white/5 flex items-center justify-center mb-4 group-hover:border-[#FFBE32]/30 transition-all">
                  {isBeast ? (
                    // Real uploaded jersey back showing BEAST 00!
                    <div className="relative h-full w-full">
                      <img
                        src={jerseyBackImg}
                        alt="Beast 00 Lordz Jersey"
                        className="h-full w-full object-cover object-top filter contrast-110 transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                        <span className="font-heading text-[10px] font-bold text-black bg-[#FFBE32] px-2 py-0.5 rounded uppercase tracking-wider">
                          CAPTAIN / IGL
                        </span>
                        <img src={logoImg} alt="Lordz" className="h-5 w-5 object-contain" />
                      </div>
                    </div>
                  ) : (
                    // Graphic athlete card presentation
                    <div className="relative h-full w-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-neutral-900 to-black">
                      <div className="absolute inset-0 bg-esports-grid opacity-20" />
                      <div className="h-20 w-20 rounded-full bg-black/80 border border-[#FFBE32]/30 flex items-center justify-center text-[#FFBE32] mb-3 shadow-[0_0_20px_rgba(255,190,50,0.15)] group-hover:scale-110 transition-transform">
                        <span className="font-display text-3xl font-bold">{player.ign.slice(0, 2)}</span>
                      </div>
                      <span className="font-heading text-xs text-gray-400 font-bold uppercase tracking-wider">
                        {player.team}
                      </span>
                      <span className="font-display text-4xl text-white font-extrabold uppercase tracking-wider mt-1">
                        #{player.jerseyNumber}
                      </span>
                    </div>
                  )}
                </div>

                {/* Player Typography */}
                <div className="z-10">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-3xl uppercase tracking-wider text-white group-hover:text-[#FFBE32] transition-colors leading-none">
                      {player.ign}
                    </h3>
                  </div>
                  <div className="text-xs text-[#9CA3AF] font-body mt-0.5">
                    {player.realName} • <span className="text-gray-300 font-semibold">{player.game}</span>
                  </div>

                  {/* Player Stats Grid */}
                  <div className="mt-4 grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-black/60 border border-white/5 text-center font-mono">
                    <div>
                      <span className="block text-sm font-bold text-[#FFBE32]">{player.kdRatio}</span>
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 font-heading">K/D Ratio</span>
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-white">{player.headshotRate}</span>
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 font-heading">Headshot %</span>
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="mt-3 text-[11px] text-gray-400 font-body italic line-clamp-1">
                    "{player.featuredQuote}"
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
