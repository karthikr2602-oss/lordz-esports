import { motion } from "framer-motion";
import { SectionHeading } from "../components/common/SectionHeading";
import { newsData, type NewsArticle } from "../data/news";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface NewsSectionProps {
  onSelectArticle?: (article: NewsArticle) => void;
  showHeader?: boolean;
}

export const NewsSection = ({
  onSelectArticle,
  showHeader = true,
}: NewsSectionProps) => {
  return (
    <section
      id="news"
      className={`relative ${showHeader ? "py-24" : "py-12 sm:py-16"} px-4 sm:px-6 lg:px-8 bg-[#070709]`}
    >
      <div className="max-w-7xl mx-auto">
        {showHeader && (
          <SectionHeading
            badge="DISPATCHES & REPORTS"
            title="LATEST FROM LORDZ"
            subtitle="Roster movements, tournament announcements, operational updates, and competitive debriefs."
          />
        )}

        {/* Editorial News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsData.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              onClick={() => onSelectArticle && onSelectArticle(article)}
              className="group relative flex flex-col justify-between rounded-xl bg-[#0C0C0E] border border-white/10 hover:border-[#FFBE32]/60 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
            >
              {/* Card Header Color Bar */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-heading font-bold uppercase tracking-wider border ${article.badgeColor}`}>
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-500 font-mono">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl uppercase tracking-wide text-white group-hover:text-[#FFBE32] transition-colors leading-snug line-clamp-3">
                  {article.title}
                </h3>

                <p className="mt-3 text-xs text-gray-400 font-body line-clamp-3">
                  {article.excerpt}
                </p>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Calendar className="h-3.5 w-3.5 text-gray-500" />
                  <span>{article.date}</span>
                </div>

                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#FFBE32] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  READ &rarr;
                </span>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {}}
            className="inline-flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-widest text-[#FFBE32] hover:text-[#FFCD59] transition-colors cursor-pointer group"
          >
            <span>VIEW ALL NEWS ARCHIVES</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
