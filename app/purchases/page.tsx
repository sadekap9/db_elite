"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MessageModal from "@/components/MessageModal";
import QuickActionModal from "@/components/QuickActionModal";
import { CustomerData } from "@/components/CustomersFocusTable";
import {
  ShoppingBag,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageCircle,
  Shirt,
} from "lucide-react";

interface PurchaseRecord {
  id: string;
  customerName: string;
  avatarUrl: string;
  phone: string;
  dressName: string;
  collection: string;
  date: string;
  milestoneImpact: string; // e.g. "+1 Dress (11/12 Total)"
  status: "Delivered" | "Fitting Scheduled" | "In Tailoring";
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [activeNavTab, setActiveNavTab] = useState("Purchases");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [messageCustomer, setMessageCustomer] = useState<CustomerData | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [quickActionType, setQuickActionType] = useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  React.useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.customers) {
          const list: PurchaseRecord[] = [];
          data.customers.forEach((c: { id: string | number; name: string; phone: string; dresses?: number; purchases?: Array<{ id?: string; dressName?: string; collection?: string; purchaseDate?: string; qty?: number }> }, idx: number) => {
            if (c.purchases && Array.isArray(c.purchases)) {
              c.purchases.forEach((p: { id?: string; dressName?: string; collection?: string; purchaseDate?: string; qty?: number }, pIdx: number) => {
                list.push({
                  id: p.id || `PUR-${c.id}-${pIdx + 1}`,
                  customerName: c.name,
                  avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + (idx % 5)}?w=150&auto=format&fit=crop&q=80`,
                  phone: c.phone,
                  dressName: p.dressName || "Dress Purchase",
                  collection: p.collection || "Royal Collection",
                  date: p.purchaseDate || "2026-09-08",
                  milestoneImpact: `+${p.qty || 1} Dress (${c.dresses || 1}/12 Total)`,
                  status: "Delivered",
                });
              });
            }
          });
          setPurchases(list);
        }
      })
      .catch((err) => console.error("Error fetching purchases:", err));
  }, []);

  const filteredPurchases = purchases.filter((p) => {
    const matchesStatus =
      selectedStatus === "All" ? true : p.status === selectedStatus;
    const matchesSearch =
      searchQuery === "" ||
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.dressName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
          onSearchChange={setSearchQuery}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        {/* Page Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white rounded-2xl p-4 border border-[#E9D6EB] shadow-2xs">
          <div>
            <h1 className="font-serif text-xl md:text-2xl font-bold text-[#2D142E]">
              Dress Purchases & Milestone Log
            </h1>
            <p className="text-xs text-[#7A5D7C] mt-0.5 font-medium">
              Record client dress acquisitions to automatically advance 12-dress Elite Circle progress.
            </p>
          </div>

          <button
            onClick={() => setQuickActionType("add_purchase")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2D142E] hover:bg-[#471E4A] text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-[#F5CC96]" />
            <span>Record New Purchase</span>
          </button>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl p-3.5 border border-[#E8D4EA] shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F4EAF5] flex items-center justify-center text-[#58245D]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#806782] block">Total Dresses Acquired</span>
              <span className="text-xl font-bold text-[#2D142E]">412 Dresses</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-[#E8D4EA] shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F8EDF9] flex items-center justify-center text-[#833189]">
              <Shirt className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#806782] block">This Month&apos;s Acquisitions</span>
              <span className="text-xl font-bold text-[#2D142E]">38 Dresses</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-[#F4E3C1] shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FCF6E7] flex items-center justify-center text-[#C7963A]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#806782] block">Fittings Scheduled</span>
              <span className="text-xl font-bold text-[#2D142E]">12 Scheduled</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-[#E8D4EA] shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F3EBF4] flex items-center justify-center text-[#58245D]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#806782] block">Avg Dresses Per Client</span>
              <span className="text-xl font-bold text-[#2D142E]">8.4 Dresses</span>
            </div>
          </div>
        </div>

        {/* Purchases Table Container */}
        <div className="bg-white rounded-2xl p-4 border border-[#E9D6EB] shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
              {["All", "Delivered", "Fitting Scheduled", "In Tailoring"].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedStatus === st
                      ? "bg-[#2D142E] text-white shadow-2xs"
                      : "bg-[#F4EBF5] text-[#6E4F71] hover:bg-[#EADBEE]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8C718F]" />
              <input
                type="text"
                placeholder="Search purchase or dress..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-full bg-[#FAF6FA] border border-[#E3D0E5] text-[11px] font-medium text-[#2D142E] focus:outline-none focus:ring-2 focus:ring-[#682A6E]/30"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-[#F0E2F1] text-[#937896] font-semibold text-[10px]">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3">Dress & Collection</th>
                  <th className="py-2.5 px-3">Acquisition Date</th>
                  <th className="py-2.5 px-3">Milestone Progress</th>
                  <th className="py-2.5 px-3">Fulfillment Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6EDF7]">
                {filteredPurchases.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#FAF3FA] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#58245D]">{rec.id}</td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4A194E] to-[#2D142E] text-[#F5CC96] border border-[#E4D2E6] shadow-2xs flex items-center justify-center font-serif text-xs font-bold shrink-0">
                          {rec.customerName ? rec.customerName.charAt(0).toUpperCase() : "C"}
                        </div>
                        <div>
                          <span className="font-bold text-[#2D142E] block">{rec.customerName}</span>
                          <span className="text-[9px] text-[#8C718F] font-mono">{rec.phone}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-bold text-[#2D142E] block">{rec.dressName}</span>
                      <span className="text-[9px] text-[#86378D] font-medium block">{rec.collection}</span>
                    </td>

                    <td className="py-3 px-3 text-[#7C637E] font-medium">{rec.date}</td>

                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 font-bold text-[#682A6E] bg-[#F5ECF6] px-2.5 py-0.5 rounded-full text-[10px] border border-[#E6CFE8]">
                        <Sparkles className="w-2.5 h-2.5 text-[#C7963A]" />
                        {rec.milestoneImpact}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                          rec.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : rec.status === "Fitting Scheduled"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setMessageCustomer({
                            id: 1,
                            name: rec.customerName,
                            phone: rec.phone,
                            dressesCount: 11,
                            totalTarget: 12,
                            lastPurchase: rec.date,
                            statusText: rec.milestoneImpact,
                            category: "Almost Elite",
                          });
                          setIsMessageModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#2D142E] hover:bg-[#471E4A] text-white text-[10px] font-semibold transition-all shadow-2xs"
                      >
                        <MessageCircle className="w-3 h-3 text-[#25D366] fill-[#25D366]/20 stroke-[2.5]" />
                        <span>Confirm Update</span>
                      </button>
                    </td>
                  </tr>
                ))}
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
