import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { GoldButton } from "../components/common/GoldButton";
import { TemplePattern } from "../components/common/TemplePattern";
import logoImg from "../assets/lordz-logo.png";

export const NotFoundPage = () => {
  useEffect(() => {
    document.title = "404 — Signal Lost | LORDZ ESPORTS";
  }, []);

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#050505] overflow-hidden">
      {/* Background Architectural Patterns */}
      <div className="absolute inset-0 bg-esports-grid opacity-25 pointer-events-none" />
      <TemplePattern className="opacity-[0.05] scale-150" />

      {/* Atmospheric Gold Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#FFBE32]/10 blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto text-center">
        {/* Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#0D0D10] border border-[#FFBE32]/30 p-3 shadow-[0_0_30px_rgba(255,190,50,0.2)]"
        >
          <img
            src={logoImg}
            alt="Lordz Esports"
            className="h-full w-full object-contain drop-shadow-[0_0_10px_#FFBE32]"
          />
        </motion.div>

        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-7xl sm:text-9xl font-extrabold text-gold-gradient tracking-tight leading-none"
        >
          404
        </motion.div>

        {/* Signal Lost */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 inline-flex items-center gap-2 px-3.5 py-1 rounded bg-red-950/70 border border-red-500/40 text-xs font-heading font-bold uppercase tracking-[0.25em] text-red-400"
        >
          <ShieldAlert className="h-4 w-4" />
          SIGNAL LOST
        </motion.div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-4 text-base sm:text-lg text-gray-300 font-body leading-relaxed"
        >
          Looks like you've left the combat zone. The coordinates you requested do not exist on the tactical map.
        </motion.p>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex justify-center"
        >
          <Link to="/">
            <GoldButton size="md" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>RETURN TO BASE</span>
            </GoldButton>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
