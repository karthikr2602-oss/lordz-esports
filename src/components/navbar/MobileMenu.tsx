import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  X,
  Trophy,
  Users,
  Shirt,
  Newspaper,
  Video,
  MessageSquare,
  Handshake,
  Award,
  Info,
  Home,
  Vote,
} from "lucide-react";
import logoImg from "../../assets/lordz-logo.png";
import { GoldButton } from "../common/GoldButton";
import { OutlineButton } from "../common/OutlineButton";
import { useAuth } from "../../context/AuthContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenJoin: () => void;
  onOpenLogin: () => void;
  currentPath: string;
}

const navLinks = [
  { name: "HOME", path: "/", icon: Home },
  { name: "TOURNAMENTS", path: "/tournaments", icon: Trophy },
  { name: "PLAYERS", path: "/players", icon: Users },
  { name: "VOTING", path: "/voting", icon: Vote },
  { name: "TEAMS", path: "/teams", icon: Users },
  { name: "PRODUCTS", path: "/products", icon: Shirt },
  { name: "BRAND PARTNERS", path: "/partners", icon: Handshake },
  { name: "PARTNER WITH US", path: "/partner-with-us", icon: Award },
  { name: "ABOUT LORDZ", path: "/about", icon: Info },
  { name: "NEWS", path: "/news", icon: Newspaper },
  { name: "MEDIA", path: "/media", icon: Video },
  { name: "COMMUNITY", path: "/community", icon: MessageSquare },
];

export const MobileMenu = ({
  isOpen,
  onClose,
  onOpenJoin,
  onOpenLogin,
  currentPath,
}: MobileMenuProps) => {
  const { user, isAuthenticated } = useAuth();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[8000] xl:hidden bg-black/98 backdrop-blur-2xl flex flex-col justify-between p-5 sm:p-6 overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#FFBE32]/20 shrink-0">
            <Link to="/" onClick={onClose} className="flex items-center gap-3">
              <img
                src={logoImg}
                alt="Lordz"
                className="h-10 w-10 object-contain drop-shadow-[0_0_12px_#FFBE32]"
              />
              <span className="font-display text-2xl uppercase tracking-widest text-white">
                LORDZ <span className="text-[#FFBE32]">ESPORTS</span>
              </span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-6 w-6 text-[#FFBE32]" />
            </button>
          </div>

          {/* Navigation Items Staggered */}
          <div className="py-4 space-y-1 overflow-y-auto flex-1 my-2">
            {navLinks.map((link, index) => {
              const isActive = currentPath === link.path;
              const Icon = link.icon;

              return (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.25 }}
                >
                  <Link
                    to={link.path}
                    onClick={onClose}
                    className={`flex items-center justify-between py-2.5 px-3.5 rounded-lg font-heading text-sm sm:text-base tracking-wider uppercase transition-all ${
                      isActive
                        ? "text-[#FFBE32] bg-[#FFBE32]/12 border border-[#FFBE32]/30 font-bold shadow-[0_0_15px_rgba(255,190,50,0.1)]"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${isActive ? "text-[#FFBE32]" : "text-gray-400"}`} />
                      <span>{link.name}</span>
                    </div>
                    {isActive && <span className="h-2 w-2 rounded-full bg-[#FFBE32] animate-pulse" />}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pt-4 border-t border-white/10 space-y-2.5 shrink-0"
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
            {isAuthenticated && user ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-[#FFBE32]/40 bg-[#FFBE32]/10 hover:bg-[#FFBE32]/20 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <div className="w-5 h-5 rounded-md bg-[#FFBE32] text-black font-display text-[10px] font-bold flex items-center justify-center">
                  {user.ign?.slice(0, 2).toUpperCase() || user.username?.slice(0, 2).toUpperCase() || "LZ"}
                </div>
                <span>ATHLETE PASSPORT ({user.ign || user.username})</span>
              </button>
            ) : (
              <OutlineButton
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="w-full"
                size="md"
              >
                PLAYER LOGIN / REGISTER
              </OutlineButton>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
