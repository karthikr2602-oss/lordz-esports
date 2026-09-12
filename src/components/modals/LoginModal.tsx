import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { GoldButton } from "../common/GoldButton";
import { OutlineButton } from "../common/OutlineButton";
import { Lock, User, CheckCircle2 } from "lucide-react";
import logoImg from "../../assets/lordz-logo.png";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [ign, setIgn] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ign) return;
    setIsLoggedIn(true);
  };

  const handleClose = () => {
    setIsLoggedIn(false);
    setIgn("");
    setPassword("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="PLAYER PORTAL"
      subtitle="Access your scrims, leaderboards & match statistics"
      maxWidth="sm"
    >
      {isLoggedIn ? (
        <div className="py-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFBE32]/20 border border-[#FFBE32] text-[#FFBE32]">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h4 className="font-display text-2xl uppercase text-white">
            WELCOME BACK, {ign.toUpperCase()}!
          </h4>
          <p className="mt-1 text-xs text-gray-400">
            Player rank synced. You now have access to verified Tier-1 scrim lobbies.
          </p>
          <div className="mt-6">
            <GoldButton onClick={handleClose} className="w-full" showArrow={false}>
              ENTER DASHBOARD
            </GoldButton>
          </div>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex justify-center mb-4">
            <img src={logoImg} alt="Lordz" className="h-14 w-14 object-contain drop-shadow-[0_0_12px_rgba(255,190,50,0.3)]" />
          </div>

          <div>
            <label className="block text-xs font-heading uppercase tracking-wider text-gray-300 mb-1">
              Player IGN or Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <input
                type="text"
                required
                value={ign}
                onChange={(e) => setIgn(e.target.value)}
                placeholder="BEAST or athlete@lordz.gg"
                className="w-full rounded-lg border border-white/15 bg-black/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#FFBE32] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading uppercase tracking-wider text-gray-300 mb-1">
              Password or Access Pin
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/15 bg-black/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#FFBE32] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" className="rounded border-white/20 bg-black accent-[#FFBE32]" />
              <span>Remember athlete</span>
            </label>
            <a href="#reset" onClick={(e) => e.preventDefault()} className="hover:text-[#FFBE32] transition-colors">
              Forgot PIN?
            </a>
          </div>

          <div className="space-y-2 pt-2">
            <GoldButton type="submit" className="w-full" size="md">
              SIGN IN
            </GoldButton>
            <OutlineButton
              type="button"
              onClick={() => {
                setIgn("DEMO_ATHLETE");
                setIsLoggedIn(true);
              }}
              className="w-full"
              size="sm"
            >
              TRY ATHLETE DEMO
            </OutlineButton>
          </div>
        </form>
      )}
    </Modal>
  );
};
