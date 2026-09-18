import React, { useState, useEffect } from "react";
import { merchandiseApi, type ProductItem, fallbackProducts } from "../api/merchandise";
import {
  Plus,
  Edit,
  Trash2,
  X
} from "lucide-react";

export const AdminMerchandisePage: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  const [formData, setFormData] = useState<Partial<ProductItem>>({
    name: "",
    slug: "",
    subtitle: "",
    description: "",
    price: 1299,
    originalPrice: 1999,
    stock: 100,
    category: "JERSEY",
    sizes: JSON.stringify(["S", "M", "L", "XL", "2XL"]),
    isAvailable: true,
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await merchandiseApi.getProducts();
      setProducts(data);
    } catch {
      setProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      subtitle: "Official Lordz Esports Merchandise",
      description: "Premium competition gear crafted for competitive performance.",
      price: 1299,
      originalPrice: 1999,
      stock: 100,
      category: "JERSEY",
      sizes: JSON.stringify(["S", "M", "L", "XL", "2XL"]),
      isAvailable: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: ProductItem) => {
    setEditingProduct(p);
    setFormData(p);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = formData.slug || formData.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `item-${Date.now()}`;
      const payload = { ...formData, slug };

      if (editingProduct) {
        await merchandiseApi.updateProduct(editingProduct.id, payload);
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? ({ ...p, ...payload } as ProductItem) : p))
        );
      } else {
        const newProduct: ProductItem = {
          id: `prod-${Date.now()}`,
          name: formData.name || "NEW ITEM",
          slug,
          subtitle: formData.subtitle,
          description: formData.description,
          price: formData.price || 1299,
          originalPrice: formData.originalPrice,
          stock: formData.stock || 100,
          category: formData.category || "JERSEY",
          sizes: formData.sizes || JSON.stringify(["S", "M", "L", "XL"]),
          isAvailable: formData.isAvailable !== false,
          isFeatured: true,
        };
        try {
          await merchandiseApi.createProduct(newProduct);
        } catch {
          // fallback
        }
        setProducts((prev) => [newProduct, ...prev]);
      }
      setModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to save product");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this merchandise product?")) return;
    try {
      await merchandiseApi.deleteProduct(id);
    } catch {
      // optimistic
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-white">
            MERCHANDISE & STORE MANAGEMENT
          </h1>
          <p className="text-xs text-gray-400 font-body">
            Control apparel stock, pricing, custom IGN athlete print settings, and store availability.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider text-black bg-[#FFBE32] hover:bg-[#FFA000] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,190,50,0.3)] shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 font-mono text-xs animate-pulse">
          Loading merchandise inventory...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-2xl bg-[#0C0C10] border border-white/10 hover:border-[#FFBE32]/60 transition-all flex flex-col justify-between group shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          >
            <div>
              {/* Top info */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="px-2.5 py-0.5 rounded bg-black border border-white/10 text-[10px] font-mono text-[#FFBE32] font-bold uppercase">
                  {p.category}
                </span>
                <span className={`text-[10px] font-mono font-bold ${p.stock > 10 ? "text-emerald-400" : "text-amber-400"}`}>
                  {p.stock} IN STOCK
                </span>
              </div>

              {/* Title & Price */}
              <div className="mt-4">
                <h3 className="font-display text-xl uppercase tracking-wider text-white group-hover:text-[#FFBE32] transition-colors leading-tight">
                  {p.name}
                </h3>
                <p className="text-xs text-gray-400 font-body mt-1 line-clamp-2">
                  {p.subtitle || p.description}
                </p>
              </div>

              {/* Pricing Box */}
              <div className="mt-4 p-3 rounded-xl bg-black/60 border border-white/5 flex items-baseline justify-between font-mono">
                <div>
                  <span className="text-lg font-bold text-[#FFBE32]">₹{p.price}</span>
                  {p.originalPrice && (
                    <span className="ml-2 text-xs text-gray-500 line-through">₹{p.originalPrice}</span>
                  )}
                </div>
                <span className="text-[10px] text-emerald-400 uppercase font-heading">
                  Available Online
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-mono">Sizes: S - 2XL</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#FFBE32] cursor-pointer"
                  title="Edit Product"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 cursor-pointer"
                  title="Delete Product"
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
                {editingProduct ? "Edit Product" : "Add Merchandise Product"}
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
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="LORDZ PRO COMBAT JERSEY 2026"
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="1299"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice || ""}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    placeholder="1999"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                  >
                    <option value="JERSEY">JERSEY</option>
                    <option value="HOODIE">HOODIE</option>
                    <option value="ACCESSORY">ACCESSORY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    Available Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    placeholder="150"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                  Subtitle / Material Spec
                </label>
                <input
                  type="text"
                  value={formData.subtitle || ""}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Official 2026-27 Athlete Edition • Micro-Poly"
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
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
