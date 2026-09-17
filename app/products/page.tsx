"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MessageModal from "@/components/MessageModal";
import QuickActionModal from "@/components/QuickActionModal";
import { CustomerData } from "@/components/CustomersFocusTable";
import {
  Shirt,
  Sparkles,
  Plus,
  Search,
  Crown,
  Eye,
  ShoppingBag,
  Tag,
  CheckCircle2,
  AlertCircle,
  Filter,
  Users,
} from "lucide-react";

interface DressProduct {
  id: string;
  name: string;
  sku: string;
  category: "Royal Abayas" | "Velvet Kaftans" | "Couture Gowns" | "Veils" | "Silk Kimonos";
  imageUrl: string;
  stockCount: number;
  acquisitionsCount: number;
  fabric: string;
  milestonePoints: number; // +1 dress towards 12-dress goal
  status: "In Stock" | "Low Stock" | "Bespoke Order";
  topClient: string;
}

const dressInventory: DressProduct[] = [];

export default function ProductsPage() {
  const [activeNavTab, setActiveNavTab] = useState("Products");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [messageCustomer, setMessageCustomer] = useState<CustomerData | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [quickActionType, setQuickActionType] = useState<string | null>(null);
  const [selectedDressDetail, setSelectedDressDetail] = useState<DressProduct | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  const filteredDresses = dressInventory.filter((d) => {
    const matchesCategory = selectedCategory === "All" || d.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.fabric.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalStock = dressInventory.reduce((acc, d) => acc + (d.stockCount || 0), 0);
  const totalAcquisitions = dressInventory.reduce((acc, d) => acc + (d.acquisitionsCount || 0), 0);
  const topProduct = dressInventory.length > 0 ? dressInventory[0].name : "None yet";

  return (
    <div className="flex min-h-screen bg-[#FAF7F2] text-[#2D142E] font-sans antialiased selection:bg-[#EADBEE] selection:text-[#2D142E] relative">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeNavTab}
        onSelectTab={setActiveNavTab}
        isOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-3 sm:p-4 lg:p-5 space-y-3.5 sm:space-y-4 max-w-[1440px] mx-auto overflow-y-auto">
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
              Boutique Dress Collections & Atelier Catalog
            </h1>
            <p className="text-xs text-[#7A5D7C] mt-0.5 font-medium">
              Explore exclusive hand-crafted dress designs contributing to client 12-dress annual milestones.
            </p>
          </div>

          <button
            onClick={() => setQuickActionType("log_purchase")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2D142E] hover:bg-[#471E4A] text-white text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-[#F5CC96]" />
            <span>Add New Design</span>
          </button>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl p-3.5 border border-[#E8D4EA] shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F4EAF5] flex items-center justify-center text-[#58245D]">
              <Shirt className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#806782] block">Total Collections</span>
              <span className="text-xl font-bold text-[#2D142E]">{dressInventory.length} Items</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-[#F4E3C1] shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FCF6E7] flex items-center justify-center text-[#C7963A]">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#806782] block">Most Loved Design</span>
              <span className="text-sm font-bold text-[#2D142E]">{topProduct}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-[#ECD1EE] shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F8EDF9] flex items-center justify-center text-[#833189]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#806782] block">Atelier Stock</span>
              <span className="text-xl font-bold text-[#2D142E]">{totalStock} Available</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-[#E6D4E8] shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F3EBF4] flex items-center justify-center text-[#58245D]">
              <Users className="w-4 h-4 text-[#803186]" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#806782] block">Total Acquisitions</span>
              <span className="text-xl font-bold text-[#2D142E]">{totalAcquisitions} Acquired</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-[#E9D6EB] shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
              {[
                { id: "All", label: "All Collections" },
                { id: "Royal Abayas", label: "Royal Abayas" },
                { id: "Velvet Kaftans", label: "Velvet Kaftans" },
                { id: "Couture Gowns", label: "Couture Gowns" },
                { id: "Veils", label: "Bridal Veils" },
                { id: "Silk Kimonos", label: "Silk Kimonos" },
              ].map((tab) => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#2D142E] text-white shadow-2xs"
                        : "bg-[#F4EBF5] text-[#6E4F71] hover:bg-[#EADBEE]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8C718F]" />
              <input
                type="text"
                placeholder="Search design, SKU or fabric..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-full bg-[#FAF6FA] border border-[#E3D0E5] text-[11px] font-medium text-[#2D142E] focus:outline-none focus:ring-2 focus:ring-[#682A6E]/30"
              />
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDresses.length === 0 ? (
              <div className="py-12 text-center col-span-full space-y-3 bg-[#FAF6FA] rounded-2xl border border-dashed border-[#E3D0E5]">
                <Shirt className="w-10 h-10 text-[#8C718F] mx-auto opacity-50" />
                <h4 className="font-bold text-sm text-[#2D142E]">No dress designs found</h4>
                <p className="text-xs text-[#7C637E] max-w-sm mx-auto">
                  No dress designs exist in the catalog yet. Click &quot;Add New Design&quot; to add your first luxury piece.
                </p>
              </div>
            ) : (
              filteredDresses.map((dress) => (
                <div
                  key={dress.id}
                  onClick={() => setSelectedDressDetail(dress)}
                  className="bg-[#FAF6FA] hover:bg-[#F5ECF6] rounded-2xl p-4 border border-[#E8D4EA] hover:border-[#D5B5DC] transition-all cursor-pointer flex flex-col justify-between space-y-3 group shadow-2xs"
                >
                  <div className="space-y-3">
                    {/* Image & Status Tag */}
                    <div className="relative h-48 rounded-xl overflow-hidden bg-[#E8D4EA]">
                      <img
                        src={dress.imageUrl}
                        alt={dress.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1D0A1F]/70 via-transparent to-transparent" />

                      <div className="absolute top-2.5 left-2.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold border backdrop-blur-xs ${
                            dress.status === "In Stock"
                              ? "bg-[#EAF5EC]/90 text-[#277D43] border-[#CEEAD4]"
                              : dress.status === "Low Stock"
                              ? "bg-[#FFF4E5]/90 text-[#B76E00] border-[#FFE2B8]"
                              : "bg-[#F8EDF9]/90 text-[#682A6E] border-[#EAD0EC]"
                          }`}
                        >
                          {dress.status}
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[10px]">
                        <span className="font-mono bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                          {dress.sku}
                        </span>
                        <span className="font-bold text-[#F5CC96] bg-[#2D142E]/80 px-2 py-0.5 rounded-md backdrop-blur-xs">
                          +1 Dress Milestone
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-sm text-[#2D142E] group-hover:text-[#682A6E] transition-colors">
                        {dress.name}
                      </h3>
                      <p className="text-[11px] text-[#7C637E] mt-0.5 line-clamp-1">{dress.fabric}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#EADBEE] space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#8C718F] font-medium">Acquired by Clients:</span>
                      <span className="font-bold text-[#2D142E]">{dress.acquisitionsCount} times</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#8C718F] font-medium">Available Stock:</span>
                      <span className="font-bold text-[#682A6E]">{dress.stockCount} units</span>
                    </div>

                    <div className="pt-1 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickActionType("log_purchase");
                        }}
                        className="flex-1 py-1.5 rounded-full bg-[#2D142E] hover:bg-[#471E4A] text-white text-[11px] font-bold shadow-2xs transition-all cursor-pointer"
                      >
                        Log Client Acquisition
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
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
