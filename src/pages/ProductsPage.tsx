import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Check,
  CheckCircle2,
  X,
  Truck,
  RotateCcw,
  Loader2
} from "lucide-react";
import confetti from "canvas-confetti";

// Product Assets
import jerseyFrontImg from "../assets/jersey-front.jpg";
import hoodieImg from "../assets/product-hoodie.jpg";
import mousepadImg from "../assets/product-mousepad.jpg";
import capImg from "../assets/product-cap.jpg";
import sleeveImg from "../assets/product-sleeve.jpg";

export interface ProductItem {
  id: string;
  name: string;
  category: "JERSEYS" | "APPAREL" | "GEAR";
  tag: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  specs: string[];
  sizes: string[];
  hasCustomIgn?: boolean;
}

const allProducts: ProductItem[] = [
  {
    id: "lordz-pro-jersey-2026",
    name: "LORDZ PRO COMBAT JERSEY 2026",
    category: "JERSEYS",
    tag: "OFFICIAL ATHLETE SPEC",
    price: 1299,
    originalPrice: 1999,
    image: jerseyFrontImg,
    description:
      "The official uniform worn by Lordz Esports athletes in national tournaments. Crafted with Dravidian temple art motifs, moisture-wicking micro-poly, and customized athlete IGN print.",
    specs: [
      "100% Breathable Micro-Poly Waffle Knit",
      "Official Clan Squad IGN & Number Print",
      "Fade-Resistant Sublimation Art",
      "Tournament-Certified Anti-Static Fit"
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    hasCustomIgn: true
  },
  {
    id: "lordz-stealth-hoodie",
    name: "LORDZ STEALTH PRO FLEECE HOODIE",
    category: "APPAREL",
    tag: "LIMITED WINTER DROP",
    price: 2199,
    originalPrice: 2999,
    image: hoodieImg,
    description:
      "Heavyweight 420 GSM French Terry fleece hoodie featuring high-density 3D metallic gold embroidered Lordz clan crest, double-layered drawstring hood, and ribbed cuffs.",
    specs: [
      "420 GSM Heavy French Terry Cotton",
      "Metallic Gold Embroidered Crest",
      "Double-Lined Heavyweight Hood",
      "Oversized Relaxed Esports Silhouette"
    ],
    sizes: ["M", "L", "XL", "2XL"],
    hasCustomIgn: false
  },
  {
    id: "lordz-speed-mousepad-xxl",
    name: "LORDZ SPEED XXL GAMING MOUSEPAD (900x400MM)",
    category: "GEAR",
    tag: "BESTSELLER",
    price: 899,
    originalPrice: 1499,
    image: mousepadImg,
    description:
      "4mm thick high-density rubber desk mat with micro-woven cloth surface engineered for ultra-fast glide and stopping power. Features radiant gold dragon & Dravidian battle artwork.",
    specs: [
      "900 x 400 x 4 mm XXL Coverage",
      "Micro-Woven Low-Friction Surface",
      "Anti-Fray Precision Gold Stitched Edge",
      "Non-Slip Textured Natural Rubber Base"
    ],
    sizes: ["XXL (900x400mm)"],
    hasCustomIgn: false
  },
  {
    id: "lordz-tactical-cap",
    name: "LORDZ TACTICAL SNAPBACK PRO CAP",
    category: "GEAR",
    tag: "CLAN CREST",
    price: 649,
    originalPrice: 999,
    image: capImg,
    description:
      "Structured 6-panel premium cotton snapback featuring a 3D raised gold embroidered Lordz emblem, moisture-wicking interior band, and gold contrast underbrim.",
    specs: [
      "High-Density 3D Gold Embroidered Crest",
      "Breathable Structured 6-Panel Crown",
      "Moisture-Wicking Athletic Sweatband",
      "Adjustable Snapback Strap (Universal Fit)"
    ],
    sizes: ["One Size (Adjustable)"],
    hasCustomIgn: false
  },
  {
    id: "lordz-compression-sleeve",
    name: "LORDZ COMPRESSION AIM ARM SLEEVE",
    category: "GEAR",
    tag: "PRO ATHLETE EDITION",
    price: 499,
    originalPrice: 799,
    image: sleeveImg,
    description:
      "Designed for competitive mobile and PC gamers. Delivers zero-friction swipes across desk and mousepad surfaces, preventing skin drag during high-intensity clutch fights.",
    specs: [
      "Cooling Lycra-Spandex Blend",
      "Seamless Smooth Aim Swipe Surface",
      "Graduated Muscle Compression",
      "Anti-Slip Silicone Bicep Grip"
    ],
    sizes: ["M", "L", "XL"],
    hasCustomIgn: false
  }
];

export const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    address: "",
    city: "",
    state: "Tamil Nadu",
    pincode: "",
    size: "L",
    customIgn: "BEAST",
    customNumber: "00"
  });

  useEffect(() => {
    document.title = "Official Clan Gear & Products — LORDZ ESPORTS";
  }, []);

  const handleOpenBuy = (product: ProductItem) => {
    setSelectedProduct(product);
    setFormData((prev) => ({
      ...prev,
      size: product.sizes[0] || "L"
    }));
    setOrdered(false);
    setOrderNumber(null);
    setOrderModalOpen(true);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: selectedProduct.name,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail || "fan@lordz.gg",
          customerPhone: formData.customerPhone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          size: formData.size,
          customIgn: selectedProduct.hasCustomIgn ? formData.customIgn.toUpperCase() : null,
          customNumber: selectedProduct.hasCustomIgn ? formData.customNumber : null,
          totalAmount: selectedProduct.price,
          paymentMethod: "COD"
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data?.orderNumber) {
          setOrderNumber(data.data.orderNumber);
        }
      }

      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#FFBE32", "#FFFFFF", "#F59E0B"]
        });
      } catch {}

      setOrdered(true);
    } catch {
      // Offline fallback
      setOrdered(true);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = allProducts.filter((product) => {
    if (selectedCategory === "ALL") return true;
    return product.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-28 pb-24">
      {/* Ambient Lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-radial from-[#FFBE32]/10 via-transparent to-transparent blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFBE32]/10 border border-[#FFBE32]/30 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-[#FFBE32]" />
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#FFBE32]">
                OFFICIAL CLAN ARMORY &amp; APPAREL
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-wide text-white leading-[1.1]">
              Lordz Esports <span className="text-gold-gradient">Products</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-gray-400 font-body leading-relaxed max-w-2xl mx-auto">
              Engineered for tournament champions and die-hard fans. Wear the black and gold standard crafted with Dravidian combat aesthetics.
            </p>
          </motion.div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {[
            { label: "ALL PRODUCTS", key: "ALL" },
            { label: "PRO JERSEYS", key: "JERSEYS" },
            { label: "CLAN APPAREL", key: "APPAREL" },
            { label: "GAMING GEAR & ACCESSORIES", key: "GEAR" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedCategory(tab.key)}
              className={`px-5 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === tab.key
                  ? "bg-[#FFBE32] text-black shadow-[0_0_20px_rgba(255,190,50,0.35)]"
                  : "bg-[#0f0f14] text-gray-400 hover:text-white border border-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* PRODUCTS GRID */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl bg-[#0D0D12] border border-white/10 hover:border-[#FFBE32]/60 overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_15px_40px_rgba(255,190,50,0.15)]"
            >
              {/* Product Image Container */}
              <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-black/60 flex items-center justify-center p-4">
                {/* Badge Tag */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-md bg-black/85 border border-[#FFBE32]/40 text-[10px] font-heading font-bold uppercase tracking-wider text-[#FFBE32]">
                    {product.tag}
                  </span>
                </div>

                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
                />

                {/* Subtle Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Product Content */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-gray-500">
                      {product.category}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>IN STOCK</span>
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-white group-hover:text-[#FFBE32] transition-colors leading-tight">
                    {product.name}
                  </h3>

                  <p className="mt-2 text-xs text-gray-400 font-body line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Specs Pill List */}
                  <div className="mt-3.5 space-y-1.5">
                    {product.specs.slice(0, 2).map((sp, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-[11px] text-gray-300 font-body"
                      >
                        <Check className="h-3 w-3 text-[#FFBE32] shrink-0" />
                        <span className="truncate">{sp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-2xl font-extrabold text-[#FFBE32]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-gray-500 line-through font-mono">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase">
                      Inclusive of all taxes
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenBuy(product)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFBE32] hover:bg-[#FFA000] text-black font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(255,190,50,0.3)] group-hover:shadow-[0_0_25px_rgba(255,190,50,0.5)]"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Order Now</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Armory Trust Badges */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 sm:p-8 rounded-2xl bg-[#0D0D12] border border-white/10 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFBE32]/10 border border-[#FFBE32]/30 flex items-center justify-center shrink-0 text-[#FFBE32]">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
                Pan-India Express Dispatch
              </h4>
              <p className="text-xs text-gray-400 font-body mt-0.5">
                Shipped within 48h from Chennai warehouse.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFBE32]/10 border border-[#FFBE32]/30 flex items-center justify-center shrink-0 text-[#FFBE32]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
                100% Authentic Pro Gear
              </h4>
              <p className="text-xs text-gray-400 font-body mt-0.5">
                Official tournament spec &amp; sublimation print.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFBE32]/10 border border-[#FFBE32]/30 flex items-center justify-center shrink-0 text-[#FFBE32]">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
                Hassle-Free Size Exchange
              </h4>
              <p className="text-xs text-gray-400 font-body mt-0.5">
                7-day exchange support for all apparel.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INSTANT PRODUCT ORDER MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {orderModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-[8000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl rounded-2xl bg-[#0D0D12] border border-[#FFBE32]/40 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.95)] max-h-[92vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#FFBE32]">
                    OFFICIAL DISPATCH RESERVATION
                  </span>
                  <h3 className="font-display text-2xl uppercase tracking-wider text-white mt-0.5 truncate">
                    {selectedProduct.name}
                  </h3>
                </div>
                <button
                  onClick={() => setOrderModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {ordered ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h4 className="font-display text-2xl uppercase tracking-wider text-white">
                    Order Pre-Registered!
                  </h4>
                  <p className="text-sm text-gray-400 font-body max-w-md mx-auto leading-relaxed">
                    Thank you for ordering your official Lordz Clan merchandise! Our logistics team will send tracking updates directly to your WhatsApp and phone number.
                  </p>
                  {orderNumber && (
                    <div className="inline-block px-4 py-2 rounded-xl bg-black/60 border border-[#FFBE32]/40 font-mono text-xs text-[#FFBE32]">
                      Order Reference: {orderNumber}
                    </div>
                  )}
                  <div className="pt-4">
                    <button
                      onClick={() => setOrderModalOpen(false)}
                      className="px-8 py-3 rounded-xl bg-[#FFBE32] text-black font-heading text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Back to Store
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  {/* Selected Product Pill */}
                  <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="h-12 w-12 object-contain"
                      />
                      <div>
                        <h4 className="font-display text-sm font-bold uppercase text-white truncate max-w-[200px]">
                          {selectedProduct.name}
                        </h4>
                        <span className="text-xs font-bold text-[#FFBE32] font-mono">
                          ₹{selectedProduct.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                      CASH ON DELIVERY / UPI
                    </span>
                  </div>

                  {/* Size Selector */}
                  {selectedProduct.sizes.length > 1 && (
                    <div>
                      <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1.5">
                        Select Size
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.sizes.map((sz) => (
                          <button
                            type="button"
                            key={sz}
                            onClick={() => setFormData({ ...formData, size: sz })}
                            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                              formData.size === sz
                                ? "bg-[#FFBE32] text-black shadow-[0_0_12px_rgba(255,190,50,0.3)]"
                                : "bg-white/5 text-gray-300 hover:text-white border border-white/10"
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Jersey Custom IGN & Squad Number */}
                  {selectedProduct.hasCustomIgn && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-white/5 border border-[#FFBE32]/30">
                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-[#FFBE32] mb-1">
                          Custom Athlete IGN
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.customIgn}
                          onChange={(e) =>
                            setFormData({ ...formData, customIgn: e.target.value })
                          }
                          placeholder="BEAST"
                          className="w-full rounded-lg border border-white/15 bg-black/60 px-3 py-2 text-xs text-white focus:border-[#FFBE32] focus:outline-none font-mono uppercase"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-[#FFBE32] mb-1">
                          Squad Number (00-99)
                        </label>
                        <input
                          type="text"
                          maxLength={2}
                          value={formData.customNumber}
                          onChange={(e) =>
                            setFormData({ ...formData, customNumber: e.target.value })
                          }
                          placeholder="00"
                          className="w-full rounded-lg border border-white/15 bg-black/60 px-3 py-2 text-xs text-white focus:border-[#FFBE32] focus:outline-none font-mono text-center"
                        />
                      </div>
                    </div>
                  )}

                  {/* Customer Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customerName}
                        onChange={(e) =>
                          setFormData({ ...formData, customerName: e.target.value })
                        }
                        placeholder="Karthik R"
                        className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-xs text-white focus:border-[#FFBE32] focus:outline-none font-body"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                        Phone Number (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.customerPhone}
                        onChange={(e) =>
                          setFormData({ ...formData, customerPhone: e.target.value })
                        }
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-xs text-white focus:border-[#FFBE32] focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="Street address, apartment, flat no..."
                      className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-xs text-white focus:border-[#FFBE32] focus:outline-none font-body"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        placeholder="Chennai"
                        className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-white focus:border-[#FFBE32] focus:outline-none font-body"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        placeholder="Tamil Nadu"
                        className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-white focus:border-[#FFBE32] focus:outline-none font-body"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={formData.pincode}
                        onChange={(e) =>
                          setFormData({ ...formData, pincode: e.target.value })
                        }
                        placeholder="600001"
                        className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-white focus:border-[#FFBE32] focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setOrderModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-white/15 text-xs font-heading font-bold uppercase text-gray-300 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#FFBE32] hover:bg-[#FFA000] text-black font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(255,190,50,0.35)] disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-4 w-4" />
                          <span>Confirm Order (₹{selectedProduct.price})</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
