import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Handshake,
  Sparkles,
  ShieldCheck,
  Radio,
  Trophy,
  ArrowUpRight
} from "lucide-react";
import { partnersApi } from "../api/partners";

// Default / fallback logo assets
import logoEsportsPro from "../assets/partner-esportspro.png";
import logoEspotzLive from "../assets/partner-espotz.png";
import logoInfinix from "../assets/partner-infinix.png";
import logoFreeFireMax from "../assets/partner-freefire.png";
import logoFusionCrystals from "../assets/partner-fusion.png";
import logoEsportsWorldCup from "../assets/partner-ewc.png";

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
  "esports-pro": logoEsportsPro,
  "espotz-live": logoEspotzLive,
  "infinix": logoInfinix,
  "free-fire-max": logoFreeFireMax,
  "fusion-crystals": logoFusionCrystals,
  "esports-world-cup": logoEsportsWorldCup,
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
    tier: "MAIN SPONSOR",
    category: "Tournament Platform",
    logoImage: logoEsportsPro,
    cardImage: cardEsportsPro,
    websiteUrl: "https://esportspro.gg",
  },
  {
    id: "espotz-live",
    name: "ESPOTZ LIVE",
    tier: "BROADCAST PARTNER",
    category: "Livestream Production",
    logoImage: logoEspotzLive,
    cardImage: cardEspotzLive,
    websiteUrl: "https://espotz.live",
  },
  {
    id: "infinix",
    name: "INFINIX",
    tier: "MAIN SPONSOR",
    category: "Official Gaming Smartphone",
    logoImage: logoInfinix,
    cardImage: cardInfinix,
    websiteUrl: "https://infinixmobility.com",
  },
  {
    id: "free-fire-max",
    name: "FREE FIRE MAX",
    tier: "OFFICIAL PARTNER",
    category: "Official Battle Royale Title",
    logoImage: logoFreeFireMax,
    cardImage: cardFreeFireMax,
    websiteUrl: "https://ff.garena.com",
  },
  {
    id: "fusion-crystals",
    name: "FUSION CRYSTALS",
    tier: "OFFICIAL PARTNER",
    category: "Energy & Performance",
    logoImage: logoFusionCrystals,
    cardImage: cardFusionCrystals,
    websiteUrl: "https://fusioncrystals.gg",
  },
  {
    id: "esports-world-cup",
    name: "ESPORTS WORLD CUP",
    tier: "OFFICIAL PARTNER",
    category: "Global Competitive Circuit",
    logoImage: logoEsportsWorldCup,
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
            // Map live items, preserving uploaded logos or falling back to high-res assets
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

  // Resolve logo helper
  const resolveLogo = (partner: PartnerItem): string | null => {
    return partner.logoImage || defaultFallbackLogos[partner.id] || null;
  };

  // Tiers badge styling
  const getTierTag = (tier?: string) => {
    switch (tier) {
      case "MAIN SPONSOR":
        return {
          label: "MAIN SPONSOR",
          classes: "bg-[#FFBE32]/10 text-[#FFBE32] border-[#FFBE32]/30 shadow-[0_0_10px_rgba(255,190,50,0.2)]",
          icon: Trophy,
        };
      case "BROADCAST PARTNER":
        return {
          label: "BROADCAST",
          classes: "bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]",
          icon: Radio,
        };
      default:
        return {
          label: "OFFICIAL PARTNER",
          classes: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]",
          icon: ShieldCheck,
        };
    }
  };

  // Duplicate partner list for seamless infinite loop marquee
  const marqueeList = [...partnerList, ...partnerList, ...partnerList];

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
                Collaborating with leading tournament platforms, gaming hardware giants, and broadcast media to power high-octane esports across India and Asia.
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
        <div className="mb-20">
          <div className="flex items-center justify-between mb-5 px-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#FFBE32]" />
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-gray-300">
                OFFICIAL BRAND SHOWCASE • CONTINUOUS STREAM
              </span>
            </div>
            <span className="text-[11px] font-mono text-gray-500 uppercase">Hover to pause</span>
          </div>

          {/* Marquee Track 1: Moving Right-to-Left */}
          <div className="relative w-full overflow-hidden py-3 rounded-2xl bg-[#0a0a0d] border border-white/5">
            {/* Edge Shadow Gradients for smooth fade in/out */}
            <div className="absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-[#0a0a0d] via-[#0a0a0d]/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-[#0a0a0d] via-[#0a0a0d]/80 to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee-left flex items-center gap-5 sm:gap-6">
              {marqueeList.map((partner, idx) => {
                const logo = resolveLogo(partner);
                const tierInfo = getTierTag(partner.tier);
                const TierIcon = tierInfo.icon;

                return (
                  <div
                    key={`${partner.id}-mq1-${idx}`}
                    className="relative group shrink-0 w-64 sm:w-72 h-28 rounded-xl bg-[#111116] hover:bg-[#16161d] border border-white/10 hover:border-[#FFBE32]/60 transition-all duration-300 flex items-center justify-between p-4 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,190,50,0.2)]"
                  >
                    {/* Brand Logo Container */}
                    <div className="w-28 h-18 rounded-lg bg-black/60 border border-white/5 flex items-center justify-center p-2.5 overflow-hidden group-hover:border-[#FFBE32]/30 transition-colors">
                      {logo ? (
                        <img
                          src={logo}
                          alt={partner.name}
                          className="max-h-12 max-w-[90%] object-contain filter group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
                        />
                      ) : (
                        <span className="font-heading text-xs font-bold text-white text-center">
                          {partner.name}
                        </span>
                      )}
                    </div>

                    {/* Partner Metadata */}
                    <div className="flex-1 pl-3.5 flex flex-col justify-center min-w-0">
                      <span className={`inline-flex items-center gap-1 self-start px-2 py-0.5 rounded text-[9px] font-heading font-bold uppercase tracking-wider mb-1 border ${tierInfo.classes}`}>
                        <TierIcon className="h-2.5 w-2.5" />
                        <span>{tierInfo.label}</span>
                      </span>
                      <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white truncate group-hover:text-[#FFBE32] transition-colors">
                        {partner.name}
                      </h4>
                      <p className="text-[11px] text-gray-400 font-body truncate mt-0.5">
                        {partner.category || "Official Partner"}
                      </p>
                    </div>

                    {/* Ambient Gold Accent */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FFBE32]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Marquee Track 2: Reverse Direction Ecosystem Ticker */}
          <div className="relative w-full overflow-hidden mt-3.5 py-2.5 rounded-xl bg-black/40 border border-white/5">
            <div className="absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-[#050505] via-[#050505]/80 to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee-right flex items-center gap-8 text-xs font-heading font-semibold uppercase tracking-widest text-gray-400">
              {marqueeList.map((partner, idx) => (
                <div key={`${partner.id}-ticker-${idx}`} className="flex items-center gap-3 shrink-0">
                  <span className="text-[#FFBE32]">★</span>
                  <span className="text-white font-bold">{partner.name}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400 text-[11px]">{partner.category || partner.tier}</span>
                </div>
              ))}
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
                Want to Sponsor Lordz Esports Tournaments?
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
