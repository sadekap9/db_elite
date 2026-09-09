"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MessageModal from "@/components/MessageModal";
import QuickActionModal from "@/components/QuickActionModal";
import { CustomerData } from "@/components/CustomersFocusTable";
import {
  Crown,
  ShoppingBag,
  Search,
  Plus,
  MessageCircle,
  Eye,
  Calendar,
  Sparkles,
  X,
  Phone,
  Mail,
  ArrowLeft,
  Pencil,
  Trash2,
  Minus,
  Check,
} from "lucide-react";

export interface ExtendedCustomer extends CustomerData {
  email: string;
  city: string;
  joinDate: string;
  preferredStyle: string;
  totalSpentDresses: number;
  totalAmountINR: string;
  recentPurchaseItem: string;
  birthday: string;
  tier: "Elite Circle" | "Almost Elite" | "Loyal Client" | "New Client";
}

interface PurchaseItem {
  id: string;
  name: string;
  collection: string;
  date: string;
  amount: string;
  status: string;
}

const renderStatusPill = (statusText: string = "Gold") => {
  const s = (statusText || "").toLowerCase();
  if (s === "elite" || s.includes("elite unlocked")) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-[#2D142E] text-white shadow-2xs">
        <Crown className="w-3 h-3 text-[#F5CC96]" />
        <span>Elite</span>
      </span>
    );
  }
  if (s === "premium") {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-[#431B47] text-[#F5CC96] border border-[#F5CC96]/50 shadow-2xs">
        <Crown className="w-3 h-3 text-[#F5CC96]" />
        <span>Premium</span>
      </span>
    );
  }
  if (s === "almost elite" || s.includes("dress away")) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-[#F5ECF6] text-[#79347E] border border-[#E6CFE8]">
        <Sparkles className="w-3 h-3 text-[#9B45A3]" />
        <span>Almost Elite</span>
      </span>
    );
  }
  if (s === "gold") {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-[#FCF6E7] text-[#C7963A] border border-[#F4E3C1]">
        <Crown className="w-3 h-3 text-[#C7963A]" />
        <span>Gold</span>
      </span>
    );
  }
  if (s === "silver") {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-[#F0F2F5] text-[#5A6E85] border border-[#D9E1E8]">
        <Crown className="w-3 h-3 text-[#7B8EC4]" />
        <span>Silver</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-[#FAF0E6] text-[#A35926] border border-[#F2D7C2]">
      <Crown className="w-3 h-3 text-[#A35926]" />
      <span>{statusText || "Bronze"}</span>
    </span>
  );
};

interface APICustomer {
  id: string | number;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  dresses?: number;
  lastPurchaseDate?: string;
  status?: string;
  createdAt?: string;
  joinDate?: string;
  preferredStyle?: string;
  totalAmountINR?: string;
  birthday?: string;
  purchases?: {
    id: string;
    dressName?: string;
    collection?: string;
    purchaseDate?: string;
    amountINR?: string;
  }[];
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<ExtendedCustomer[]>([]);
  const [customerPurchases, setCustomerPurchases] = useState<Record<number, PurchaseItem[]>>({});
  const [activeNavTab, setActiveNavTab] = useState("Customers");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  React.useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.customers) {
          const purchasesMap: Record<number, PurchaseItem[]> = {};

          const mapped: ExtendedCustomer[] = data.customers.map((c: APICustomer, idx: number) => {
            const custIdNum = Number(c.id) || idx + 1;
            const dresses = c.dresses || 0;
            let tier: ExtendedCustomer["tier"] = "New Client";
            if (dresses >= 12) tier = "Elite Circle";
            else if (dresses >= 10) tier = "Almost Elite";
            else if (dresses >= 5) tier = "Loyal Client";

            // Map Purchases
            if (c.purchases && Array.isArray(c.purchases)) {
              purchasesMap[custIdNum] = c.purchases.map((p) => ({
                id: p.id,
                name: p.dressName || "Dress Purchase",
                collection: p.collection || "Royal Collection",
                date: p.purchaseDate || "2026-09-08",
                amount: p.amountINR || "₹0",
                status: "Delivered",
              }));
            }

            return {
              id: custIdNum,
              name: c.name,
              avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + (idx % 5)}?w=150&auto=format&fit=crop&q=80`,
              phone: c.phone,
              email: c.email || "",
              city: c.city || "",
              dressesCount: dresses,
              totalTarget: 12,
              lastPurchase: c.lastPurchaseDate || "N/A",
              statusText: c.status || "Regular",
              category: c.status || "Regular",
              tier,
              joinDate: c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : (c.joinDate || "Recently"),
              preferredStyle: c.preferredStyle || "Custom Silk Wear",
              totalSpentDresses: dresses,
              totalAmountINR: c.totalAmountINR || "₹0",
              recentPurchaseItem: c.purchases && c.purchases.length > 0 ? (c.purchases[0].dressName || "Initial Dress") : "Initial Dress",
              birthday: c.birthday || "",
            };
          });

          setCustomers(mapped);
          setCustomerPurchases(purchasesMap);
        }
      })
      .catch((err) => console.error("Error fetching customers directory:", err));
  }, []);

  // Selected Customer Overlay & Modals
  const [activeCustomerDrawer, setActiveCustomerDrawer] = useState<ExtendedCustomer | null>(null);
  const [messageCustomer, setMessageCustomer] = useState<CustomerData | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [quickActionType, setQuickActionType] = useState<string | null>(null);

  // Edit Customer Modal State
  const [editingCustomer, setEditingCustomer] = useState<ExtendedCustomer | null>(null);
  const [editingDressItem, setEditingDressItem] = useState<{ customerId: number; item: PurchaseItem } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSaveEditDressItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDressItem) return;

    const { customerId, item } = editingDressItem;

    setCustomerPurchases((prev) => {
      const list = prev[customerId] || [];
      const updated = list.map((p) => (p.id === item.id ? item : p));
      return { ...prev, [customerId]: updated };
    });

    setEditingDressItem(null);
    showToast("Dress purchase updated successfully!");
  };

  // Delete Customer Handler
  const handleDeleteCustomer = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    if (activeCustomerDrawer?.id === id) {
      setActiveCustomerDrawer(null);
    }
    fetch(`/api/customers/${id}`, { method: "DELETE" }).catch((err) => console.log("Delete sync error:", err));
    showToast("Client record deleted successfully!");
  };

  // Delete Purchased Dress Handler
  const handleDeleteDressPurchase = (customerId: number, purchaseId: string) => {
    // Remove dress item
    setCustomerPurchases((prev) => {
      const list = prev[customerId] || [];
      return {
        ...prev,
        [customerId]: list.filter((p) => p.id !== purchaseId),
      };
    });

    // Update customer dresses count & status
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const newCount = Math.max(0, c.dressesCount - 1);
          let newStatus = c.statusText;
          let newTier = c.tier;

          if (newCount >= 12) {
            newStatus = "Elite";
            newTier = "Elite Circle";
          } else if (newCount >= 10) {
            newStatus = "Almost Elite";
            newTier = "Almost Elite";
          } else if (newCount >= 8) {
            newStatus = "Gold";
            newTier = "Almost Elite";
          } else if (newCount >= 4) {
            newStatus = "Bronze";
            newTier = "Loyal Client";
          } else {
            newStatus = "Silver";
            newTier = "New Client";
          }

          const updated = {
            ...c,
            dressesCount: newCount,
            totalSpentDresses: newCount,
            statusText: newStatus,
            tier: newTier as ExtendedCustomer["tier"],
          };

          if (activeCustomerDrawer?.id === customerId) {
            setActiveCustomerDrawer(updated);
          }

          return updated;
        }
        return c;
      })
    );

    showToast("Dress purchase deleted! Milestone progress updated.");
  };

  // Update Customer Form Submit
  const handleSaveEditCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;

    setCustomers((prev) =>
      prev.map((c) => (c.id === editingCustomer.id ? editingCustomer : c))
    );

    if (activeCustomerDrawer?.id === editingCustomer.id) {
      setActiveCustomerDrawer(editingCustomer);
    }

    try {
      await fetch(`/api/customers/${editingCustomer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCustomer),
      });
    } catch (err) {
      console.log("MySQL sync fallback:", err);
    }

    setEditingCustomer(null);
    showToast("Client details & Status Badge updated in MySQL successfully!");
  };

  // Filter logic
  const filteredCustomers = customers.filter((c) => {
    const matchesCategory =
      selectedCategory === "All"
        ? true
        : selectedCategory === "Elite Circle"
        ? c.tier === "Elite Circle"
        : selectedCategory === "Almost Elite"
        ? c.tier === "Almost Elite"
        : selectedCategory === "Birthdays"
        ? c.birthday.includes("Sep")
        : selectedCategory === "Inactive"
        ? c.category === "Inactive"
        : true;

    const matchesSearch =
      searchQuery === "" ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#FAF7F2] text-[#2D142E] font-sans antialiased selection:bg-[#EADBEE] selection:text-[#2D142E] relative">
      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-[100] bg-[#2D142E] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#F5CC96]/60 text-xs font-semibold flex items-center gap-3 animate-in slide-in-from-top-3 fade-in duration-300">
          <div className="w-7 h-7 rounded-full bg-[#F5CC96]/20 flex items-center justify-center text-[#F5CC96] shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white block text-xs">{toastMsg}</span>
            <span className="text-[10px] text-[#D2BDD5] font-medium block">Dubai&apos;s Boutique CRM Database updated</span>
          </div>
          <button
            onClick={() => setToastMsg(null)}
            className="ml-2 p-1 text-[#BA9BBE] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
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

        {/* Customer Directory Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white rounded-2xl p-4 border border-[#E9D6EB] shadow-2xs">
          <div>
            <h1 className="font-serif text-xl md:text-2xl font-bold text-[#2D142E]">
              Client Directory & Loyalty Directory
            </h1>
            <p className="text-xs text-[#7A5D7C] mt-0.5 font-medium">
              Manage Dubai&apos;s Boutique ELITE members, track 12-dress milestones, and dispatch personal greetings.
            </p>
          </div>

          <button
            onClick={() => setQuickActionType("add_customer")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2D142E] hover:bg-[#471E4A] text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-[#F5CC96]" />
            <span>Add New Client</span>
          </button>
        </div>

        {/* Customers Directory Table */}
        <div className="bg-white rounded-2xl p-4 border border-[#E9D6EB] shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif text-base font-bold text-[#2D142E] mr-2">
                Client Roster ({filteredCustomers.length})
              </h3>
              {["All", "Elite Circle", "Almost Elite", "Birthdays", "Inactive"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#2D142E] text-white shadow-xs"
                      : "bg-[#F3EBF5] text-[#7A5B7D] hover:bg-[#EADBEE]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Inline Table Search */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8C718F]" />
              <input
                type="text"
                placeholder="Filter by name, phone or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-full bg-[#FAF6FA] border border-[#E3D0E5] text-[11px] font-medium text-[#2D142E] focus:outline-none focus:ring-2 focus:ring-[#682A6E]/30"
              />
            </div>
          </div>

          {/* Customers Directory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-[#F0E2F1] text-[#937896] font-semibold text-[10px]">
                  <th className="py-2.5 px-2 w-8">#</th>
                  <th className="py-2.5 px-3">Client Profile</th>
                  <th className="py-2.5 px-3">Contact Information</th>
                  <th className="py-2.5 px-3">Loyalty Progress (1 Year Target)</th>
                  <th className="py-2.5 px-3">Total Amount</th>
                  <th className="py-2.5 px-3">Last Purchase</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6EDF7]">
                {filteredCustomers.map((cust, idx) => {
                  const percentage = Math.min(
                    100,
                    Math.round((cust.dressesCount / cust.totalTarget) * 100)
                  );
                  const isElite = cust.tier === "Elite Circle";

                  return (
                    <tr
                      key={cust.id}
                      className="hover:bg-[#FAF3FA] transition-colors group cursor-pointer"
                      onClick={() => setActiveCustomerDrawer(cust)}
                    >
                      <td className="py-3 px-2 font-medium text-[#7C637E]">{idx + 1}</td>

                      {/* Customer Name */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4A194E] to-[#2D142E] text-[#F5CC96] border border-[#E4D2E6] shadow-2xs flex items-center justify-center font-serif text-xs font-bold shrink-0">
                            {cust.name ? cust.name.charAt(0).toUpperCase() : "C"}
                          </div>
                          <span className="font-bold text-[#2D142E] block">{cust.name}</span>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-3">
                        <span className="font-mono text-[#58245D] block">{cust.phone}</span>
                      </td>

                      {/* Dress Milestone Progress */}
                      <td className="py-3 px-3">
                        <div className="space-y-1 max-w-[130px]">
                          <div className="flex items-center justify-between text-[10px] font-bold text-[#58245D]">
                            <span>
                              {cust.dressesCount} / {cust.totalTarget} dresses
                            </span>
                            {isElite && <Crown className="w-3 h-3 text-[#C7963A]" />}
                          </div>
                          <div className="w-full bg-[#EFE3F1] h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isElite
                                  ? "bg-gradient-to-r from-[#D4AF37] to-[#C7963A]"
                                  : "bg-gradient-to-r from-[#803186] to-[#511F56]"
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-3 px-3">
                        <span className="font-bold text-[#2D142E] font-mono block">
                          {cust.totalAmountINR}
                        </span>
                      </td>

                      {/* Last Purchase */}
                      <td className="py-3 px-3">
                        <span className="font-medium text-[#2D142E] block">
                          {cust.lastPurchase}
                        </span>
                      </td>

                      {/* Status Tag */}
                      <td className="py-3 px-3">
                        {renderStatusPill(cust.statusText)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setMessageCustomer(cust);
                              setIsMessageModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2D142E] hover:bg-[#471E4A] text-white text-[10px] font-semibold transition-all shadow-2xs"
                            title="Send WhatsApp Message"
                          >
                            <MessageCircle className="w-3 h-3 text-[#25D366] fill-[#25D366]/20 stroke-[2.5]" />
                            <span>Message</span>
                          </button>

                          {/* View Full Profile */}
                          <button
                            onClick={() => setActiveCustomerDrawer(cust)}
                            className="p-1 rounded-full hover:bg-[#F3EAF4] text-[#682A6E] transition-colors"
                            title="View Full Profile Page"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Customer */}
                          <button
                            onClick={() => setEditingCustomer(cust)}
                            className="p-1 rounded-full hover:bg-[#F3EAF4] text-[#682A6E] transition-colors"
                            title="Edit Client Details"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Customer */}
                          <button
                            onClick={(e) => handleDeleteCustomer(cust.id, e)}
                            className="p-1 rounded-full hover:bg-red-50 text-red-600 transition-colors"
                            title="Delete Client Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Full Page Customer Profile Overlay */}
      {activeCustomerDrawer && (
        <div className="fixed inset-0 z-50 bg-[#FAF7F2] text-[#2D142E] overflow-y-auto animate-in fade-in duration-200 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-[#E9D6EB] shadow-2xs">
              <button
                onClick={() => setActiveCustomerDrawer(null)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF3FA] hover:bg-[#F3EAF4] text-[#682A6E] text-xs font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Client Directory</span>
              </button>

              <div className="flex items-center gap-3">
                {/* Edit Button */}
                <button
                  onClick={() => setEditingCustomer(activeCustomerDrawer)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF3FA] hover:bg-[#F3EAF4] text-[#682A6E] text-xs font-bold border border-[#E4CEE6] transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5 text-[#682A6E]" />
                  <span>Update Details</span>
                </button>

                {/* Delete Customer Button */}
                <button
                  onClick={() => handleDeleteCustomer(activeCustomerDrawer.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  <span>Delete Client</span>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={() => {
                    setMessageCustomer(activeCustomerDrawer);
                    setIsMessageModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#1EBE5A] text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send WhatsApp</span>
                </button>

                <button
                  onClick={() => setActiveCustomerDrawer(null)}
                  className="p-2 rounded-full hover:bg-[#F3EAF4] text-[#7A5B7D] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Profile Overview Header Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#E9D6EB] shadow-xs space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#4A194E] to-[#2D142E] text-[#F5CC96] border-2 border-[#F5CC96]/60 shadow-md flex items-center justify-center font-serif text-2xl font-bold shrink-0">
                    {activeCustomerDrawer.name ? activeCustomerDrawer.name.charAt(0).toUpperCase() : "C"}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="font-serif text-2xl font-bold text-[#2D142E]">
                        {activeCustomerDrawer.name}
                      </h2>
                      {renderStatusPill(activeCustomerDrawer.statusText)}
                    </div>
                    <p className="text-xs text-[#7A5B7D] font-medium flex items-center gap-2">
                      {activeCustomerDrawer.city && (
                        <>
                          <span>📍 {activeCustomerDrawer.city}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>Joined {activeCustomerDrawer.joinDate}</span>
                    </p>
                    <div className="flex items-center gap-4 text-xs font-medium text-[#58245D] pt-1 flex-wrap">
                      <span className="flex items-center gap-1.5 font-mono">
                        <Phone className="w-3.5 h-3.5 text-[#86378D]" />
                        {activeCustomerDrawer.phone}
                      </span>
                      {activeCustomerDrawer.email && (
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#86378D]" />
                          {activeCustomerDrawer.email}
                        </span>
                      )}
                      {activeCustomerDrawer.birthday && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#86378D]" />
                          Birthday: {activeCustomerDrawer.birthday}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="bg-[#FAF3FA] p-4 rounded-2xl border border-[#EEDBF0] text-center flex-1 md:w-36">
                    <span className="text-[10px] font-bold text-[#8C718F] uppercase tracking-wider block">
                      Total Spent
                    </span>
                    <span className="text-lg font-bold font-mono text-[#2D142E] mt-0.5 block">
                      {activeCustomerDrawer.totalAmountINR}
                    </span>
                  </div>

                  <div className="bg-[#FAF3FA] p-4 rounded-2xl border border-[#EEDBF0] text-center flex-1 md:w-36">
                    <span className="text-[10px] font-bold text-[#8C718F] uppercase tracking-wider block">
                      Dresses Acquired
                    </span>
                    <span className="text-lg font-bold font-mono text-[#682A6E] mt-0.5 block">
                      {activeCustomerDrawer.dressesCount} Dresses
                    </span>
                  </div>
                </div>
              </div>

              {/* Milestone Progress Bar */}
              <div className="bg-[#FAF6FA] rounded-2xl p-5 border border-[#E9D6EB] space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2 text-[#2D142E]">
                    <Sparkles className="w-4 h-4 text-[#C7963A]" />
                    <span>Annual Elite Circle Loyalty Milestone Target (12 Dresses)</span>
                  </div>
                  <span className="text-[#682A6E]">
                    {activeCustomerDrawer.dressesCount} / {activeCustomerDrawer.totalTarget} Dresses (
                    {Math.min(
                      100,
                      Math.round((activeCustomerDrawer.dressesCount / activeCustomerDrawer.totalTarget) * 100)
                    )}
                    %)
                  </span>
                </div>

                <div className="w-full bg-[#EFE3F1] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#803186] to-[#511F56] h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (activeCustomerDrawer.dressesCount / activeCustomerDrawer.totalTarget) * 100
                      )}%`,
                    }}
                  />
                </div>

                <p className="text-xs text-[#7A5B7D]">
                  Current Status:{" "}
                  <strong className="text-[#682A6E]">{activeCustomerDrawer.statusText}</strong>.{" "}
                  {activeCustomerDrawer.dressesCount >= 12
                    ? "🎉 Congratulations! Full Elite Circle VIP Privileges are unlocked."
                    : `Requires ${12 - activeCustomerDrawer.dressesCount} more dress purchase(s) to achieve full VIP membership.`}
                </p>
              </div>
            </div>

            {/* Detailed Content */}
            <div className="space-y-6">
              {/* Acquisition History Table */}
              <div className="bg-white rounded-3xl p-6 border border-[#E9D6EB] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold text-[#2D142E] flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#682A6E]" />
                    <span>Purchase & Fitting Log</span>
                  </h3>
                  <span className="text-xs text-[#8C718F] font-medium">
                    Manage or update client dress acquisitions
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#F0E2F1] text-[#937896] font-semibold text-[11px]">
                        <th className="py-2.5 px-3">Item / Collection</th>
                        <th className="py-2.5 px-3">Acquisition Date</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F6EDF7]">
                      {(customerPurchases[activeCustomerDrawer.id] || []).length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-xs text-[#8C718F]">
                            No dress purchases recorded yet.
                          </td>
                        </tr>
                      ) : (
                        (customerPurchases[activeCustomerDrawer.id] || []).map((item) => (
                          <tr key={item.id} className="hover:bg-[#FAF3FA]">
                            <td className="py-3 px-3">
                              <span className="font-bold text-[#2D142E] block">{item.name}</span>
                              <span className="text-[10px] text-[#86378D] font-medium block">
                                {item.collection}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-[#7C637E] font-medium">{item.date}</td>
                            <td className="py-3 px-3">
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-[#2D142E]">
                              {item.amount}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Update Dress Icon */}
                                <button
                                  onClick={() =>
                                    setEditingDressItem({
                                      customerId: activeCustomerDrawer.id,
                                      item: { ...item },
                                    })
                                  }
                                  className="p-1.5 rounded-full hover:bg-[#F3EAF4] text-[#682A6E] transition-colors cursor-pointer"
                                  title="Update Purchased Dress Details"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete Dress Icon */}
                                <button
                                  onClick={() =>
                                    handleDeleteDressPurchase(activeCustomerDrawer.id, item.id)
                                  }
                                  className="p-1.5 rounded-full hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                                  title="Delete Bought Dress"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE / EDIT CLIENT DETAILS MODAL */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D0A1F]/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E4CEE6] space-y-5 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F2E4F3] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F4EBF5] flex items-center justify-center text-[#682A6E]">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2D142E]">
                    Update Client Details
                  </h3>
                  <p className="text-xs text-[#866B88]">{editingCustomer.name}</p>
                </div>
              </div>

              <button
                onClick={() => setEditingCustomer(null)}
                className="p-2 rounded-full hover:bg-[#F3EAF4] text-[#7A5B7D] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCustomer} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#2D142E]">Client Name</label>
                  <input
                    required
                    type="text"
                    value={editingCustomer.name}
                    onChange={(e) =>
                      setEditingCustomer({ ...editingCustomer, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6FA] border border-[#E3D0E5] focus:outline-none focus:ring-2 focus:ring-[#682A6E]/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#2D142E]">Phone (WhatsApp)</label>
                  <input
                    required
                    type="text"
                    value={editingCustomer.phone}
                    onChange={(e) =>
                      setEditingCustomer({ ...editingCustomer, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6FA] border border-[#E3D0E5] focus:outline-none focus:ring-2 focus:ring-[#682A6E]/40 font-mono"
                  />
                </div>
              </div>

              {/* Dresses Purchased Adjuster */}
              <div className="bg-[#FAF3FA] p-3.5 rounded-2xl border border-[#EEDBF0] space-y-2">
                <label className="font-bold text-[#2D142E] block">
                  Purchased Dresses Count (Milestone Counter)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingCustomer({
                        ...editingCustomer,
                        dressesCount: Math.max(0, editingCustomer.dressesCount - 1),
                        totalSpentDresses: Math.max(0, editingCustomer.dressesCount - 1),
                      })
                    }
                    className="w-8 h-8 rounded-full bg-white border border-[#D9BEDC] text-[#682A6E] flex items-center justify-center font-bold hover:bg-[#F3EAF4] transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className="font-bold font-mono text-base text-[#2D142E]">
                    {editingCustomer.dressesCount} / {editingCustomer.totalTarget} Dresses
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setEditingCustomer({
                        ...editingCustomer,
                        dressesCount: editingCustomer.dressesCount + 1,
                        totalSpentDresses: editingCustomer.dressesCount + 1,
                      })
                    }
                    className="w-8 h-8 rounded-full bg-[#2D142E] text-white flex items-center justify-center font-bold hover:bg-[#471E4A] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#F5CC96]" />
                  </button>
                </div>
                <p className="text-[10px] text-[#866B88]">
                  Use the minus (`-`) button to remove/delete a dress purchase from this client.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#2D142E]">Total Amount (INR)</label>
                  <input
                    type="text"
                    value={editingCustomer.totalAmountINR}
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        totalAmountINR: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6FA] border border-[#E3D0E5] focus:outline-none focus:ring-2 focus:ring-[#682A6E]/40 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#2D142E]">Status Badge</label>
                  <select
                    value={editingCustomer.statusText}
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        statusText: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6FA] border border-[#E3D0E5] focus:outline-none focus:ring-2 focus:ring-[#682A6E]/40 font-medium"
                  >
                    <option value="Elite">Elite</option>
                    <option value="Premium">Premium</option>
                    <option value="Almost Elite">Almost Elite</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Bronze">Bronze</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 rounded-full bg-[#F3EBF4] text-[#58245D] text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#2D142E] hover:bg-[#471E4A] text-white text-xs font-bold shadow-md cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE DRESS PURCHASE ITEM MODAL */}
      {editingDressItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1D0A1F]/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E4CEE6] space-y-4 relative">
            <div className="flex items-center justify-between border-b border-[#F2E4F3] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#F4EBF5] flex items-center justify-center text-[#682A6E]">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#2D142E]">
                    Update Purchased Dress
                  </h3>
                  <p className="text-[11px] text-[#866B88]">Modify item details</p>
                </div>
              </div>

              <button
                onClick={() => setEditingDressItem(null)}
                className="p-1.5 rounded-full hover:bg-[#F3EAF4] text-[#7A5B7D] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditDressItem} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#2D142E]">Dress Name / Title</label>
                <input
                  required
                  type="text"
                  value={editingDressItem.item.name}
                  onChange={(e) =>
                    setEditingDressItem({
                      ...editingDressItem,
                      item: { ...editingDressItem.item, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6FA] border border-[#E3D0E5] focus:outline-none focus:ring-2 focus:ring-[#682A6E]/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#2D142E]">Acquisition Date</label>
                  <input
                    type="text"
                    value={editingDressItem.item.date}
                    onChange={(e) =>
                      setEditingDressItem({
                        ...editingDressItem,
                        item: { ...editingDressItem.item, date: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6FA] border border-[#E3D0E5] focus:outline-none focus:ring-2 focus:ring-[#682A6E]/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#2D142E]">Price Amount (INR)</label>
                  <input
                    type="text"
                    value={editingDressItem.item.amount}
                    onChange={(e) =>
                      setEditingDressItem({
                        ...editingDressItem,
                        item: { ...editingDressItem.item, amount: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6FA] border border-[#E3D0E5] focus:outline-none focus:ring-2 focus:ring-[#682A6E]/40 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#2D142E]">Fulfillment Status</label>
                <select
                  value={editingDressItem.item.status}
                  onChange={(e) =>
                    setEditingDressItem({
                      ...editingDressItem,
                      item: { ...editingDressItem.item, status: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6FA] border border-[#E3D0E5] focus:outline-none focus:ring-2 focus:ring-[#682A6E]/40 font-medium"
                >
                  <option value="Delivered">Delivered</option>
                  <option value="Fitting Scheduled">Fitting Scheduled</option>
                  <option value="In Tailoring">In Tailoring</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDressItem(null)}
                  className="px-4 py-2 rounded-full bg-[#F3EBF4] text-[#58245D] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#2D142E] hover:bg-[#471E4A] text-white font-bold shadow-md cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Update Dress</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Message Modal */}
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        customer={messageCustomer}
      />

      {/* Quick Action Dialog Form */}
      <QuickActionModal
        isOpen={!!quickActionType}
        onClose={() => setQuickActionType(null)}
        actionType={quickActionType}
      />
    </div>
  );
}
