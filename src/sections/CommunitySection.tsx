import { motion } from "framer-motion";
import { MessageSquare, Send, ArrowRight } from "lucide-react";

// Social SVG Icons for Instagram & YouTube
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" fill="currentColor" />
  </svg>
);

export const CommunitySection = () => {
  const channels = [
    {
      name: "DISCORD",
      label: "Tier-1 Scrims & Match Lobbies",
      count: "12,400+ ATHLETES",
      icon: MessageSquare,
      color: "hover:border-[#5865F2] hover:shadow-[0_0_25px_rgba(88,101,242,0.3)]",
      btnText: "JOIN DISCORD SERVER",
      href: "https://discord.com",
    },
    {
      name: "WHATSAPP",
      label: "Tournament Slot Announcements",
      count: "8,500+ COMMUNITY",
      icon: Send,
      color: "hover:border-[#25D366] hover:shadow-[0_0_25px_rgba(37,211,102,0.3)]",
      btnText: "JOIN WHATSAPP CHANNEL",
      href: "https://whatsapp.com",
    },
    {
      name: "INSTAGRAM",
      label: "Clips, Roster News & Giveaways",
      count: "45,000+ FOLLOWERS",
      icon: InstagramIcon,
      color: "hover:border-[#E1306C] hover:shadow-[0_0_25px_rgba(225,48,108,0.3)]",
      btnText: "FOLLOW @LORDZ_ESPORTS",
      href: "https://instagram.com",
    },
    {
      name: "YOUTUBE",
      label: "Flame of Glory Live Broadcasts",
      count: "38,000+ SUBSCRIBERS",
      icon: YoutubeIcon,
      color: "hover:border-[#FF0000] hover:shadow-[0_0_25px_rgba(255,0,0,0.3)]",
      btnText: "SUBSCRIBE ON YOUTUBE",
      href: "https://youtube.com",
    },
  ];

  return (
    <section id="community" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#070709] overflow-hidden">
      {/* Background Gold Wave Grid */}
      <div className="absolute inset-0 bg-esports-grid opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#FFBE32]/8 blur-[160px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#FFBE32]/10 border border-[#FFBE32]/30 text-xs font-heading font-bold uppercase tracking-[0.2em] text-[#FFBE32] mb-3"
          >
            INDIAN GAMING GUILD
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl sm:text-6xl md:text-7xl uppercase tracking-wider text-white font-bold"
          >
            JOIN THE LORDZ <span className="text-gold-gradient">COMMUNITY</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 text-base sm:text-lg text-gray-300 font-body"
          >
            "Play together. Compete together. Grow together." Connect with vetted clan captains, participate in automated scrim lobbies, and build your competitive reputation.
          </motion.p>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {channels.map((ch, index) => {
            const Icon = ch.icon;

            return (
              <motion.div
                key={ch.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className={`rounded-2xl bg-[#0C0C0E] border border-white/10 ${ch.color} p-6 flex flex-col justify-between transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.6)]`}
              >
                <div>
                  <div className="h-12 w-12 rounded-xl bg-black/80 border border-white/10 flex items-center justify-center text-white mb-4">
                    <Icon className="h-6 w-6 text-[#FFBE32]" />
                  </div>

                  <span className="font-mono text-xs text-[#FFBE32] font-semibold">
                    {ch.count}
                  </span>

                  <h3 className="font-display text-2xl uppercase tracking-wider text-white mt-1">
                    {ch.name}
                  </h3>

                  <p className="mt-2 text-xs text-gray-400 font-body">
                    {ch.label}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5">
                  <a
                    href={ch.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-3 rounded font-heading text-xs font-bold uppercase tracking-wider bg-[#141418] hover:bg-[#FFBE32] text-gray-200 hover:text-black border border-white/10 hover:border-[#FFBE32] flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>{ch.btnText}</span>
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
