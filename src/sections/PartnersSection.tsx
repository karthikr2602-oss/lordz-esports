import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Handshake,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { partnersApi } from "../api/partners";

// Default / fallback clean logo assets
import logoCleanEsportsPro from "../assets/logo-esportspro-clean.svg";
import logoCleanEspotzLive from "../assets/logo-espotz-clean.svg";
import logoCleanInfinix from "../assets/logo-infinix-clean.svg";
import logoCleanFreeFireMax from "../assets/logo-freefire-clean.svg";
import logoCleanFusionCrystals from "../assets/logo-fusion-clean.svg";
import logoCleanEsportsWorldCup from "../assets/logo-ewc-clean.svg";

import cardEsportsPro from "../assets/card_esports_pro.png";
import cardEspotzLive from "../assets/card_espotz_live.png";
import cardInfinix from "../assets/card_infinix.png";
import cardFreeFireMax from "../assets/card_free_fire_max.png";
import cardFusionCrystals from "../assets/card_fusion_crystals.png";
import cardEsportsWorldCup from "../assets/card_esports_world_cup.png";

export interface PartnerItem {
  id: string;
  name: string;
  category?: string;
  tier?: string;
  logoImage?: string | null;
  cardImage?: string | null;
  websiteUrl?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

const defaultFallbackLogos: Record<string, string> = {
  "esports-pro": logoCleanEsportsPro,
  "espotz-live": logoCleanEspotzLive,
  "infinix": logoCleanInfinix,
  "free-fire-max": logoCleanFreeFireMax,
  "fusion-crystals": logoCleanFusionCrystals,
  "esports-world-cup": logoCleanEsportsWorldCup,
};

const defaultFallbackCards: Record<string, string> = {
  "esports-pro": cardEsportsPro,
  "espotz-live": cardEspotzLive,
  "infinix": cardInfinix,
  "free-fire-max": cardFreeFireMax,
  "fusion-crystals": cardFusionCrystals,
  "esports-world-cup": cardEsportsWorldCup,
};

export const defaultPartners: PartnerItem[] = [
  {
    id: "esports-pro",
    name: "ESPORTS PRO",
    category: "Tournament Platform",
    logoImage: logoCleanEsportsPro,
    cardImage: cardEsportsPro,
    websiteUrl: "https://esportspro.gg",
  },
  {
    id: "espotz-live",
    name: "ESPOTZ LIVE",
    category: "Livestream Production",
    logoImage: logoCleanEspotzLive,
    cardImage: cardEspotzLive,
    websiteUrl: "https://espotz.live",
  },
  {
    id: "infinix",
    name: "INFINIX",
    category: "Official Gaming Smartphone",
    logoImage: logoCleanInfinix,
    cardImage: cardInfinix,
    websiteUrl: "https://infinixmobility.com",
  },
  {
    id: "free-fire-max",
    name: "FREE FIRE MAX",
    category: "Official Battle Royale Title",
    logoImage: logoCleanFreeFireMax,
    cardImage: cardFreeFireMax,
    websiteUrl: "https://ff.garena.com",
  },
  {
    id: "fusion-crystals",
    name: "FUSION CRYSTALS",
    category: "Energy & Performance",
    logoImage: logoCleanFusionCrystals,
    cardImage: cardFusionCrystals,
    websiteUrl: "https://fusioncrystals.gg",
  },
  {
    id: "esports-world-cup",
    name: "ESPORTS WORLD CUP",
    category: "Global Competitive Circuit",
    logoImage: logoCleanEsportsWorldCup,
    cardImage: cardEsportsWorldCup,
    websiteUrl: "https://esportsworldcup.com",
  },
];

interface PartnersSectionProps {
  onPartnerWithUs: () => void;
  showHeader?: boolean;
  partners?: PartnerItem[];
}

export const PartnersSection = ({
  onPartnerWithUs,
  showHeader = true,
  partners: initialPartners,
}: PartnersSectionProps) => {
  const [partnerList, setPartnerList] = useState<PartnerItem[]>(initialPartners || defaultPartners);

  useEffect(() => {
    if (!initialPartners) {
      partnersApi
        .getAll()
        .then((data) => {
          if (data && data.length > 0) {
            // Map live items, prioritizing uploaded logos over static fallbacks
            const merged = data.map((d) => ({
              ...d,
              logoImage: d.logoImage || defaultFallbackLogos[d.id] || null,
              cardImage: d.cardImage || defaultFallbackCards[d.id] || null,
            }));
            setPartnerList(merged);
          }
        })
        .catch(() => {
          setPartnerList(defaultPartners);
        });
    }
  }, [initialPartners]);

  // Resolve logo helper - prioritizes database uploaded logo first
  const resolveLogo = (partner: PartnerItem): string | null => {
    return partner.logoImage || defaultFallbackLogos[partner.id] || null;
  };

  // Duplicate partner list for seamless infinite loop marquee
  const marqueeList = [...partnerList, ...partnerList];

  return (
    <section
      id="partners"
      className="relative py-24 sm:py-28 bg-[#050505] border-t border-white/5 overflow-hidden"
    >
      {/* Dynamic Background Atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-radial from-[#FFBE32]/8 via-transparent to-transparent blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-amber-600/5 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-purple-600/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading & Overview */}
        {showHeader && (
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              {/* Tag pill with animated dot */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#FFBE32]/10 border border-[#FFBE32]/30 mb-5">
                <span className="w-2 h-2 rounded-full bg-[#FFBE32] animate-ping" />
                <span className="font-heading text-xs font-bold tracking-[0.22em] text-[#FFBE32] uppercase">
                  PARTNERSHIPS &amp; BRAND ALLIANCES
                </span>
              </div>

              {/* Main Section Heading */}
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-wide text-white leading-[1.12]">
                Associative Games &amp; <br />
                <span className="text-gold-gradient">Event Partners</span>
              </h2>

              <p className="mt-4 text-sm sm:text-base text-gray-400 font-body leading-relaxed max-w-xl">
                Collaborating with global brands to empower the esports community.
              </p>
            </motion.div>

            {/* CTA action */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-4 shrink-0"
            >
              <button
                onClick={onPartnerWithUs}
                className="inline-flex items-center gap-2.5 font-heading text-xs font-bold uppercase tracking-widest text-[#050505] bg-[#FFBE32] hover:bg-[#FFA000] py-3.5 px-7 rounded-xl transition-all duration-200 cursor-pointer shadow-[0_0_25px_rgba(255,190,50,0.35)] hover:shadow-[0_0_35px_rgba(255,190,50,0.5)] group"
              >
                <Handshake className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>PARTNER WITH US →</span>
              </button>
            </motion.div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. CONTINUOUS MOVING LOGO MARQUEE (INFINITE CINEMATIC STREAM) */}
        {/* ========================================================================= */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-5 px-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#FFBE32]" />
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-gray-300">
                OFFICIAL BRAND SHOWCASE • CONTINUOUS STREAM
              </span>
            </div>
            <span className="text-[11px] font-mono text-gray-500 uppercase">Hover to pause</span>
          </div>

          {/* Marquee Track: Seamless Infinite Stream without Background Rectangles */}
          <div className="relative w-full overflow-hidden py-8">
            {/* Edge Shadow Gradients for smooth fade in/out on dark page background */}
            <div className="absolute inset-y-0 left-0 w-24 sm:w-44 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 sm:w-44 bg-gradient-to-l from-[#050505] via-[#050505]/90 to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee-smooth flex items-center gap-8 sm:gap-14">
              {marqueeList.map((partner, idx) => {
                const logo = resolveLogo(partner);

                return (
                  <div
                    key={`${partner.id}-mq1-${idx}`}
                    onClick={() => partner.websiteUrl && window.open(partner.websiteUrl, "_blank")}
                    title={partner.name}
                    className="relative group shrink-0 h-20 sm:h-24 w-44 sm:w-56 flex items-center justify-center cursor-pointer px-4 transition-transform duration-300 hover:scale-110"
                  >
                    {/* Brand Logo Only - Pure Floating Transparent Logo */}
                    {logo ? (
                      <img
                        src={logo}
                        alt={partner.name}
                        loading="lazy"
                        decoding="async"
                        className="max-h-14 sm:max-h-16 max-w-full object-contain filter opacity-75 group-hover:opacity-100 group-hover:drop-shadow-[0_0_20px_rgba(255,190,50,0.45)] transition-all duration-300"
                      />
                    ) : (
                      <span className="font-heading text-base font-bold text-white/80 group-hover:text-white tracking-wider text-center transition-colors">
                        {partner.name}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>



        {/* Bottom Banner Stats Strip */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-[#0C0C10] via-[#111116] to-[#0C0C10] border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-[#FFBE32]/10 border border-[#FFBE32]/30 flex items-center justify-center shrink-0">
              <Handshake className="h-6 w-6 text-[#FFBE32]" />
            </div>
            <div>
              <h4 className="font-display text-lg uppercase tracking-wider text-white">
                Want to Sponsor Lord Esports Tournaments?
              </h4>
              <p className="text-xs text-gray-400 font-body mt-0.5">
                Reach over 500,000+ passionate competitive battle royale esports fans across YouTube &amp; Discord.
              </p>
            </div>
          </div>

          <button
            onClick={onPartnerWithUs}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFBE32] hover:bg-[#FFA000] text-black font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(255,190,50,0.3)] shrink-0"
          >
            <span>Request Brand Dossier</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
