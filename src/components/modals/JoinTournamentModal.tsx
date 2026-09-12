import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { GoldButton } from "../common/GoldButton";
import { CheckCircle2, Trophy, Shield } from "lucide-react";
import confetti from "canvas-confetti";

interface JoinTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentTitle?: string;
  game?: string;
  prizePool?: string;
}

export const JoinTournamentModal = ({
  isOpen,
  onClose,
  tournamentTitle = "FLAME OF GLORY S2",
  game = "FREE FIRE MAX",
  prizePool = "₹50,000",
}: JoinTournamentModalProps) => {
  const [teamName, setTeamName] = useState("");
  const [captainIgn, setCaptainIgn] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [discordTag, setDiscordTag] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !captainIgn || !whatsapp) return;

    // Trigger celebration confetti
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#FFBE32", "#FFD700", "#FFFFFF"],
    });

    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setTeamName("");
    setCaptainIgn("");
    setWhatsapp("");
    setDiscordTag("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title="TOURNAMENT ENTRY"
      subtitle={`Register squad for ${tournamentTitle}`}
      maxWidth="md"
    >
      {submitted ? (
        <div className="py-8 text-center flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-[#FFBE32]/20 border border-[#FFBE32] flex items-center justify-center text-[#FFBE32] mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h4 className="font-display text-3xl uppercase text-white">
            SLOT RESERVED!
          </h4>
          <p className="mt-2 text-sm text-[#9CA3AF] max-w-sm">
            Squad <span className="text-[#FFBE32] font-semibold">{teamName}</span> has been provisionally registered for {tournamentTitle}.
          </p>
          <div className="mt-4 p-3 rounded-lg border border-white/10 bg-black/40 text-xs text-left w-full space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Captain:</span>
              <span className="text-white font-mono">{captainIgn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">WhatsApp Dispatch:</span>
              <span className="text-white font-mono">{whatsapp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Prize Arena:</span>
              <span className="text-[#FFBE32] font-bold">{prizePool}</span>
            </div>
          </div>
          <div className="mt-6 w-full">
            <GoldButton onClick={handleReset} className="w-full" showArrow={false}>
              RETURN TO ARENA
            </GoldButton>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-black/40 border border-white/5 text-xs">
            <div className="flex items-center gap-2 text-gray-300">
              <Trophy className="h-4 w-4 text-[#FFBE32]" />
              <span>Pool: <strong className="text-[#FFBE32]">{prizePool}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Shield className="h-4 w-4 text-[#FFBE32]" />
              <span>Title: <strong className="text-white">{game}</strong></span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading uppercase tracking-wider text-gray-300 mb-1.5">
              Team / Organization Name *
            </label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. LORDZ ESPORTS"
              className="w-full rounded-lg border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#FFBE32] focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading uppercase tracking-wider text-gray-300 mb-1.5">
                Captain IGN *
              </label>
              <input
                type="text"
                required
                value={captainIgn}
                onChange={(e) => setCaptainIgn(e.target.value)}
                placeholder="e.g. BEAST"
                className="w-full rounded-lg border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#FFBE32] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-heading uppercase tracking-wider text-gray-300 mb-1.5">
                WhatsApp Contact *
              </label>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full rounded-lg border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#FFBE32] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading uppercase tracking-wider text-gray-300 mb-1.5">
              Discord ID / Handle
            </label>
            <input
              type="text"
              value={discordTag}
              onChange={(e) => setDiscordTag(e.target.value)}
              placeholder="e.g. beast#0001"
              className="w-full rounded-lg border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#FFBE32] focus:outline-none transition-colors"
            />
          </div>

          <div className="pt-2">
            <GoldButton type="submit" className="w-full" size="lg">
              CONFIRM REGISTRATION
            </GoldButton>
            <p className="mt-2 text-center text-[11px] text-gray-500">
              By joining, you agree to official tournament rules and fair-play anti-cheat vetting.
            </p>
          </div>
        </form>
      )}
    </Modal>
  );
};
