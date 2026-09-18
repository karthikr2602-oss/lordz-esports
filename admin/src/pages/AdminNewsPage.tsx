import React, { useState, useEffect } from "react";
import { newsApi } from "../api/news";
import { type NewsArticle, newsData } from "../data/news";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  X
} from "lucide-react";

export const AdminNewsPage: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

  const [formData, setFormData] = useState<Partial<NewsArticle>>({
    title: "",
    category: "TOURNAMENT",
    excerpt: "",
    date: "TODAY",
    readTime: "3 MIN READ",
    author: "Lordz Editorial",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  });

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await newsApi.getAll();
      setArticles(data);
    } catch {
      setArticles(newsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      category: "TOURNAMENT",
      excerpt: "",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase(),
      readTime: "3 MIN READ",
      author: "Lordz Editorial",
      badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (art: NewsArticle) => {
    setEditingArticle(art);
    setFormData(art);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        slug: formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `news-${Date.now()}`,
      };

      if (editingArticle) {
        await newsApi.update(editingArticle.id, payload);
        setArticles((prev) =>
          prev.map((a) => (a.id === editingArticle.id ? ({ ...a, ...payload } as NewsArticle) : a))
        );
      } else {
        const newArt: NewsArticle = {
          id: `news-${Date.now()}`,
          title: formData.title || "NEWS HEADLINE",
          category: formData.category || "TOURNAMENT",
          excerpt: formData.excerpt || "",
          date: formData.date || "SEP 2026",
          readTime: formData.readTime || "3 MIN READ",
          author: formData.author || "Lordz Editorial",
          badgeColor: formData.badgeColor || "bg-amber-500/20 text-amber-400 border-amber-500/30",
        };
        try {
          await newsApi.create(newArt);
        } catch {
          // fallback
        }
        setArticles((prev) => [newArt, ...prev]);
      }
      setModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to save article");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this press article?")) return;
    try {
      await newsApi.delete(id);
    } catch {
      // optimistic
    }
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-white">
            NEWS & EDITORIAL DESK
          </h1>
          <p className="text-xs text-gray-400 font-body">
            Publish organization announcements, roster signing press releases, and tournament wrap-ups.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider text-black bg-[#FFBE32] hover:bg-[#FFA000] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,190,50,0.3)] shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Publish Article</span>
        </button>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 font-mono text-xs animate-pulse">
          Loading news releases...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((art) => (
          <div
            key={art.id}
            className="p-6 rounded-2xl bg-[#0C0C10] border border-white/10 hover:border-[#FFBE32]/60 transition-all flex flex-col justify-between group shadow-[0_10px_25px_rgba(0,0,0,0.7)]"
          >
            <div>
              {/* Category & Date */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-heading font-bold uppercase tracking-wider border ${art.badgeColor || "bg-amber-500/20 text-amber-400 border-amber-500/30"}`}
                >
                  {art.category}
                </span>
                <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> {art.date}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display text-xl uppercase tracking-wider text-white group-hover:text-[#FFBE32] transition-colors mt-3 leading-snug">
                {art.title}
              </h3>

              {/* Excerpt */}
              <p className="mt-3 text-xs text-gray-400 font-body leading-relaxed line-clamp-3">
                {art.excerpt}
              </p>
            </div>

            {/* Footer & Actions */}
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-gray-400 font-mono flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {art.readTime} • By {art.author}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(art)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#FFBE32] cursor-pointer"
                  title="Edit Article"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(art.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 cursor-pointer"
                  title="Delete Article"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-[#0D0D12] border border-[#FFBE32]/40 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="font-display text-2xl uppercase tracking-wider text-white">
                {editingArticle ? "Edit Press Release" : "Publish News Article"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. FLAME OF GLORY S2 GRAND FINALS COMMENCES"
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                  >
                    <option value="TOURNAMENT">TOURNAMENT</option>
                    <option value="TEAM">TEAM</option>
                    <option value="PLAYER">PLAYER</option>
                    <option value="COMMUNITY">COMMUNITY</option>
                    <option value="ESPORTS">ESPORTS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    Author / Desk
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Lordz Editorial"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                  Article Summary / Excerpt *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="32 of the sharpest mobile esports squads converge in a 6-round showdown..."
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 rounded-xl border border-white/15 text-xs font-heading font-bold text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#FFBE32] text-black font-heading text-xs font-bold uppercase tracking-wider"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
