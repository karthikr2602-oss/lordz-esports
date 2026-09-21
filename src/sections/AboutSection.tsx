import { motion } from "framer-motion";
import { TemplePattern } from "../components/common/TemplePattern";
import logoImg from "../assets/lordz-logo.png";
import aboutTeamImg from "../assets/about-team.jpg";
import { Trophy, Shield, Users, ArrowRight, Sparkles, Award } from "lucide-react";
import { Link } from "react-router-dom";

interface AboutSectionProps {
  showHeader?: boolean;
}

export const AboutSection = ({ showHeader = true }: AboutSectionProps) => {
  const manifesto = [
    { text: "WE DON'T JUST PLAY.", gold: false },
    { text: "WE COMPETE.", gold: true },
    { text: "WE BUILD LEGACY.", gold: false },
  ];

  const stats = [
    { label: "NATIONAL TITLES", value: "04", icon: Trophy },
    { label: "PRIZE PURSE WON", value: "₹15L+", icon: Award },
    { label: "CLAN COMMUNITY", value: "50K+", icon: Users },
    { label: "TIER-1 WIN RATE", value: "92%", icon: Shield },
  ];

  return (
    <section
      id="about"
      className={`relative ${showHeader ? "py-28" : "py-14 sm:py-16"} px-4 sm:px-6 lg:px-8 bg-[#070709] border-t border-white/5 overflow-hidden`}
    >
      {/* Background Architectural Gopuram Pattern */}
      <TemplePattern className="opacity-[0.04] scale-150" />

      {/* Atmospheric center gold & cyan glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FFBE32]/8 blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10">
        {showHeader && (
          <div className="text-center max-w-3xl mx-auto mb-16">
            {/* Crest Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center"
            >
              <img
                src={logoImg}
                alt="Lord LE"
                className="h-full w-full object-contain drop-shadow-[0_0_20px_rgba(255,190,50,0.35)]"
              />
            </motion.div>

            {/* Section Pre-title */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFBE32]/10 border border-[#FFBE32]/30 text-xs font-heading font-bold uppercase tracking-[0.25em] text-[#FFBE32] mb-3"
            >
              <Sparkles className="h-3 w-3 text-[#FFBE32]" />
              <span>ORGANIZATION MANIFESTO</span>
            </motion.div>

            <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-wider text-white">
              ABOUT <span className="text-gold-gradient">LORD ESPORTS</span>
            </h2>
          </div>
        )}

        {/* Two-Column Showcase: Team Image on Left, Manifesto & Story on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* LEFT: Champion Team Image Presentation (lg:col-span-6) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            {/* Ambient Backlight */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#FFBE32]/15 via-transparent to-cyan-500/10 blur-2xl pointer-events-none" />

            <div className="relative rounded-2xl overflow-hidden border border-[#FFBE32]/35 bg-black/60 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(255,190,50,0.15)] group">
              {/* Image */}
              <div className="aspect-[4/3] w-full overflow-hidden relative">
                <motion.img
                  src={aboutTeamImg}
                  alt="Lord Esports Champions on Stage with Trophy"
                  className="w-full h-full object-cover object-center filter brightness-[1.02] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/75 border border-[#FFBE32]/40 backdrop-blur-md">
                  <Trophy className="h-3.5 w-3.5 text-[#FFBE32]" />
                  <span className="font-heading text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#FFBE32]">
                    NATIONAL CHAMPION ROSTER
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-left">
                  <div>
                    <span className="font-display text-lg sm:text-xl uppercase tracking-wider text-white">
                      BHARAT ESPORTS STAGE
                    </span>
                    <p className="text-[11px] text-gray-300 font-body">
                      Grand Finals Victory • Chennai HQ
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[#FFBE32] bg-black/80 px-2.5 py-1 rounded border border-[#FFBE32]/30">
                    EST. 2024
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Typography, Story & Stats (lg:col-span-6) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-center text-left"
          >
            {/* Manifesto Typography */}
            <div className="space-y-1 sm:space-y-2">
              {manifesto.map((item) => (
                <div
                  key={item.text}
                  className={`font-display text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight font-extrabold ${
                    item.gold ? "text-gold-gradient" : "text-white"
                  }`}
                >
                  {item.text}
                </div>
              ))}
            </div>

            {/* Story Paragraph */}
            <p className="mt-6 text-sm sm:text-base text-gray-300 font-body leading-relaxed">
              Born from the intense competitive pulse of Indian gaming, <strong className="text-white font-semibold">Lord Esports</strong> is an organization founded on discipline, raw skill, and cultural pride. From grassroots mobile scrims to national championship arenas, we elevate aspiring athletes into champions.
            </p>

            <p className="mt-3 text-xs sm:text-sm text-gray-400 font-body leading-relaxed">
              Rooted in the fierce legacy of South India and competing nationwide in Free Fire and Free Fire MAX, our squads combine tactical precision with unstoppable clutch instinct.
            </p>

            {/* Micro Stats Grid */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((s) => {
                const IconComponent = s.icon;
                return (
                  <div
                    key={s.label}
                    className="p-3 rounded-xl bg-[#0B0B0E] border border-white/5 flex flex-col justify-between"
                  >
                    <IconComponent className="h-4 w-4 text-[#FFBE32] mb-2" />
                    <span className="font-display text-xl sm:text-2xl font-bold text-white">
                      {s.value}
                    </span>
                    <span className="text-[9px] font-heading font-bold uppercase tracking-wider text-gray-500 mt-1">
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Action Links */}
            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/players"
                className="inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-wider bg-[#FFBE32] text-black hover:bg-[#FFCD59] py-2.5 px-5 rounded-lg transition-all shadow-[0_0_20px_rgba(255,190,50,0.2)]"
              >
                <span>MEET THE ATHLETES</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#FFBE32] py-2.5 px-3 transition-colors"
              >
                <span>READ FULL MANIFESTO</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
