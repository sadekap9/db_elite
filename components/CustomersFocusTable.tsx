"use client";

import React from "react";
import { Target, ArrowRight, MessageCircle, Crown, Sparkles } from "lucide-react";

export interface CustomerData {
  id: number;
  name: string;
  avatarUrl?: string;
  phone: string;
  dressesCount: number;
  totalTarget: number;
  totalAmountINR?: string;
  lastPurchase?: string;
  statusText?: string;
  statusBadge?: string;
  category?: "Almost Elite" | "Inactive" | "Recently Added" | string;
}

interface CustomersFocusTableProps {
  onOpenMessageModal?: (customer: CustomerData) => void;
  searchQuery?: string;
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
      <span>Bronze</span>
    </span>
  );
};

export default function CustomersFocusTable({
  onOpenMessageModal,
  searchQuery = "",
}: CustomersFocusTableProps) {
  const [customers, setCustomers] = React.useState<CustomerData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.customers) {
          const mapped: CustomerData[] = json.customers.map((c: { id: number; name: string; phone: string; dresses?: number; totalAmountINR?: string; lastPurchaseDate?: string; status?: string }, idx: number) => ({
            id: c.id,
            name: c.name,
            avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + (idx % 5)}?w=150&auto=format&fit=crop&q=80`,
            phone: c.phone,
            dressesCount: c.dresses || 0,
            totalTarget: 12,
            totalAmountINR: c.totalAmountINR || "₹0",
            lastPurchase: c.lastPurchaseDate || "N/A",
            statusText: c.status || "Regular",
            category: c.status || "Regular",
          }));
          setCustomers(mapped);
        }
      })
      .catch((err) => console.error("Error fetching customers:", err))
      .finally(() => setLoading(false));
  }, []);

  // Filter customers
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      searchQuery === "" ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);

    return matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E9D6EB] shadow-2xs space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#F3EBF4] flex items-center justify-center text-[#58245D]">
            <Target className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-serif text-base font-bold text-[#2D142E]">
            Customers to Focus On
          </h3>
        </div>

        <button className="text-[11px] font-semibold text-[#86378D] hover:text-[#58245D] flex items-center gap-1 transition-colors cursor-pointer">
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-8 text-center text-xs font-semibold text-[#7C637E] animate-pulse">
            Loading customers from Firestore...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-8 text-center text-xs font-semibold text-[#7C637E]">
            No customers found matching your criteria.
          </div>
        ) : (
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-[#F0E2F1] text-[#937896] font-semibold text-[10px]">
                <th className="py-2 px-1.5 w-6">#</th>
                <th className="py-2 px-2.5">Customer</th>
                <th className="py-2 px-2.5">Phone</th>
                <th className="py-2 px-2.5">Dresses (1 Year)</th>
                <th className="py-2 px-2.5">Total Amount</th>
                <th className="py-2 px-2.5">Last Purchase</th>
                <th className="py-2 px-2.5">Status</th>
                <th className="py-2 px-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F6EDF7]">
              {filteredCustomers.map((cust, index) => {
                const percentage = Math.min(
                  100,
                  Math.round((cust.dressesCount / cust.totalTarget) * 100)
                );
                return (
                  <tr
                    key={cust.id}
                    className="hover:bg-[#FAF3FA] transition-colors group"
                  >
                    {/* Index */}
                    <td className="py-2.5 px-1.5 font-medium text-[#7C637E]">
                      {index + 1}
                    </td>

                    {/* Customer Info */}
                    <td className="py-2.5 px-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4A194E] to-[#2D142E] text-[#F5CC96] border border-[#E4D2E6] shadow-2xs flex items-center justify-center font-serif text-xs font-bold shrink-0">
                          {cust.name ? cust.name.charAt(0).toUpperCase() : "C"}
                        </div>
                        <span className="font-semibold text-[#2D142E]">
                          {cust.name}
                        </span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-2.5 px-2.5 text-[#7C637E] font-mono text-[10px]">
                      {cust.phone}
                    </td>

                    {/* Progress Bar & Ratio */}
                    <td className="py-2.5 px-2.5">
                      <div className="space-y-1 max-w-[120px]">
                        <div className="text-[10px] font-bold text-[#58245D]">
                          {cust.dressesCount} / {cust.totalTarget}
                        </div>
                        <div className="w-full bg-[#EFE3F1] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#803186] to-[#511F56] h-full rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-2.5 px-2.5 font-bold font-mono text-[#2D142E]">
                      {cust.totalAmountINR}
                    </td>

                    {/* Last Purchase */}
                    <td className="py-2.5 px-2.5 text-[#7C637E] font-medium">
                      {cust.lastPurchase}
                    </td>

                    {/* Status Tag */}
                    <td className="py-2.5 px-2.5">
                      {renderStatusPill(cust.statusText)}
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-2.5 text-right">
                      <button
                        onClick={() => onOpenMessageModal?.(cust)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#2D142E] hover:bg-[#471E4A] text-white text-[10px] font-semibold transition-all duration-150 cursor-pointer shadow-2xs"
                      >
                        <MessageCircle className="w-3 h-3 text-[#25D366] fill-[#25D366]/20 stroke-[2.5]" />
                        <span>Message</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
