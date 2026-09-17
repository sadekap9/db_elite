"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import EliteBanner from "@/components/EliteBanner";
import MessageModal from "@/components/MessageModal";
import QuickActionModal from "@/components/QuickActionModal";
import { CustomerData } from "@/components/CustomersFocusTable";
import {
  Crown,
  Sparkles,
  Gift,
  Award,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

export default function LoyaltyProgramPage() {
  const [activeNavTab, setActiveNavTab] = useState("Loyalty Program");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [messageCustomer, setMessageCustomer] = useState<CustomerData | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [quickActionType, setQuickActionType] = useState<string | null>(null);
  const [milestoneClients, setMilestoneClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  React.useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.customers) {
          const sorted = [...data.customers].sort((a: any, b: any) => (b.dresses || 0) - (a.dresses || 0));
          const mapped = sorted.map((c: any, idx: number) => {
            const dresses = c.dresses || 0;
            const isElite = dresses >= 12;
            return {
              rank: idx + 1,
              id: c.id,
              name: c.name,
              avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + (idx % 5)}?w=150&auto=format&fit=crop&q=80`,
              phone: c.phone,
              dressesCount: dresses,
              target: 12,
              tier: isElite ? "ELITE CIRCLE VIP" : c.status === "Almost Elite" ? "Almost Elite" : c.status || "Regular",
              status: isElite ? "Privilege Unlocked" : `${Math.max(0, 12 - dresses)} dress away`,
            };
          });
          setMilestoneClients(mapped);
        }
      })
      .catch((err) => console.error("Error fetching milestone clients:", err))
      .finally(() => setLoading(false));
  }, []);

  const perks = [
    {
      title: "VIP Collection Preview",
      desc: "Private 7-day early access to all seasonal silk and velvet releases.",
      icon: Crown,
    },
    {
      title: "Complimentary Tailoring",
      desc: "Bespoke fitting sessions with master artisans for every acquisition.",
      icon: Award,
    },
    {
      title: "Private Lounge Access",
      desc: "Exclusive access to Dubai's Boutique ELITE private fitting lounge.",
      icon: Sparkles,
    },
    {
      title: "Anniversary Celebration",
      desc: "Custom anniversary luxury gift voucher delivered annually.",
      icon: Gift,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#FAF7F2] text-[#2D142E] font-sans antialiased selection:bg-[#EADBEE] selection:text-[#2D142E] relative">
      <Sidebar
        activeTab={activeNavTab}
        onSelectTab={setActiveNavTab}
        isOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      <main className="flex-1 min-w-0 p-4 lg:p-5 space-y-4 max-w-[1440px] mx-auto overflow-y-auto">
        <Header
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        {/* Hero Banner */}
        <EliteBanner
          onViewDetails={() => {
            setQuickActionType("view_almost_elite");
          }}
        />

        {/* 4 Loyalty Perks Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {perks.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-[#E9D6EB] shadow-2xs space-y-2 hover:shadow-xs transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-[#FCF6E7] flex items-center justify-center text-[#C7963A] border border-[#F4E3C1]">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-sm text-[#2D142E]">
                  {p.title}
                </h3>
                <p className="text-[11px] text-[#7A5D7C] leading-normal font-medium">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Leaderboard & Milestone Table */}
        <div className="bg-white rounded-2xl p-4 border border-[#E9D6EB] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#FCF6E7] flex items-center justify-center text-[#C7963A]">
                <Crown className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#2D142E]">
                Elite Circle Milestone Leaderboard (12 Dresses / 1 Year)
              </h3>
            </div>

            <button
              onClick={() => setQuickActionType("view_almost_elite")}
              className="text-[11px] font-semibold text-[#86378D] hover:text-[#58245D] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All 31 Almost Elite</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Mobile View Cards (<640px) */}
          <div className="block sm:hidden space-y-3">
            {milestoneClients.map((m) => {
              const percentage = Math.min(100, Math.round((m.dressesCount / m.target) * 100));
              const isUnlocked = m.dressesCount >= m.target;
              return (
                <div
                  key={m.rank}
                  className="bg-[#FAF6FA] border border-[#F0E2F1] rounded-xl p-3.5 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#58245D]">#{m.rank} Rank</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                        isUnlocked
                          ? "bg-[#FCF6E7] text-[#C7963A] border-[#F4E3C1]"
                          : "bg-[#F5ECF6] text-[#79347E] border-[#E6CFE8]"
                      }`}
                    >
                      {m.tier}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 pt-1 border-t border-[#F0E2F1]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.avatarUrl}
                      alt={m.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#E4D2E6] shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-[#2D142E]">{m.name}</h4>
                      <p className="text-[10px] text-[#8C718F] font-mono">{m.phone}</p>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-[#EADBEE] space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#58245D]">
                      <span>12-Dress Milestone</span>
                      <span>{m.dressesCount} / {m.target} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-[#EFE3F1] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isUnlocked
                            ? "bg-gradient-to-r from-[#D4AF37] to-[#C7963A]"
                            : "bg-gradient-to-r from-[#803186] to-[#511F56]"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-[#682A6E] font-semibold text-right pt-0.5">
                      {m.status}
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => {
                        setMessageCustomer({
                          id: m.rank,
                          name: m.name,
                          phone: m.phone,
                          dressesCount: m.dressesCount,
                          totalTarget: m.target,
                          lastPurchase: "Recent",
                          statusText: m.status,
                          category: "Almost Elite",
                        });
                        setIsMessageModalOpen(true);
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2D142E] text-white text-[11px] font-semibold"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366]/20" />
                      <span>Dispatch Message</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (>=640px) */}
          <div className="hidden sm:block overflow-x-auto -mx-1 px-1">
            <table className="w-full min-w-[700px] text-left text-[11px]">
              <thead>
                <tr className="border-b border-[#F0E2F1] text-[#937896] font-semibold text-[10px]">
                  <th className="py-2.5 px-2 w-8">Rank</th>
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">12-Dress Milestone Progress</th>
                  <th className="py-2.5 px-3">Tier</th>
                  <th className="py-2.5 px-3">Privilege Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6EDF7]">
                {milestoneClients.map((m) => {
                  const percentage = Math.min(100, Math.round((m.dressesCount / m.target) * 100));
                  const isUnlocked = m.dressesCount >= m.target;

                  return (
                    <tr key={m.rank} className="hover:bg-[#FAF3FA] transition-colors">
                      <td className="py-3 px-2 font-bold text-[#58245D]">#{m.rank}</td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={m.avatarUrl}
                            alt={m.name}
                            className="w-8 h-8 rounded-full object-cover border border-[#E4D2E6]"
                          />
                          <span className="font-bold text-[#2D142E]">{m.name}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-[#7C637E] font-mono">{m.phone}</td>

                      <td className="py-3 px-3">
                        <div className="space-y-1 max-w-[130px]">
                          <div className="flex items-center justify-between text-[10px] font-bold text-[#58245D]">
                            <span>{m.dressesCount} / {m.target} dresses</span>
                            <span>{percentage}%</span>
                          </div>
                          <div className="w-full bg-[#EFE3F1] h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isUnlocked
                                  ? "bg-gradient-to-r from-[#D4AF37] to-[#C7963A]"
                                  : "bg-gradient-to-r from-[#803186] to-[#511F56]"
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                            isUnlocked
                              ? "bg-[#FCF6E7] text-[#C7963A] border-[#F4E3C1]"
                              : "bg-[#F5ECF6] text-[#79347E] border-[#E6CFE8]"
                          }`}
                        >
                          {m.tier}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-medium text-[#682A6E]">
                        {m.status}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setMessageCustomer({
                              id: m.rank,
                              name: m.name,
                              phone: m.phone,
                              dressesCount: m.dressesCount,
                              totalTarget: m.target,
                              lastPurchase: "Recent",
                              statusText: m.status,
                              category: "Almost Elite",
                            });
                            setIsMessageModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#2D142E] hover:bg-[#471E4A] text-white text-[10px] font-semibold transition-all shadow-2xs cursor-pointer"
                        >
                          <MessageCircle className="w-3 h-3 text-[#25D366] fill-[#25D366]/20 stroke-[2.5]" />
                          <span>Dispatch Message</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        customer={messageCustomer}
      />

      <QuickActionModal
        isOpen={!!quickActionType}
        onClose={() => setQuickActionType(null)}
        actionType={quickActionType}
      />
    </div>
  );
}
