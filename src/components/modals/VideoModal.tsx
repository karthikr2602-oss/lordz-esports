import { Modal } from "../common/Modal";
import { Play, Flame, Trophy } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category?: string;
  game?: string;
}

export const VideoModal = ({
  isOpen,
  onClose,
  title,
  category = "HIGHLIGHTS",
  game = "FREE FIRE MAX",
}: VideoModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="LORDZ STREAM BROADCAST"
      subtitle={`${game} • ${category}`}
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Cinematic Video Player Container */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-[#FFBE32]/30 bg-black flex items-center justify-center group shadow-2xl">
          {/* Simulated stream player background */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
          
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded bg-red-600 px-2 py-0.5 text-[10px] font-heading font-bold uppercase tracking-wider text-white">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              OFFICIAL BROADCAST
            </span>
            <span className="rounded bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono text-[#FFBE32] border border-white/10">
              1080p 60FPS
            </span>
          </div>

          <div className="z-20 text-center px-4">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFBE32] text-black shadow-[0_0_25px_#FFBE32] group-hover:scale-110 transition-transform">
              <Play className="h-7 w-7 fill-current ml-1" />
            </div>
            <h4 className="font-display text-xl sm:text-2xl uppercase tracking-wider text-white">
              {title}
            </h4>
            <p className="mt-1 text-xs text-gray-400 font-body">
              Broadcast stream loaded. Press play to view match footage and caster commentary.
            </p>
          </div>

          {/* Bottom broadcast bar */}
          <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-[#FFBE32]" />
              <span className="font-heading font-semibold text-white">LORDZ ESPORTS</span>
            </div>
            <div className="flex items-center gap-1 text-[#FFBE32] font-mono">
              <Trophy className="h-3.5 w-3.5" />
              <span>FLAME OF GLORY ARENA</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 px-1">
          <span>Official Match Feed provided by Lordz Esports Network</span>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noreferrer"
            className="text-[#FFBE32] hover:underline font-heading tracking-wider uppercase"
          >
            Open on YouTube &rarr;
          </a>
        </div>
      </div>
    </Modal>
  );
};
