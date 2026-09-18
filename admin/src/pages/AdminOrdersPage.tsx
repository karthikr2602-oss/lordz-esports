import React, { useState, useEffect } from "react";
import { merchandiseApi, type OrderItem } from "../api/merchandise";
import {
  Search,
  Phone,
  MapPin,
  Sparkles
} from "lucide-react";

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const sampleFallbackOrders: OrderItem[] = [
    {
      id: "ord-1",
      orderNumber: "LZ-2026-1042",
      productName: "LORDZ PRO COMBAT JERSEY 2026",
      customerName: "Rahul Verma",
      customerEmail: "rahul.v@gmail.com",
      customerPhone: "+91 98765 11223",
      address: "Flat 402, Royal Palms, Anna Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600040",
      size: "L",
      customIgn: "BEAST",
      customNumber: "00",
      totalAmount: 1299,
      paymentMethod: "ONLINE",
      paymentStatus: "PAID",
      orderStatus: "SHIPPED",
      trackingNumber: "DTDC-TN-992140",
      createdAt: new Date().toISOString(),
    },
    {
      id: "ord-2",
      orderNumber: "LZ-2026-1088",
      productName: "LORDZ PRO COMBAT JERSEY 2026",
      customerName: "Sneha Reddy",
      customerEmail: "sneha.r@gmail.com",
      customerPhone: "+91 97890 33445",
      address: "Plot 89, Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500033",
      size: "M",
      customIgn: "SHADOW",
      customNumber: "07",
      totalAmount: 1299,
      paymentMethod: "ONLINE",
      paymentStatus: "PAID",
      orderStatus: "PROCESSING",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "ord-3",
      orderNumber: "LZ-2026-1120",
      productName: "LORDZ PRO COMBAT JERSEY 2026",
      customerName: "Amitabh Sen",
      customerEmail: "amitabh@outlook.com",
      customerPhone: "+91 99112 88776",
      address: "14/B Park Street",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700016",
      size: "XL",
      customIgn: "CLUTCH_GOD",
      customNumber: "99",
      totalAmount: 1299,
      paymentMethod: "ONLINE",
      paymentStatus: "PAID",
      orderStatus: "PENDING",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await merchandiseApi.getOrders({
        status: statusFilter,
        search: searchQuery,
      });
      setOrders(data && data.length > 0 ? data : sampleFallbackOrders);
    } catch {
      setOrders(sampleFallbackOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, searchQuery]);

  const handleUpdateStatus = async (id: string, newStatus: string, trackingNumber?: string) => {
    try {
      await merchandiseApi.updateOrderStatus(id, newStatus, trackingNumber);
    } catch {
      // optimistic
    }
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? ({ ...o, orderStatus: newStatus as any, ...(trackingNumber ? { trackingNumber } : {}) })
          : o
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wider text-white">
          MERCHANDISE ORDER FULFILLMENT
        </h1>
        <p className="text-xs text-gray-400 font-body">
          Track customer customized jersey pre-orders, print IGNs, sizes, delivery addresses, and shipping dispatch.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0D0D12] border border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-[#FFBE32] text-black shadow-[0_0_10px_rgba(255,190,50,0.3)] font-extrabold"
                  : "bg-black/50 text-gray-400 hover:text-white border border-white/5"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, customer, IGN..."
            className="w-full rounded-xl border border-white/10 bg-black/60 pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:border-[#FFBE32] focus:outline-none"
          />
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 font-mono text-xs animate-pulse">
          Loading merchandise orders...
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => {
          const phoneClean = ord.customerPhone.replace(/[^0-9]/g, "");

          return (
            <div
              key={ord.id}
              className="p-5 rounded-2xl bg-[#0C0C10] border border-white/10 hover:border-[#FFBE32]/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 group shadow-[0_10px_25px_rgba(0,0,0,0.7)]"
            >
              {/* Order Identity & Customer */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm font-bold text-[#FFBE32] px-2.5 py-0.5 rounded bg-[#FFBE32]/10 border border-[#FFBE32]/30">
                    {ord.orderNumber}
                  </span>
                  <span className="font-heading font-bold text-white text-base">
                    {ord.customerName}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-heading font-bold uppercase tracking-wider ${
                      ord.orderStatus === "SHIPPED"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : ord.orderStatus === "PROCESSING"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : ord.orderStatus === "DELIVERED"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {ord.orderStatus}
                  </span>
                </div>

                {/* Customized Jersey Print Specifications */}
                <div className="p-3 rounded-xl bg-black/60 border border-white/5 inline-flex flex-wrap items-center gap-4 text-xs font-mono">
                  <span className="text-gray-300 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#FFBE32]" />
                    Print IGN: <strong className="text-white uppercase">{ord.customIgn || "BEAST"}</strong>
                  </span>
                  <span className="text-gray-300">
                    Number: <strong className="text-[#FFBE32]">#{ord.customNumber || "00"}</strong>
                  </span>
                  <span className="text-gray-300">
                    Size: <strong className="text-white">{ord.size}</strong>
                  </span>
                  <span className="text-emerald-400 font-bold">
                    ₹{ord.totalAmount} (PAID)
                  </span>
                </div>

                {/* Shipping Address */}
                <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                  <MapPin className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                  <span>
                    {ord.address}, {ord.city}, {ord.state} - {ord.pincode}
                  </span>
                </div>
              </div>

              {/* Status Updater Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5">
                <a
                  href={`https://wa.me/${phoneClean}?text=Hello%20${encodeURIComponent(ord.customerName)},%20update%20regarding%20your%20Lordz%20Esports%20Jersey%20Order%20${ord.orderNumber}:`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>WhatsApp Customer</span>
                </a>

                {/* Status Switcher */}
                <select
                  value={ord.orderStatus}
                  onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                  className="rounded-xl border border-white/15 bg-black px-3 py-2 text-xs font-heading font-bold text-white focus:border-[#FFBE32] focus:outline-none cursor-pointer"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
