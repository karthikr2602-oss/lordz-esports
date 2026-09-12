import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Swords, Tv, Users, Shirt, Newspaper, Video, MessageSquare } from "lucide-react";
import logoImg from "../../assets/lordz-logo.png";
import { GoldButton } from "../common/GoldButton";
import { OutlineButton } from "../common/OutlineButton";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenJoin: () => void;
  onOpenLogin: () => void;
  activeSection: string;
}

const navLinks = [
  { name: "HOME", href: "#home", icon: null },
  { name: "TOURNAMENTS", href: "#tournaments", icon: Trophy },
  { name: "SCRIMS", href: "#tournaments", icon: Swords },
  { name: "MATCHES", href: "#matches", icon: Tv },
  { name: "LEADERBOARD", href: "#flame-of-glory", icon: Trophy },
  { name: "TEAMS", href: "#teams", icon: Users },
  { name: "PLAYERS", href: "#players", icon: Users },
  { name: "JERSEY", href: "#jersey", icon: Shirt },
  { name: "NEWS", href: "#news", icon: Newspaper },
  { name: "MEDIA", href: "#media", icon: Video },
  { name: "COMMUNITY", href: "#community", icon: MessageSquare },
];

export const MobileMenu = ({
  isOpen,
  onClose,
  onOpenJoin,
  onOpenLogin,
  activeSection,
}: MobileMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[8000] lg:hidden bg-black/95 backdrop-blur-xl flex flex-col justify-between p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#FFBE32]/20">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="Lordz" className="h-10 w-10 object-contain drop-shadow-[0_0_12px_#FFBE32]" />
              <span className="font-display text-2xl uppercase tracking-widest text-white">
                LORDZ <span className="text-[#FFBE32]">ESPORTS</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Items Staggered */}
          <div className="my-auto py-6 overflow-y-auto space-y-1">
            {navLinks.map((link, index) => {
              const isActive = activeSection === link.name.toLowerCase();
              return (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-lg font-heading text-lg tracking-widest transition-all ${
                    isActive
                      ? "text-[#FFBE32] bg-[#FFBE32]/10 font-bold"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && <span className="h-2 w-2 rounded-full bg-[#FFBE32]" />}
                </motion.a>
              );
            })}
          </div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4 border-t border-white/10 space-y-3"
          >
            <GoldButton
              onClick={() => {
                onClose();
                onOpenJoin();
              }}
              className="w-full"
              size="md"
            >
              JOIN TOURNAMENT
            </GoldButton>
            <OutlineButton
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="w-full"
              size="md"
            >
              LOGIN TO PORTAL
            </OutlineButton>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
