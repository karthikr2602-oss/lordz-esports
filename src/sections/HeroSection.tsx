import { motion } from "framer-motion";
import { useMouseParallax } from "../hooks/useMouseParallax";
import { GoldButton } from "../components/common/GoldButton";
import { OutlineButton } from "../components/common/OutlineButton";
import { TemplePattern } from "../components/common/TemplePattern";
import logoImg from "../assets/lordz-logo.png";
import freeFireStandingImg from "../assets/free-fire-standing.png";
import { Trophy, ChevronDown, Sparkles } from "lucide-react";

// Subtle floating energy particles for the Free Fire character
const characterParticles = [
  { id: 1, x: "14%", y: "24%", duration: 4.2, delay: 0 },
  { id: 2, x: "84%", y: "20%", duration: 5.1, delay: 1.2 },
  { id: 3, x: "16%", y: "60%", duration: 4.6, delay: 2.0 },
  { id: 4, x: "82%", y: "56%", duration: 5.4, delay: 0.8 },
  { id: 5, x: "22%", y: "40%", duration: 4.4, delay: 1.6 },
  { id: 6, x: "78%", y: "36%", duration: 5.0, delay: 2.6 },
  { id: 7, x: "50%", y: "10%", duration: 3.8, delay: 1.0 },
];

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

          {/* RIGHT: Freestanding Free Fire Character Showcase (lg:col-span-5) */}
          <div className="lg:col-span-5 flex justify-center items-center relative min-h-[480px] sm:min-h-[580px] lg:min-h-[660px]">
            
            {/* 1. Ambient Energy Halos (Dual Cyan & Gold Glow) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 sm:h-[460px] sm:w-[460px] rounded-full bg-gradient-to-tr from-[#FFBE32]/10 via-cyan-500/20 to-teal-400/15 blur-[120px] pointer-events-none" />

            {/* 2. Dynamic Esports Diagonal Energy Blade / Line Accent (Matching reference image) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <svg className="w-full h-full opacity-60" viewBox="0 0 500 600" fill="none">
                <defs>
                  <linearGradient id="cyberLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFBE32" stopOpacity="0" />
                    <stop offset="35%" stopColor="#FFBE32" stopOpacity="0.8" />
                    <stop offset="65%" stopColor="#22d3ee" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                  </linearGradient>
                  <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="glow" />
                    <feComposite in="SourceGraphic" in2="glow" operator="over" />
                  </filter>
                </defs>
                {/* Dynamic angled cyber beam behind character */}
                <motion.line
                  x1="30"
                  y1="200"
                  x2="480"
                  y2="520"
                  stroke="url(#cyberLineGrad)"
                  strokeWidth="3.5"
                  filter="url(#glowFilter)"
                  animate={{
                    opacity: [0.5, 0.9, 0.5],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </svg>
            </div>

            {/* 3. Freestanding Character Container with Mouse Parallax */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{
                x: parallax.x * 1.2,
                y: parallax.y * 1.2,
              }}
              className="relative flex flex-col items-center justify-end z-10 w-full h-full"
            >
              {/* Animated Energy Aura behind Character */}
              <motion.div
                animate={{
                  scale: [0.92, 1.12, 0.95, 1.08, 0.92],
                  opacity: [0.35, 0.7, 0.4, 0.75, 0.35],
                  rotate: [0, 5, -5, 2, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-cyan-500/35 via-teal-400/30 to-emerald-400/20 blur-[65px] pointer-events-none"
              />

              {/* Core Radial Flash */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.65, 0.3],
                  scale: [0.9, 1.08, 0.9],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full bg-cyan-400/25 blur-[50px] pointer-events-none"
              />

              {/* Floating Cyan Energy Particles */}
              {characterParticles.map((p) => (
                <motion.div
                  key={p.id}
                  style={{ left: p.x, top: p.y }}
                  className="absolute pointer-events-none w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee,0_0_16px_#06b6d4] z-20"
                  animate={{
                    y: [0, -22, 0],
                    x: [0, p.id % 2 === 0 ? 8 : -8, 0],
                    opacity: [0.2, 0.9, 0.2],
                    scale: [0.8, 1.3, 0.8],
                  }}
                  transition={{
                    duration: p.duration,
                    repeat: Infinity,
                    delay: p.delay,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* The Standing Character with Floating Levitation & Glow Pulse */}
              <motion.div
                className="relative z-10 flex items-end justify-center"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.img
                  src={freeFireStandingImg}
                  alt="Lordz Esports Free Fire Apex Character"
                  className="max-h-[460px] sm:max-h-[560px] lg:max-h-[640px] xl:max-h-[680px] w-auto object-contain select-none pointer-events-none filter contrast-[1.06] brightness-[1.04]"
                  animate={{
                    filter: [
                      "drop-shadow(0 0 16px rgba(6, 182, 212, 0.45)) drop-shadow(0 0 35px rgba(20, 184, 166, 0.25))",
                      "drop-shadow(0 0 28px rgba(6, 182, 212, 0.8)) drop-shadow(0 0 55px rgba(20, 184, 166, 0.5)) drop-shadow(0 0 80px rgba(34, 197, 94, 0.25))",
                      "drop-shadow(0 0 16px rgba(6, 182, 212, 0.45)) drop-shadow(0 0 35px rgba(20, 184, 166, 0.25))",
                    ],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              {/* Realistic Ground Shadow & Energy Ring Beneath Character */}
              <div className="relative w-64 sm:w-80 h-10 -mt-6 pointer-events-none z-0 flex items-center justify-center">
                {/* Dark contact shadow */}
                <div className="w-52 sm:w-64 h-5 rounded-full bg-black/85 blur-[12px]" />
                {/* Cyan ambient floor glow */}
                <div className="absolute w-60 sm:w-72 h-8 rounded-full bg-cyan-500/20 blur-[20px]" />
              </div>

              {/* Floating Esports Nameplate / Badge (Sleek minimalist Pill) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-3 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0B0C10]/90 border border-cyan-500/30 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(6,182,212,0.2)]"
              >
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-[#FFBE32]">
                  FREE FIRE
                </span>
                <span className="h-3 w-px bg-white/20" />
                <span className="font-display text-xs tracking-wider uppercase text-white font-bold">
                  APEX OPERATOR
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Down Indicator */}
      <a
        href="#jersey"
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
