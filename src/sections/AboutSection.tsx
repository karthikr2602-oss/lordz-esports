import { motion } from "framer-motion";
import { TemplePattern } from "../components/common/TemplePattern";
import logoImg from "../assets/lordz-logo.png";

export const AboutSection = () => {
  const manifesto = [
    { text: "WE DON'T JUST PLAY.", gold: false },
    { text: "WE COMPETE.", gold: true },
    { text: "WE BUILD LEGACY.", gold: false },
  ];

  return (
    <section id="about" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#050505] overflow-hidden">
      {/* Background Architectural Gopuram Pattern */}
      <TemplePattern className="opacity-[0.05] scale-150" />

      {/* Atmospheric center gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FFBE32]/6 blur-[140px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center z-10">
        
        {/* Crest */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center"
        >
          <img
            src={logoImg}
            alt="Lordz LE"
            className="h-full w-full object-contain drop-shadow-[0_0_20px_rgba(255,190,50,0.35)]"
          />
        </motion.div>

        {/* Section Pre-title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#FFBE32]/10 border border-[#FFBE32]/30 text-xs font-heading font-bold uppercase tracking-[0.25em] text-[#FFBE32] mb-6"
        >
          ORGANIZATION MANIFESTO
        </motion.div>

        <h2 className="sr-only">About Lordz Esports</h2>

        {/* Manifesto Large Typography */}
        <div className="space-y-2 sm:space-y-4">
          {manifesto.map((item, index) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={`font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight font-extrabold ${
                item.gold ? "text-gold-gradient" : "text-white"
              }`}
            >
              {item.text}
            </motion.div>
          ))}
        </div>

        {/* Story Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 max-w-2xl mx-auto text-base sm:text-lg text-gray-300 font-body leading-relaxed"
        >
          Born from the intense competitive pulse of Indian gaming, <strong className="text-white font-semibold">Lordz Esports</strong> is an organization founded on discipline, raw skill, and cultural pride. From grassroots mobile scrims to national championship arenas like Flame of Glory, we elevate players into champions.
        </motion.p>
      </div>
    </section>
  );
};
