import { motion } from "framer-motion";
import { useMouseParallax } from "../hooks/useMouseParallax";
import { GoldButton } from "../components/common/GoldButton";
import { OutlineButton } from "../components/common/OutlineButton";
import { TemplePattern } from "../components/common/TemplePattern";
import logoImg from "../assets/lordz-logo.png";
import jerseyPromoImg from "../assets/jersey-promo.jpg";
import { Trophy, ChevronDown, Sparkles } from "lucide-react";

interface HeroSectionProps {
  onExploreTournaments: () => void;
  onJoinLordz: () => void;
}

export const HeroSection = ({
  onExploreTournaments,
  onJoinLordz,
}: HeroSectionProps) => {
  // Desktop mouse parallax coordinates
  const parallax = useMouseParallax(12);

  return (
    <section
      id="home"
      className="relative min-h-[92vh] sm:min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505] pt-24 pb-16"
    >
      {/* 1. Atmospheric Ambient Gradients & Particle Line Art */}
      <div className="absolute inset-0 bg-esports-grid opacity-30 pointer-events-none" />

      {/* Subtle Temple Gopuram Architectural Lines */}
      <TemplePattern className="opacity-[0.06] scale-125 translate-y-10" />

      {/* Subtle Floating Gold Light Blobs */}
      <motion.div
        animate={{
          x: parallax.x * -1.5,
          y: parallax.y * -1.5,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] sm:h-[600px] sm:w-[600px] rounded-full bg-[#FFBE32]/10 blur-[130px] pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[75vh]">
          
          {/* LEFT: Cinematic Copy & Branding (lg:col-span-7) */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start pt-4">
            
            {/* Top Badge with Logo */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[#FFBE32]/35 bg-[#FFBE32]/10 backdrop-blur-md mb-6"
            >
              <img
                src={logoImg}
                alt="Lordz LE"
                className="h-4 w-4 object-contain drop-shadow-[0_0_8px_#FFBE32]"
              />
              <span className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-[#FFBE32]">
                RISE WITH LORDZ
              </span>
              <span className="h-1 w-1 rounded-full bg-white/40" />
              <span className="font-heading text-[11px] text-gray-300 tracking-widest">
                OFFICIAL PLATFORM
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[4.5rem] xl:text-[5.2rem] leading-[1.06] uppercase tracking-tight text-white font-extrabold"
            >
              FORGE YOUR <br />
              <span className="text-gold-gradient">LEGACY.</span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-6 text-base sm:text-lg md:text-xl text-[#9CA3AF] font-body max-w-lg leading-relaxed"
            >
              Compete. Improve. Build your name. Join India's elite competitive esports network for daily scrims, championship tournaments, and legacy recognition.
            </motion.p>

            {/* Quick Micro-Highlight Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs font-heading font-semibold text-gray-300 tracking-wider"
            >
              <div className="flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-[#FFBE32]" />
                <span>₹5,00,000+ TOTAL PRIZE POOL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#FFBE32]" />
                <span>FREE FIRE MAX • BGMI • VALORANT</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <GoldButton
                onClick={onExploreTournaments}
                size="lg"
                className="w-full sm:w-auto"
              >
                EXPLORE TOURNAMENTS
              </GoldButton>
              <OutlineButton
                onClick={onJoinLordz}
                size="lg"
                className="w-full sm:w-auto"
                showArrow
              >
                JOIN LORDZ
              </OutlineButton>
            </motion.div>
          </div>

          {/* RIGHT: Uploaded Lordz Jersey Cinematic Presentation (lg:col-span-5) */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            
            {/* Ambient Gold Radial Halo */}
            <div className="absolute h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-[#FFBE32]/15 blur-[90px] pointer-events-none" />

            {/* Interactive Floating Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                x: parallax.x,
                y: parallax.y,
              }}
              className="relative w-full max-w-[420px] rounded-2xl border border-[#FFBE32]/35 bg-gradient-to-b from-[#141416]/90 to-[#070708]/90 p-3 sm:p-4 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(255,190,50,0.18)] overflow-hidden group"
            >
              {/* Subtle Gold Light Sweep Over Card */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                <div className="absolute -inset-full w-[200%] h-full bg-gradient-to-r from-transparent via-[#FFBE32]/10 to-transparent transform rotate-25 animate-sweep" />
              </div>

              {/* Tag / Badge Top */}
              <div className="flex items-center justify-between px-2 py-1 mb-2">
                <span className="font-heading text-[11px] font-bold tracking-[0.2em] text-[#FFBE32] uppercase">
                  TEAM COMBAT APPAREL
                </span>
                <span className="font-mono text-[10px] text-gray-400">
                  EDITION 2026-27
                </span>
              </div>

              {/* Uploaded Jersey Promo Image */}
              <div className="relative rounded-xl overflow-hidden bg-black/80 aspect-[4/5] flex items-center justify-center">
                <motion.img
                  src={jerseyPromoImg}
                  alt="Lordz Esports Official Jersey"
                  className="w-full h-full object-cover object-center filter brightness-105 contrast-105 transition-transform duration-700 ease-out group-hover:scale-105"
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Subtle Inner Glow on Hover */}
                <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-[#FFBE32]/20 rounded-xl group-hover:ring-[#FFBE32]/50 transition-all duration-300" />
              </div>

              {/* Bottom Specs Bar */}
              <div className="mt-3 px-2 flex items-center justify-between text-xs">
                <div>
                  <div className="font-display text-sm tracking-wider uppercase text-white">
                    BLACK • GOLD • LORDZ
                  </div>
                  <div className="text-[10px] text-gray-400 font-body">
                    Tamil temple gopuram & flame accents
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-heading text-xs font-bold text-[#FFBE32] tracking-wider">
                    PRO ATTIRE
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Down Indicator */}
      <a
        href="#live-status"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400 hover:text-[#FFBE32] transition-colors z-20 group"
      >
        <span className="font-heading text-[10px] tracking-[0.25em] uppercase text-gray-500 group-hover:text-[#FFBE32]">
          SCROLL
        </span>
        <ChevronDown className="h-4 w-4 animate-bounce text-[#FFBE32]" />
      </a>
    </section>
  );
};
