"use client";

import React, { useState } from "react";
import { X, UserPlus, ShoppingBag, Check } from "lucide-react";

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: string | null;
}

export default function QuickActionModal({
  isOpen,
  onClose,
  actionType,
}: QuickActionModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [customerList, setCustomerList] = useState<{ id: string; name: string; phone: string }[]>([]);

  // Form inputs state
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custQty, setCustQty] = useState<number>(1);
  const [custAmount, setCustAmount] = useState("");
  const [custDate, setCustDate] = useState("2026-09-08");

  // Purchase specific form inputs
  const [selectedCustId, setSelectedCustId] = useState("");
  const [dressName, setDressName] = useState("");
  const [purchaseQty, setPurchaseQty] = useState<number>(1);

  // Fetch customer list when modal opens for adding purchase
  React.useEffect(() => {
    if (isOpen) {
      fetch("/api/customers")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.customers) {
            setCustomerList(data.customers);
            if (data.customers.length > 0 && !selectedCustId) {
              setSelectedCustId(String(data.customers[0].id));
            }
          }
        })
        .catch((err) => console.error("Error fetching customers list:", err));
    }
  }, [isOpen, selectedCustId]);

  if (!isOpen || !actionType) return null;

  const getTitle = () => {
    switch (actionType) {
      case "add_customer":
        return "Add New Customer";
      case "add_purchase":
        return "Record Dress Purchase";
      case "generate_message":
        return "Generate Custom Campaign Message";
      case "view_almost_elite":
        return "Almost Elite Circle Overview";
      default:
        return "Quick Action";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (actionType === "add_customer") {
        const qtyNum = Number(custQty) || 1;
        const status =
          qtyNum >= 12
            ? "Elite"
            : qtyNum === 11
            ? "Almost Elite"
            : qtyNum >= 8
            ? "Gold"
            : qtyNum >= 4
            ? "Silver"
            : "Regular";

        const res = await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: custName.trim(),
            phone: custPhone.trim(),
            status,
            dressName: "Initial Purchase",
            qty: qtyNum,
            amountINR: custAmount,
            purchaseDate: custDate,
          }),
        });

        const data = await res.json();
        if (!data.success) {
          setErrorMsg(data.error || "Failed to add customer.");
          return;
        }

        // Reset form
        setCustName("");
        setCustPhone("");
        setCustQty(1);
        setCustAmount("");
      } else if (actionType === "add_purchase") {
        const res = await fetch("/api/purchases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: selectedCustId,
            dressName: dressName.trim() || "Dress Purchase",
            qty: Number(purchaseQty) || 1,
            amountINR: custAmount,
            purchaseDate: custDate,
          }),
        });

        const data = await res.json();
        if (!data.success) {
          setErrorMsg(data.error || "Failed to add purchase.");
          return;
        }

        setDressName("");
        setCustAmount("");
      }
    } catch (err) {
      console.error("API submit error:", err);
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      // Reload page to reflect live database updates across all widgets
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D0A1F]/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E4CEE6] space-y-5 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F2E4F3] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F4EBF5] flex items-center justify-center text-[#58245D]">
              {actionType === "add_customer" ? (
                <UserPlus className="w-5 h-5" />
              ) : (
                <ShoppingBag className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2D142E]">
                {getTitle()}
              </h3>
              <p className="text-xs text-[#866B88]">Dubai&apos;s Boutique Elite</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F3EAF4] text-[#7A5B7D] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-base font-bold text-[#2D142E]">
              Success! Saved to Firestore
            </h4>
            <p className="text-xs text-[#866B88]">
              The record has been updated live in Dubai&apos;s Boutique database.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between animate-in fade-in">
                <span>{errorMsg}</span>
                <button
                  type="button"
                  onClick={() => setErrorMsg(null)}
                  className="p-0.5 text-red-500 hover:text-red-800 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {actionType === "add_customer" && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2D142E]">Customer Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Fatima Al-Mansoor"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6FA] border border-[#E3D0E5] text-xs focus:outline-none focus:ring-2 focus:ring-[#682A6E]/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2D142E]">Phone Number (WhatsApp)</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6FA] border border-[#E3D0E5] text-xs focus:outline-none focus:ring-2 focus:ring-[#682A6E]/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2D142E]">Initial Purchased Dresses</label>
                  <input
                    type="number"
                    min={0}
                    value={custQty}
                    onChange={(e) => setCustQty(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6FA] border border-[#E3D0E5] text-xs focus:outline-none focus:ring-2 focus:ring-[#682A6E]/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2D142E]">Total Amount (INR)</label>
                  <input
                    type="text"
                    placeholder="e.g. 25,000"
                    value={custAmount}
                    onChange={(e) => setCustAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6FA] border border-[#E3D0E5] text-xs focus:outline-none focus:ring-2 focus:ring-[#682A6E]/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2D142E]">Date</label>
                  <input
                    type="date"
                    value={custDate}
                    onChange={(e) => setCustDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6FA] border border-[#E3D0E5] text-xs focus:outline-none focus:ring-2 focus:ring-[#682A6E]/40"
                  />
                </div>
              </>
            )}

            {actionType === "add_purchase" && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2D142E]">Select Customer</label>
                  <select
                    value={selectedCustId}
                    onChange={(e) => setSelectedCustId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6FA] border border-[#E3D0E5] text-xs focus:outline-none focus:ring-2 focus:ring-[#682A6E]/40"
                  >
                    {customerList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2D142E]">Dress Name / Collection</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Royal Silk Abaya - Emerald"
                    value={dressName}
                    onChange={(e) => setDressName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6FA] border border-[#E3D0E5] text-xs focus:outline-none focus:ring-2 focus:ring-[#682A6E]/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2D142E]">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={purchaseQty}
                    onChange={(e) => setPurchaseQty(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6FA] border border-[#E3D0E5] text-xs focus:outline-none focus:ring-2 focus:ring-[#682A6E]/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2D142E]">Total Amount (INR)</label>
                  <input
                    type="text"
                    placeholder="e.g. 25,000"
                    value={custAmount}
                    onChange={(e) => setCustAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6FA] border border-[#E3D0E5] text-xs focus:outline-none focus:ring-2 focus:ring-[#682A6E]/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2D142E]">Purchase Date</label>
                  <input
                    type="date"
                    value={custDate}
                    onChange={(e) => setCustDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6FA] border border-[#E3D0E5] text-xs focus:outline-none focus:ring-2 focus:ring-[#682A6E]/40"
                  />
                </div>
              </>
            )}

            {actionType !== "add_customer" && actionType !== "add_purchase" && (
              <div className="p-4 bg-[#FAF3FA] rounded-2xl text-xs text-[#7A5B7D] leading-relaxed">
                Click save below to generate automatic broadcast notifications for all Almost Elite Circle members.
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-[#F3EBF4] text-[#58245D] text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#2D142E] hover:bg-[#471E4A] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Save Record
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
