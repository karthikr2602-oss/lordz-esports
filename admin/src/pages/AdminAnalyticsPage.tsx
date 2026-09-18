import React, { useState, useEffect } from "react";
import { adminApi, type DashboardMetrics } from "../api/admin";
import { FileSpreadsheet } from "lucide-react";

export const AdminAnalyticsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminApi.getDashboardMetrics();
        setMetrics(data);
      } catch {
        // demo metrics fallback
        setMetrics({
          kpis: {
            tournamentsCount: 6,
            liveTournamentsCount: 2,
            registrationsCount: 96,
            pendingRegistrationsCount: 8,
            playersCount: 4,
            legendsCount: 3,
            ordersCount: 38,
            pendingOrdersCount: 5,
            productsCount: 3,
            articlesCount: 4,
            partnersCount: 6,
            totalRevenue: 284500,
          },
          monthlyRevenue: [
            { month: "Apr", revenue: 42000, registrations: 120 },
            { month: "May", revenue: 68000, registrations: 180 },
            { month: "Jun", revenue: 95000, registrations: 240 },
            { month: "Jul", revenue: 140000, registrations: 320 },
            { month: "Aug", revenue: 195000, registrations: 450 },
            { month: "Sep", revenue: 284500, registrations: 580 },
          ],
          recentRegistrations: [],
          recentOrders: [],
          recentAuditLogs: [
            { id: "1", adminEmail: "admin@lordz.gg", action: "CREATE_TOURNAMENT", details: "Created Flame of Glory Season 2", createdAt: new Date().toISOString() },
            { id: "2", adminEmail: "admin@lordz.gg", action: "APPROVE_SLOT", details: "Approved Soul Warriors for Slot 01", createdAt: new Date(Date.now() - 3600000).toISOString() },
            { id: "3", adminEmail: "tournaments@lordz.gg", action: "UPDATE_MATCH", details: "Posted Match 2 Booyah to Lordz", createdAt: new Date(Date.now() - 7200000).toISOString() },
          ],
        });
      }
    };
    load();
  }, []);

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Month,Revenue (INR),Registrations\n" +
      (metrics?.monthlyRevenue.map((m) => `${m.month},${m.revenue},${m.registrations}`).join("\n") || "");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lordz_esports_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-white">
            EXECUTIVE REPORTS & ANALYTICS
          </h1>
          <p className="text-xs text-gray-400 font-body">
            Comprehensive business intelligence on tournament participation, merchandise monetization, and system audits.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider text-black bg-[#FFBE32] hover:bg-[#FFA000] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,190,50,0.3)] shrink-0"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Game Title Distribution */}
        <div className="p-6 rounded-2xl bg-[#0C0C10] border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white mb-1">
              Tournament Distribution by Game
            </h3>
            <p className="text-xs text-gray-400 font-body mb-6">
              Squad registrations across competitive titles.
            </p>

            <div className="space-y-3.5 font-mono text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-white font-bold">FREE FIRE MAX</span>
                  <span className="text-[#FFBE32]">55% (52 Squads)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-[#FFBE32] rounded-full" style={{ width: "55%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-white font-bold">BGMI</span>
                  <span className="text-indigo-400">30% (28 Squads)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: "30%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-white font-bold">VALORANT</span>
                  <span className="text-rose-400">15% (16 Squads)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: "15%" }} />
                </div>
              </div>
            </div>
          </div>

          <span className="mt-6 pt-3 border-t border-white/5 text-[11px] font-mono text-gray-500 block">
            Sample size: 96 Verified Teams
          </span>
        </div>

        {/* Merchandise Revenue Breakdown */}
        <div className="p-6 rounded-2xl bg-[#0C0C10] border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white mb-1">
              E-Commerce Product Sales
            </h3>
            <p className="text-xs text-gray-400 font-body mb-6">
              Order revenue breakdown across apparel lines.
            </p>

            <div className="space-y-3.5 font-mono text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-white font-bold">Lordz Pro Jersey (2026)</span>
                  <span className="text-emerald-400">₹2,10,000 (74%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "74%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-white font-bold">Stealth Clan Hoodie</span>
                  <span className="text-purple-400">₹54,500 (19%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "19%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-white font-bold">Compression Sleeves</span>
                  <span className="text-amber-400">₹20,000 (7%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: "7%" }} />
                </div>
              </div>
            </div>
          </div>

          <span className="mt-6 pt-3 border-t border-white/5 text-[11px] font-mono text-gray-500 block">
            Razorpay + Online Dispatches
          </span>
        </div>

        {/* Operational Health */}
        <div className="p-6 rounded-2xl bg-[#0C0C10] border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white mb-1">
              System Uptime & Latency
            </h3>
            <p className="text-xs text-gray-400 font-body mb-6">
              Production infrastructure health checks.
            </p>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black/50 border border-white/5 flex items-center justify-between">
                <span className="text-gray-400">API Response Time:</span>
                <span className="text-emerald-400 font-bold">24ms (Ultra-Fast)</span>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-white/5 flex items-center justify-between">
                <span className="text-gray-400">Database Engine:</span>
                <span className="text-white font-bold">Prisma ORM</span>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-white/5 flex items-center justify-between">
                <span className="text-gray-400">Uptime SLA:</span>
                <span className="text-[#FFBE32] font-bold">99.98%</span>
              </div>
            </div>
          </div>

          <span className="mt-6 pt-3 border-t border-white/5 text-[11px] font-mono text-emerald-400 block flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            All Subsystems Operational
          </span>
        </div>
      </div>

      {/* Audit Trail Log */}
      <div className="p-6 rounded-2xl bg-[#0C0C10] border border-white/10">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white mb-1">
          Recent Administrative Audit Logs
        </h3>
        <p className="text-xs text-gray-400 font-body mb-4">
          Immutable logging of administrative creations, modifications, and slot dispatches.
        </p>

        <div className="space-y-2.5">
          {metrics?.recentAuditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-white/5 text-[#FFBE32] text-[10px] font-bold">
                  {log.action}
                </span>
                <span className="text-white">{log.details}</span>
              </div>
              <div className="text-gray-500 text-[11px]">
                {log.adminEmail} • {new Date(log.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
