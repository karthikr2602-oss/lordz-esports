import { motion } from "framer-motion";
import { partnersData } from "../data/stats";
import { ShieldCheck, Handshake } from "lucide-react";

interface PartnersSectionProps {
  onPartnerWithUs: () => void;
  showHeader?: boolean;
}

export const PartnersSection = ({
  onPartnerWithUs,
  showHeader = true,
}: PartnersSectionProps) => {
  return (
    <section
      id="partners"
      className={`relative ${showHeader ? "py-20" : "py-10 sm:py-14"} px-4 sm:px-6 lg:px-8 bg-[#050505] border-t border-white/5`}
    >
      <div className="max-w-7xl mx-auto text-center">
        {showHeader && (
          <>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-heading font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">
              ECOSYSTEM & COLLABORATIONS
            </div>

            <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-white">
              OUR <span className="text-[#FFBE32]">PARTNERS</span>
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-gray-400 font-body max-w-lg mx-auto">
              Proudly supported by visionary brands driving the next era of South Asian and Indian esports.
            </p>
          </>
        )}

        {/* Clean Logo Wall */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {partnersData.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="flex flex-col items-center justify-center p-6 rounded-xl bg-[#0A0A0C] border border-white/5 hover:border-[#FFBE32]/40 transition-all duration-300 group"
            >
              <div className="h-10 w-10 rounded-lg bg-black border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-[#FFBE32] group-hover:border-[#FFBE32]/50 transition-all mb-3">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="font-display text-lg tracking-wider uppercase text-gray-300 group-hover:text-white transition-colors">
                {partner.name}
              </span>
              <span className="text-[10px] text-gray-500 font-heading uppercase tracking-wider mt-1">
                {partner.category}
              </span>
              <span className="mt-2 text-[9px] px-2 py-0.5 rounded bg-white/5 text-[#FFBE32] font-mono uppercase">
                {partner.tier}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Partnership CTA */}
        <div className="mt-10">
          <button
            onClick={onPartnerWithUs}
            className="inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-widest text-[#FFBE32] hover:text-[#FFCD59] transition-colors cursor-pointer group"
          >
            <Handshake className="h-4 w-4" />
            <span>PARTNER WITH LORDZ ESPORTS →</span>
          </button>
        </div>
      </div>
    </section>
  );
};
