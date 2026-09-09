"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import QuickActionModal from "@/components/QuickActionModal";
import {
  Sparkles,
  Crown,
  Users,
  Target,
  MessageSquare,
  Download,
  Shirt,
  CheckCircle2,
} from "lucide-react";

export default function ReportsPage() {
  const [activeNavTab, setActiveNavTab] = useState("Reports");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState("This Year 2026");
  const [quickActionType, setQuickActionType] = useState<string | null>(null);
  const [, setSearchQuery] = useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const monthlyAcquisitions = [
    { month: "Jan", count: 42 },
    { month: "Feb", count: 38 },
    { month: "Mar", count: 56 },
    { month: "Apr", count: 64 },
    { month: "May", count: 72 },
    { month: "Jun", count: 58 },
    { month: "Jul", count: 68 },
    { month: "Aug", count: 81 },
    { month: "Sep", count: 33 }, // Current month partial
  ];

  const maxAcquisition = Math.max(...monthlyAcquisitions.map((m) => m.count));

  return (
    <div className="flex min-h-screen bg-[#FAF7F2] text-[#2D142E] font-sans antialiased selection:bg-[#EADBEE] selection:text-[#2D142E] relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-[100] bg-[#2D142E] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#F5CC96]/60 text-xs font-semibold flex items-center gap-3 animate-in slide-in-from-top-3 fade-in duration-300">
          <div className="w-7 h-7 rounded-full bg-[#F5CC96]/20 flex items-center justify-center text-[#F5CC96] shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white block text-xs">{toastMsg}</span>
            <span className="text-[10px] text-[#D2BDD5] font-medium block">Reports & Analytics</span>
          </div>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeNavTab}
        onSelectTab={setActiveNavTab}
        isOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 lg:p-5 space-y-4 max-w-[1440px] mx-auto overflow-y-auto">
        {/* Top Header */}
        <Header
          onSearchChange={setSearchQuery}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white rounded-2xl p-4 border border-[#E9D6EB] shadow-2xs">
          <div>
            <h1 className="font-serif text-xl md:text-2xl font-bold text-[#2D142E]">
              Client Relationship & Loyalty Analytics
            </h1>
            <p className="text-xs text-[#7A5D7C] mt-0.5 font-medium">
              Track 12-dress milestone progression, Elite Circle conversions, and WhatsApp engagement.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-1.5 rounded-full bg-[#FAF6FA] border border-[#E3D0E5] text-xs font-semibold text-[#2D142E] focus:outline-none"
            >
              <option>This Year 2026</option>
              <option>Q3 2026</option>
              <option>Last 12 Months</option>
            </select>

            <button
              onClick={() => showToast("Report PDF Summary generated successfully!")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2D142E] hover:bg-[#471E4A] text-white text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-[#F5CC96]" />
              <span>Export PDF Report</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl p-3.5 border border-[#E8D4EA] shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F4EAF5] flex items-center justify-center text-[#58245D]">
              <Crown className="w-4 h-4 text-[#C7963A]" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#806782] block">Elite Circle Growth</span>
              <span className="text-xl font-bold text-[#2D142E]">+24.2% YoY</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-[#F4E3C1] shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FCF6E7] flex items-center justify-center text-[#C7963A]">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#806782] block">Almost Elite (10-11)</span>
              <span className="text-xl font-bold text-[#2D142E]">31 VIP Candidates</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-[#ECD1EE] shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F8EDF9] flex items-center justify-center text-[#833189]">
              <MessageSquare className="w-4 h-4 text-[#25D366]" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#806782] block">WhatsApp Opened</span>
              <span className="text-xl font-bold text-[#2D142E]">96.4% Response</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-[#E6D4E8] shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F3EBF4] flex items-center justify-center text-[#58245D]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#806782] block">Active Client Retention</span>
              <span className="text-xl font-bold text-[#2D142E]">92.8% Retention</span>
            </div>
          </div>
        </div>

        {/* 2-Column Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 12-Dress Milestone Funnel */}
          <div className="bg-white rounded-2xl p-4 border border-[#E9D6EB] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0E2F1] pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#C7963A]" />
                <h3 className="font-serif font-bold text-sm text-[#2D142E]">
                  12-Dress Milestone Funnel Breakdown
                </h3>
              </div>
              <span className="text-[10px] text-[#8C718F] font-semibold">248 Total Clients</span>
            </div>

            <div className="space-y-3">
              {[
                {
                  stage: "Elite Circle VIP (12+ Dresses)",
                  count: 17,
                  percentage: 7,
                  barColor: "bg-gradient-to-r from-[#D4AF37] to-[#C7963A]",
                  badge: "Unlocked VIP Perks",
                },
                {
                  stage: "Almost Elite (8 - 11 Dresses)",
                  count: 31,
                  percentage: 13,
                  barColor: "bg-gradient-to-r from-[#803186] to-[#682A6E]",
                  badge: "High Conversion Focus",
                },
                {
                  stage: "Loyal Clients (4 - 7 Dresses)",
                  count: 120,
                  percentage: 48,
                  barColor: "bg-[#9B48A3]",
                  badge: "Steady Acquirers",
                },
                {
                  stage: "New & Emerging (1 - 3 Dresses)",
                  count: 80,
                  percentage: 32,
                  barColor: "bg-[#C484CB]",
                  badge: "Welcome Series Active",
                },
              ].map((funnel) => (
                <div key={funnel.stage} className="space-y-1 bg-[#FAF6FA] p-3 rounded-xl border border-[#E8D4EA]">
                  <div className="flex items-center justify-between text-xs font-bold text-[#2D142E]">
                    <span>{funnel.stage}</span>
                    <span className="text-[#682A6E]">{funnel.count} Clients ({funnel.percentage}%)</span>
                  </div>

                  <div className="w-full bg-[#EFE3F1] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${funnel.barColor}`}
                      style={{ width: `${funnel.percentage * 2}%` }}
                    />
                  </div>

                  <span className="text-[9px] text-[#8C718F] font-medium block">
                    Tag: {funnel.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Dress Log Visual Trend */}
          <div className="bg-white rounded-2xl p-4 border border-[#E9D6EB] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0E2F1] pb-3">
              <div className="flex items-center gap-2">
                <Shirt className="w-4 h-4 text-[#803186]" />
                <h3 className="font-serif font-bold text-sm text-[#2D142E]">
                  Monthly Dress Acquisition Log Volume
                </h3>
              </div>
              <span className="text-[10px] text-[#8C718F] font-semibold">2026 Monthly Trend</span>
            </div>

            <div className="h-52 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-[#F0E2F1]">
              {monthlyAcquisitions.map((item) => {
                const heightPercentage = Math.round((item.count / maxAcquisition) * 100);
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-[9px] font-bold text-[#58245D] group-hover:scale-110 transition-transform">
                      {item.count}
                    </span>

                    <div className="w-full bg-[#EFE3F1] h-36 rounded-t-lg flex items-end overflow-hidden p-0.5">
                      <div
                        className="w-full bg-gradient-to-t from-[#2D142E] via-[#682A6E] to-[#9B45A3] rounded-t-md group-hover:brightness-110 transition-all duration-300"
                        style={{ height: `${heightPercentage}%` }}
                      />
                    </div>

                    <span className="text-[10px] font-semibold text-[#8C718F]">{item.month}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-[#7C637E] font-medium">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#C7963A]" /> Peak acquisition month:{" "}
                <strong className="text-[#2D142E]">August (81 Dresses)</strong>
              </span>
              <span className="text-[10px] text-[#8C718F]">Updated Live</span>
            </div>
          </div>
        </div>

        {/* Bottom Section: Preferred Style Distribution */}
        <div className="bg-white rounded-2xl p-4 border border-[#E9D6EB] shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-sm text-[#2D142E]">
            Client Preference Distribution by Dress Style
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { style: "Royal Silk Abayas", share: "42%", count: "104 Clients", color: "bg-[#2D142E] text-white" },
              { style: "Couture Evening Gowns", share: "28%", count: "69 Clients", color: "bg-[#682A6E] text-white" },
              { style: "Imperial Velvet Kaftans", share: "18%", count: "45 Clients", color: "bg-[#9B45A3] text-white" },
              { style: "Bridal & Pearl Veils", share: "12%", count: "30 Clients", color: "bg-[#C484CB] text-[#2D142E]" },
            ].map((pref) => (
              <div
                key={pref.style}
                className="p-4 rounded-2xl bg-[#FAF6FA] border border-[#E8D4EA] flex flex-col justify-between space-y-2"
              >
                <div>
                  <span className="text-xs font-bold text-[#2D142E] block">{pref.style}</span>
                  <span className="text-[10px] text-[#8C718F] font-medium">{pref.count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold font-serif text-[#682A6E]">{pref.share}</span>
                  <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${pref.color}`}>
                    Preference
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={!!quickActionType}
        onClose={() => setQuickActionType(null)}
        actionType={quickActionType}
      />
    </div>
  );
}
