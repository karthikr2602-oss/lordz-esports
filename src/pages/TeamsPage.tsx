import { useState, useEffect } from "react";
import { collectiveMembers } from "../data/teams";
import teamPhoto from "../assets/about-team.jpg";
import {
  ArrowUpRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export const TeamsPage = () => {
  const [memberFilter, setMemberFilter] = useState<string>("all");

  useEffect(() => {
    document.title = "LORDZ ESPORTS — The People Behind The Play";
    window.scrollTo(0, 0);
  }, []);

  // Filter collective directory members
  const filteredMembers = collectiveMembers.filter((member) => {
    if (memberFilter === "all") return true;
    return member.divisions.some((divName) =>
      divName.toLowerCase().includes(memberFilter.toLowerCase())
    );
  });

  // Reusable Member Avatar / Portrait Component
  const MemberPortrait = ({
    member,
    className = "",
    aspectRatio = "aspect-[4/5]",
    large = false,
  }: {
    member: { name: string; initials: string; avatar?: string; handle?: string };
    className?: string;
    aspectRatio?: string;
    large?: boolean;
  }) => {
    return (
      <div
        className={`relative overflow-hidden rounded-md bg-[#0A0A0A] border border-white/[0.08] ${aspectRatio} ${className}`}
      >
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            className="w-full h-full object-cover grayscale contrast-110 brightness-95 hover:grayscale-0 hover:scale-105 transition-all duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#111111] via-[#0B0B0B] to-[#070707] relative group">
            {/* Minimalist Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

            {/* Initials Monogram */}
            <div
              className={`rounded-full border border-white/[0.08] flex items-center justify-center font-display font-black text-white/90 group-hover:border-[#FFBE32]/60 group-hover:text-[#FFBE32] transition-colors ${
                large ? "w-20 h-20 text-2xl" : "w-12 h-12 text-sm"
              }`}
            >
              {member.initials}
            </div>

            {member.handle && (
              <span className="font-mono text-[10px] text-[#777777] mt-3 tracking-widest uppercase">
                //{member.handle}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] selection:bg-[#FFBE32] selection:text-black font-sans">
      {/* ========================================================================= */}
      {/* 1. INTRODUCTION / HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 border-b border-white/[0.07] overflow-hidden">
        {/* Subtle Ambient Background Warmth */}
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#FFBE32]/[0.02] blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Eyebrow Label */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFBE32]" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#A0A0A0]">
              LORDZ ESPORTS / THE COLLECTIVE
            </span>
          </div>

          {/* Asymmetric Hero Composition */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Dominant Editorial Typography */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white leading-[0.95]">
                THE PEOPLE
                <br />
                <span className="text-[#7A7A7A]">BEHIND THE</span>{" "}
                <span className="text-white">PLAY.</span>
              </h1>

              <div className="w-12 h-px bg-[#FFBE32]/60 my-6" />

              <p className="text-base sm:text-lg text-[#A0A0A0] font-body leading-relaxed max-w-xl">
                Real people. Distinct roles. One competitive organization. LORDZ ESPORTS is powered by individuals working across technology, tournament operations, management, creative media, player talent, and community.
              </p>

              {/* Minimal Editorial Subtext */}
              <div className="pt-2 flex items-center gap-6 text-xs font-mono text-[#777777]">
                <span>// 8 CORE OPERATORS</span>
                <span>•</span>
                <span>// 6 DISCIPLINES</span>
                <span>•</span>
                <span>// PAN-INDIA CIRCUIT</span>
              </div>
            </div>

            {/* Right: Restrained Editorial Visual Framing */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative group overflow-hidden rounded-md border border-white/[0.08] bg-[#0A0A0A]">
                <img
                  src={teamPhoto}
                  alt="Lordz Esports Collective"
                  className="w-full h-72 sm:h-80 object-cover grayscale contrast-110 brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent pointer-events-none" />

                {/* Caption */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex items-end justify-between text-xs">
                  <div>
                    <span className="font-mono text-[10px] text-[#FFBE32] uppercase tracking-widest block mb-0.5">
                      HQ DIVISION ARCHIVE
                    </span>
                    <span className="text-white font-heading font-semibold tracking-wide">
                      The Operational Vanguard
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#888888]">
                    EST. 2024
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE COLLECTIVE ROSTER (ALL 8 MEMBERS WITH IMAGE ARCHITECTURE) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 border-b border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header with Filter Chips */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#FFBE32] block">
                COMPLETE DIRECTORY
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
                The Collective Roster
              </h2>
              <p className="text-sm text-[#888888] font-body max-w-lg">
                The eight real individuals steering technology, competitive governance, broadcast production, and community.
              </p>
            </div>

            {/* Discipline Filter Chips */}
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {[
                { id: "all", label: "All Members" },
                { id: "technology", label: "Technology" },
                { id: "operations", label: "Operations" },
                { id: "creative", label: "Creative" },
                { id: "community", label: "Community" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setMemberFilter(filter.id)}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                    memberFilter === filter.id
                      ? "bg-white text-black font-semibold"
                      : "bg-[#0F0F0F] text-[#888888] hover:text-white border border-white/[0.06]"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Members Matrix: Dedicated Image-First Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="group rounded-md bg-[#090909] border border-white/[0.06] hover:border-[#FFBE32]/40 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Dedicated Member Portrait Area */}
                  <MemberPortrait
                    member={member}
                    aspectRatio="aspect-[4/5]"
                    className="border-b border-white/[0.06] rounded-b-none"
                  />

                  {/* Profile Details */}
                  <div className="p-4 sm:p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-[#777777] group-hover:text-[#FFBE32] transition-colors">
                        //{member.handle}
                      </span>
                    </div>

                    <h4 className="font-heading text-lg font-bold text-white group-hover:text-[#FFBE32] transition-colors">
                      {member.name}
                    </h4>

                    <p className="text-xs text-[#A0A0A0] font-body leading-snug">
                      {member.primaryRole}
                    </p>

                    <p className="text-xs text-[#666666] font-body leading-relaxed pt-2 border-t border-white/[0.04]">
                      {member.focus}
                    </p>
                  </div>
                </div>

                {/* Division Badges */}
                <div className="p-4 pt-0 flex flex-wrap gap-1.5">
                  {member.divisions.map((div, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-mono text-[#888888] bg-[#121212] border border-white/[0.04]"
                    >
                      {div}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CLOSING SECTION: BUILT TO COMPETE. DESIGNED TO LAST. */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#FFBE32]" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#FFBE32]">
              THE LORDZ PHILOSOPHY
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
            Built to compete.
            <br />
            <span className="text-[#777777]">Designed to last.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#999999] font-body max-w-xl mx-auto leading-relaxed">
            We are always interested in collaborating with dedicated web engineers, tournament arbiters, motion graphics artists, and community leaders who believe in the future of competitive gaming in India.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://whatsapp.com/channel/0029Vb8sSc66hENsTW35hd11"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded text-xs font-heading font-semibold uppercase tracking-wider bg-white text-black hover:bg-[#FFBE32] transition-colors cursor-pointer"
            >
              <span>Connect on WhatsApp</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <a
              href="/partner-with-us"
              className="inline-flex items-center gap-2 px-6 py-3 rounded text-xs font-heading font-semibold uppercase tracking-wider bg-[#111111] text-white border border-white/[0.08] hover:border-white/[0.2] transition-colors cursor-pointer"
            >
              <span>Partner Inquiries</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
