import React, { useState, useEffect } from "react";
import { apiRequest } from "../api/client";
import { mediaData, type MediaItem } from "../data/media";
import {
  Plus,
  Edit,
  Trash2,
  Play,
  Eye,
  X
} from "lucide-react";

export const AdminMediaPage: React.FC = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);

  const [formData, setFormData] = useState<Partial<MediaItem>>({
    title: "",
    type: "VIDEOS",
    game: "FREE FIRE MAX",
    youtubeId: "dQw4w9WgXcQ",
    duration: "02:30",
    views: "10K VIEWS",
    tag: "FEATURED",
    description: "",
    featured: true,
  });

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<MediaItem[]>("/media", { method: "GET" }, mediaData);
      setMedia(data);
    } catch {
      setMedia(mediaData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      type: "VIDEOS",
      game: "FREE FIRE MAX",
      youtubeId: "dQw4w9WgXcQ",
      duration: "02:30",
      views: "15K VIEWS",
      tag: "CLUTCH",
      description: "Official match highlight and commentary breakdown.",
      featured: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (m: MediaItem) => {
    setEditingItem(m);
    setFormData(m);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await apiRequest(`/media/${editingItem.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
        setMedia((prev) =>
          prev.map((item) => (item.id === editingItem.id ? ({ ...item, ...formData } as MediaItem) : item))
        );
      } else {
        const newItem: MediaItem = {
          id: `media-${Date.now()}`,
          title: formData.title || "VIDEO TITLE",
          type: formData.type || "VIDEOS",
          game: formData.game || "FREE FIRE MAX",
          youtubeId: formData.youtubeId || "dQw4w9WgXcQ",
          duration: formData.duration || "01:00",
          views: formData.views || "10K VIEWS",
          date: "RECENT",
          tag: formData.tag || "FEATURED",
          description: formData.description,
          featured: !!formData.featured,
        };
        try {
          await apiRequest("/media", {
            method: "POST",
            body: JSON.stringify(newItem),
          });
        } catch {
          // fallback
        }
        setMedia((prev) => [newItem, ...prev]);
      }
      setModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to save media item");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media item?")) return;
    try {
      await apiRequest(`/media/${id}`, { method: "DELETE" });
    } catch {
      // optimistic
    }
    setMedia((prev) => prev.filter((m) => m.id !== id));
  };

  const filteredMedia = media.filter(
    (item) => typeFilter === "ALL" || item.type === typeFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-white">
            VIDEO HIGHLIGHTS & MEDIA HUB
          </h1>
          <p className="text-xs text-gray-400 font-body">
            Curate YouTube tournament streams, Booyah clutch replays, and shorts displayed across the website.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider text-black bg-[#FFBE32] hover:bg-[#FFA000] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,190,50,0.3)] shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Media Item</span>
        </button>
      </div>

      {/* Type Filter */}
      <div className="flex gap-2">
        {["ALL", "VIDEOS", "HIGHLIGHTS", "PHOTOS", "SHORTS"].map((tf) => (
          <button
            key={tf}
            onClick={() => setTypeFilter(tf)}
            className={`px-4 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
              typeFilter === tf
                ? "bg-[#FFBE32] text-black shadow-[0_0_10px_rgba(255,190,50,0.3)] font-extrabold"
                : "bg-black/50 text-gray-400 hover:text-white border border-white/5"
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 font-mono text-xs animate-pulse">
          Loading media library...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredMedia.map((m) => (
          <div
            key={m.id}
            className="p-5 rounded-2xl bg-[#0C0C10] border border-white/10 hover:border-[#FFBE32]/60 transition-all flex flex-col justify-between group shadow-[0_10px_25px_rgba(0,0,0,0.7)]"
          >
            <div>
              {/* Type pill & views */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="px-2.5 py-0.5 rounded bg-black border border-white/10 text-[10px] font-heading font-bold text-[#FFBE32] uppercase">
                  {m.type}
                </span>
                <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" /> {m.views}
                </span>
              </div>

              {/* YouTube Visual / Embed preview */}
              <div className="mt-3 aspect-video rounded-xl bg-black/60 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group-hover:border-[#FFBE32]/30 transition-all">
                <div className="h-10 w-10 rounded-full bg-[#FFBE32]/20 border border-[#FFBE32] flex items-center justify-center text-[#FFBE32]">
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                </div>
                <span className="mt-2 text-[10px] font-mono text-gray-400">
                  YT ID: {m.youtubeId || "dQw4w9WgXcQ"}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-display text-lg uppercase tracking-wider text-white group-hover:text-[#FFBE32] transition-colors mt-3 line-clamp-2">
                {m.title}
              </h3>
              <p className="text-xs text-gray-400 font-body mt-1 line-clamp-2">
                {m.description}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-mono">{m.duration || "Clip"}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(m)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#FFBE32] cursor-pointer"
                  title="Edit Media"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 cursor-pointer"
                  title="Delete Media"
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
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0D0D12] border border-[#FFBE32]/40 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="font-display text-2xl uppercase tracking-wider text-white">
                {editingItem ? "Edit Media Item" : "Add Media Video / Clip"}
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
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="FLAME OF GLORY S2 • OFFICIAL TRAILER"
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    Media Category
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                  >
                    <option value="VIDEOS">VIDEOS</option>
                    <option value="HIGHLIGHTS">HIGHLIGHTS</option>
                    <option value="SHORTS">SHORTS</option>
                    <option value="PHOTOS">PHOTOS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    YouTube Video ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.youtubeId}
                    onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
                    placeholder="dQw4w9WgXcQ"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    Duration Display
                  </label>
                  <input
                    type="text"
                    value={formData.duration || ""}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="02:45"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    Views
                  </label>
                  <input
                    type="text"
                    value={formData.views || ""}
                    onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                    placeholder="48K VIEWS"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none font-mono"
                  />
                </div>
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
                  Save Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
