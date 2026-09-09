"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MessageModal from "@/components/MessageModal";
import QuickActionModal from "@/components/QuickActionModal";
import { CustomerData } from "@/components/CustomersFocusTable";
import {
  MessageSquare,
  Plus,
  Crown,
  Copy,
  Check,
  Pencil,
  Trash2,
  ArrowRight,
  X,
  Megaphone,
  Target,
  Gift,
  Cake,
  Shirt,
  Heart,
  Upload,
} from "lucide-react";

interface TemplateItem {
  id: number;
  title: string;
  icon: React.ElementType;
  content: string;
}

const initialTemplates: TemplateItem[] = [];
const defaultCustomerOptions: CustomerData[] = [];

export default function MessageTemplatesPage() {
  const [activeNavTab, setActiveNavTab] = useState("Message Templates");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [customerOptions, setCustomerOptions] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // Fetch Templates
    fetch("/api/message-templates")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.templates) {
          const mapped: TemplateItem[] = data.templates.map((t: any, idx: number) => ({
            id: t.id || idx + 1,
            title: t.templateName || t.title || "Template",
            icon: t.category === "Promotion" ? Megaphone : t.category === "Reward" ? Gift : Crown,
            content: t.messageText || t.message_body || "",
          }));
          setTemplates(mapped);
        }
      })
      .catch((err) => console.error("Error fetching templates:", err))
      .finally(() => setLoading(false));

    // Fetch Customers for Selector
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.customers) {
          const mappedCust: CustomerData[] = data.customers.map((c: any) => ({
            id: Number(c.id) || c.id,
            name: c.name,
            phone: c.phone,
            avatarUrl: "",
            dressesCount: c.dresses || 0,
            totalTarget: 12,
            statusBadge: c.status || "Regular",
            statusText: c.status || "Regular",
            lastPurchase: c.lastPurchaseDate || "N/A",
            category: c.status || "Regular",
          }));
          setCustomerOptions(mappedCust);
          if (mappedCust.length > 0) {
            setSelectedCustomerId(Number(mappedCust[0].id));
          }
        }
      })
      .catch((err) => console.error("Error fetching customer options:", err));
  }, []);

  // Form State for Add / Edit Template
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");

  // Generator State
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | string>("");
  const [selectedTemplateTitle, setSelectedTemplateTitle] = useState<string>("");
  const [generatedText, setGeneratedText] = useState<string>("");

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modal Dispatch State
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [quickActionType, setQuickActionType] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const selectedCustomer = customerOptions.find((c) => String(c.id) === String(selectedCustomerId)) || customerOptions[0] || {
    id: 0,
    name: "Client",
    phone: "",
    dressesCount: 0,
    totalTarget: 12,
    statusBadge: "Regular",
    statusText: "Regular",
    lastPurchase: "N/A",
    category: "Regular",
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Template text copied to clipboard!");
  };

  const handleInsertVariable = (variable: string) => {
    setFormContent((prev) => prev + " " + variable);
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    if (editingId) {
      setTemplates((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, title: formTitle, content: formContent } : t))
      );
      showToast("Template updated successfully!");
    } else {
      const newTpl: TemplateItem = {
        id: Date.now(),
        title: formTitle,
        icon: MessageSquare,
        content: formContent,
      };
      setTemplates((prev) => [...prev, newTpl]);

      try {
        await fetch("/api/message-templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateName: formTitle,
            messageText: formContent,
            category: "General",
          }),
        });
      } catch (err) {
        console.error("Error saving template to API:", err);
      }

      showToast("New template created successfully!");
    }

    setEditingId(null);
    setFormTitle("");
    setFormContent("");
  };

  const handleEditClick = (tpl: TemplateItem) => {
    setEditingId(tpl.id);
    setFormTitle(tpl.title);
    setFormContent(tpl.content);
  };

  const handleDeleteTemplate = (id: number) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setFormTitle("");
      setFormContent("");
    }
    showToast("Template deleted.");
  };

  const handleGenerateMessage = () => {
    const tpl = templates.find((t) => t.title === selectedTemplateTitle) || templates[2] || templates[0];
    const remaining = selectedCustomer.totalTarget - selectedCustomer.dressesCount;

    const text = tpl.content
      .replace(/{{customer_name}}/g, selectedCustomer.name)
      .replace(/{{purchase_count}}/g, `${selectedCustomer.dressesCount}`)
      .replace(/{{remaining}}/g, `${remaining}`)
      .replace(/{{last_purchase_date}}/g, "3 Sep 2026");

    setGeneratedText(text);
    showToast("Ready-to-send message generated!");
  };

  const filteredTemplates = templates.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <span className="text-[10px] text-[#D2BDD5] font-medium block">Template System</span>
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
      <main className="flex-1 min-w-0 p-4 lg:p-5 space-y-5 max-w-[1440px] mx-auto overflow-y-auto">
        {/* Top Header */}
        <Header
          onSearchChange={setSearchQuery}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        {/* Page Banner & Header */}
        <div className="flex items-center justify-between gap-4 bg-white rounded-2xl p-4 border border-[#E9D6EB] shadow-2xs">
          <div>
            <h1 className="font-serif text-xl md:text-2xl font-bold text-[#2D142E]">
              Message Templates
            </h1>
            <p className="text-xs text-[#7A5D7C] mt-0.5 font-medium">
              Create and manage your WhatsApp message templates.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingId(null);
              setFormTitle("");
              setFormContent("");
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2D142E] hover:bg-[#471E4A] text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-[#F5CC96]" />
            <span>Add New Template</span>
          </button>
        </div>

        {/* TOP SECTION: 2 COLUMNS (Templates Table Left, Add/Edit Form Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT COLUMN: Template Table (7 columns) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-4 border border-[#E9D6EB] shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#F0E2F1] text-[#937896] font-semibold text-[11px]">
                    <th className="py-2.5 px-2 w-8">#</th>
                    <th className="py-2.5 px-3">Template Title</th>
                    <th className="py-2.5 px-3">Message Preview</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F6EDF7]">
                  {filteredTemplates.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-xs font-semibold text-[#8C718F]">
                        No message templates found. Add a new template using the form on the right.
                      </td>
                    </tr>
                  ) : (
                    filteredTemplates.map((tpl, idx) => {
                      const IconComp = tpl.icon || MessageSquare;
                      return (
                        <tr key={tpl.id} className="hover:bg-[#FAF3FA] transition-colors">
                          <td className="py-3 px-2 font-medium text-[#7C637E]">{idx + 1}</td>

                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5 font-bold text-[#2D142E]">
                              <div className="w-7 h-7 rounded-xl bg-[#F5ECF6] flex items-center justify-center text-[#682A6E] shrink-0">
                                <IconComp className="w-3.5 h-3.5 text-[#682A6E]" />
                              </div>
                              <span className="truncate">{tpl.title}</span>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <p className="text-[#6E4F71] text-[11px] line-clamp-1 max-w-[280px]">
                              {tpl.content}
                            </p>
                          </td>

                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleEditClick(tpl)}
                                className="p-1.5 rounded-full hover:bg-[#F3EAF4] text-[#682A6E] transition-colors cursor-pointer"
                                title="Edit Template"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleCopy(tpl.content)}
                                className="p-1.5 rounded-full hover:bg-[#F3EAF4] text-[#682A6E] transition-colors cursor-pointer"
                                title="Copy Message Text"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteTemplate(tpl.id)}
                                className="p-1.5 rounded-full hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                                title="Delete Template"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT COLUMN: Add / Edit Template Form Card (5 columns) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-[#E9D6EB] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2E4F3] pb-3">
              <h3 className="font-serif text-base font-bold text-[#2D142E]">
                {editingId ? "Edit Template" : "Add / Edit Template"}
              </h3>
              {editingId && (
                <button
                  onClick={() => {
                    setEditingId(null);
                    setFormTitle("");
                    setFormContent("");
                  }}
                  className="p-1.5 rounded-full hover:bg-[#F3EAF4] text-[#7A5B7D] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs">
              {/* Title */}
              <div className="space-y-1">
                <label className="font-semibold text-[#2D142E]">
                  Template Title <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. My Elite Status"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6FA] border border-[#E3D0E5] focus:outline-none focus:ring-2 focus:ring-[#682A6E]/40"
                />
              </div>

              {/* Message Template Textarea */}
              <div className="space-y-1">
                <label className="font-semibold text-[#2D142E]">
                  Message Template <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your message here... You can use variables like {{customer_name}}, {{purchase_count}}, {{remaining}}, {{last_purchase_date}} etc."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-[#FAF6FA] border border-[#E3D0E5] text-xs font-medium text-[#2D142E] focus:outline-none focus:ring-2 focus:ring-[#682A6E]/40 leading-relaxed resize-none"
                />
              </div>

              {/* Clickable Variable Buttons */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-[#7A5B7D] block">
                  Available Variables (click to insert):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "{{customer_name}}",
                    "{{purchase_count}}",
                    "{{remaining}}",
                    "{{last_purchase_date}}",
                  ].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleInsertVariable(v)}
                      className="px-2.5 py-1 rounded-lg bg-[#F5ECF6] hover:bg-[#EADBEE] text-[#682A6E] text-[10px] font-mono font-bold transition-colors cursor-pointer border border-[#E6CFE8]"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Image (Optional) Box */}
              <div className="space-y-1">
                <label className="font-semibold text-[#2D142E] block">
                  Add Image (Optional)
                </label>
                <div className="border-2 border-dashed border-[#E3D0E5] bg-[#FAF6FA] hover:bg-[#F4EBF5] transition-colors rounded-2xl p-4 text-center cursor-pointer space-y-1.5">
                  <Upload className="w-6 h-6 text-[#682A6E] mx-auto opacity-70" />
                  <span className="text-xs font-semibold text-[#2D142E] block">
                    Click to upload image
                  </span>
                  <span className="text-[10px] text-[#8C718F] block">
                    PNG, JPG (Max 5MB)
                  </span>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormTitle("");
                    setFormContent("");
                  }}
                  className="px-4 py-2 rounded-full bg-[#F3EBF4] text-[#58245D] font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#2D142E] hover:bg-[#471E4A] text-white font-bold shadow-md cursor-pointer transition-all"
                >
                  {editingId ? "Update Template" : "Save Template"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* BOTTOM SECTION: Use Template for a Customer */}
        <div className="bg-white rounded-2xl p-5 border border-[#E9D6EB] shadow-2xs space-y-4">
          <div>
            <h3 className="font-serif text-base font-bold text-[#2D142E]">
              Use Template for a Customer
            </h3>
            <p className="text-xs text-[#7A5D7C] mt-0.5 font-medium">
              Select a customer and generate a ready-to-send message.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Controls (Customer & Template selects + Generate button) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Select Customer */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2D142E]">Select Customer</label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6FA] border border-[#E3D0E5] text-xs font-bold text-[#2D142E] focus:outline-none focus:ring-2 focus:ring-[#682A6E]/40"
                  >
                    {customerOptions.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone})
                      </option>
                    ))}
                  </select>

                  {/* Customer Card Details Box */}
                  <div className="bg-[#FAF3FA] p-3 rounded-2xl border border-[#EEDBF0] flex items-center justify-between gap-3 text-xs mt-2">
                    <div className="flex items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedCustomer.avatarUrl}
                        alt={selectedCustomer.name}
                        className="w-9 h-9 rounded-full object-cover border border-[#D9BEDC]"
                      />
                      <div>
                        <span className="font-bold text-[#2D142E] block">
                          {selectedCustomer.name}
                        </span>
                        <span className="text-[10px] text-[#7E6380] font-mono">
                          {selectedCustomer.phone}
                        </span>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="text-[10px] font-bold text-[#682A6E] block">
                        {selectedCustomer.dressesCount} / {selectedCustomer.totalTarget}
                      </span>
                      <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#F5ECF6] text-[#79347E] border border-[#E6CFE8]">
                        {selectedCustomer.statusBadge}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Select Template */}
                <div className="space-y-1.5 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#2D142E]">Select Template</label>
                    <select
                      value={selectedTemplateTitle}
                      onChange={(e) => setSelectedTemplateTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6FA] border border-[#E3D0E5] text-xs font-bold text-[#2D142E] focus:outline-none focus:ring-2 focus:ring-[#682A6E]/40"
                    >
                      {templates.map((t) => (
                        <option key={t.id} value={t.title}>
                          {t.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerateMessage}
                    className="w-full py-3 rounded-2xl bg-[#2D142E] hover:bg-[#471E4A] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>Generate Message</span>
                    <ArrowRight className="w-4 h-4 text-[#F5CC96]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Result Box (Generated Message & Image Preview) */}
            <div className="lg:col-span-6 bg-[#FAF6FA] rounded-2xl p-4 border border-[#E9D6EB] space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2D142E]">Generated Message</span>
                <button
                  onClick={() =>
                    handleCopy(
                      generatedText ||
                        `Hi ${selectedCustomer.name}! 👋 You currently have ${selectedCustomer.dressesCount} purchases with Dubai's Boutique — ✨ just ${
                          selectedCustomer.totalTarget - selectedCustomer.dressesCount
                        } more dress to complete your Elite journey! ✨ 12 dresses. One year. One Elite circle. 👑`
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-[#F3EAF4] text-[#682A6E] text-[11px] font-semibold border border-[#E4CEE6] transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center bg-white p-4 rounded-xl border border-[#E3D0E5]">
                {/* Message Text Preview */}
                <div className="sm:col-span-2 text-xs text-[#2D142E] font-medium leading-relaxed space-y-1">
                  {generatedText ? (
                    <p className="whitespace-pre-line">{generatedText}</p>
                  ) : (
                    <>
                      <p>Hi {selectedCustomer.name}! 👋</p>
                      <p>
                        You currently have {selectedCustomer.dressesCount} purchases with Dubai&apos;s Boutique — ✨
                      </p>
                      <p>
                        just {selectedCustomer.totalTarget - selectedCustomer.dressesCount} more dress to complete your Elite journey! ✨
                      </p>
                      <p className="pt-1">12 dresses. One year. One Elite circle. 👑</p>
                    </>
                  )}
                </div>

                {/* Luxury Image Preview Thumbnail */}
                <div className="sm:col-span-1 rounded-xl overflow-hidden border border-[#E4CEE6] shadow-sm relative group aspect-square bg-[#2D142E] flex items-center justify-center p-2 text-center">
                  <div className="space-y-1">
                    <Crown className="w-6 h-6 text-[#F5CC96] mx-auto" />
                    <span className="font-serif text-[10px] font-bold text-white uppercase block">
                      Dubai&apos;s Boutique
                    </span>
                    <span className="text-[8px] text-[#F5CC96] tracking-widest block font-bold">
                      ELITE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* WhatsApp Message Modal */}
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        customer={selectedCustomer}
      />

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={!!quickActionType}
        onClose={() => setQuickActionType(null)}
        actionType={quickActionType}
      />
    </div>
  );
}
