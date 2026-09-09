"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
  Crown,
  Save,
  Check,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Award,
  Clock,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

interface MilestoneRule {
  id: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
  durationLabel: string;
  targetDresses: number;
  tierName: string;
  description: string;
}

export default function SettingsPage() {
  const [activeNavTab, setActiveNavTab] = useState("Settings");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // Default Today and 6 Months Later
  const todayStr = new Date().toISOString().split("T")[0];
  const sixMonthsLater = new Date();
  sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
  const sixMonthsLaterStr = sixMonthsLater.toISOString().split("T")[0];

  // Active Milestone Rules List State
  const [rules, setRules] = useState<MilestoneRule[]>([
    {
      id: "1",
      startDate: "2024-01-01",
      endDate: "2024-06-30",
      durationMonths: 6,
      durationLabel: "6 Months",
      targetDresses: 6,
      tierName: "Gold VIP Member",
      description: "Buy 6 dresses between 2024-01-01 and 2024-06-30 (6 Months) to unlock Gold VIP Member status.",
    },
    {
      id: "2",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      durationMonths: 12,
      durationLabel: "12 Months (1 Year)",
      targetDresses: 12,
      tierName: "Elite Circle VIP",
      description: "Buy 12 dresses between 2024-01-01 and 2024-12-31 (12 Months) to unlock Elite Circle VIP status.",
    },
  ]);

  // Form State for Add / Edit Rule
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(sixMonthsLaterStr);
  const [durationMonths, setDurationMonths] = useState<number>(6);
  const [targetDresses, setTargetDresses] = useState<number>(6);
  const [tierName, setTierName] = useState<string>("Gold VIP Member");

  // Explicit calculation on date changes
  const updateMonthsFromDates = (startVal: string, endVal: string) => {
    if (startVal && endVal) {
      const start = new Date(startVal);
      const end = new Date(endVal);
      const calculatedMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      if (calculatedMonths > 0) {
        setDurationMonths(calculatedMonths);
      }
    }
  };

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    updateMonthsFromDates(val, endDate);
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    updateMonthsFromDates(startDate, val);
  };

  const handleSaveAll = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();

    const monthsNum = durationMonths > 0 ? durationMonths : 6;
    const durationLabel =
      monthsNum === 12
        ? "12 Months (1 Year)"
        : monthsNum === 6
        ? "6 Months"
        : `${monthsNum} Months`;

    const newRule: MilestoneRule = {
      id: Date.now().toString(),
      startDate: startDate || todayStr,
      endDate: endDate || sixMonthsLaterStr,
      durationMonths: monthsNum,
      durationLabel,
      targetDresses: Number(targetDresses),
      tierName: tierName.trim() || "VIP Member",
      description: `Buy ${targetDresses} dresses between ${startDate} and ${endDate} (${durationLabel}) to unlock ${tierName} status.`,
    };

    setRules((prev) => [...prev, newRule]);
    // Reset form defaults
    setTargetDresses(6);
    setTierName("VIP Member");
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

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
      <main className="flex-1 min-w-0 p-4 lg:p-5 space-y-4 max-w-[1440px] mx-auto overflow-y-auto">
        {/* Top Header */}
        <Header
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white rounded-3xl p-5 border border-[#E9D6EB] shadow-2xs">
          <div>
            <h1 className="font-serif text-xl md:text-2xl font-bold text-[#2D142E] flex items-center gap-2">
              <Crown className="w-6 h-6 text-[#C7963A]" />
              <span>Milestone Target Settings</span>
            </h1>
            <p className="text-xs text-[#7A5D7C] mt-0.5 font-medium">
              Set custom target durations, start date, end date, and dress requirements for your VIP tiers.
            </p>
          </div>

          <button
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2D142E] hover:bg-[#471E4A] text-white text-xs font-bold shadow-md transition-all cursor-pointer shrink-0"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Target Rules Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#F5CC96]" />
                <span>Save All Target Rules</span>
              </>
            )}
          </button>
        </div>

        {/* Main Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column (5 Cols): Add Custom Target Rule Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E9D6EB] shadow-2xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F0E2F1]">
              <Sparkles className="w-5 h-5 text-[#682A6E]" />
              <h2 className="font-serif font-bold text-base text-[#2D142E]">
                Set Start Date, End Date & Target
              </h2>
            </div>

            <form onSubmit={handleAddRule} className="space-y-4 text-xs">
              {/* Start Date & End Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6E4F71] mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#682A6E]" />
                    <span>Start Date</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF6FA] border border-[#E3D0E5] text-[#2D142E] font-semibold focus:outline-none focus:ring-2 focus:ring-[#682A6E]/30 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6E4F71] mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#682A6E]" />
                    <span>End Date</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF6FA] border border-[#E3D0E5] text-[#2D142E] font-semibold focus:outline-none focus:ring-2 focus:ring-[#682A6E]/30 cursor-pointer"
                  />
                </div>
              </div>

              {/* Duration (Months) Manual Input */}
              <div>
                <label className="block text-[11px] font-bold text-[#6E4F71] mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#682A6E]" />
                  <span>Duration (Months)</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF6FA] border border-[#E3D0E5] text-[#2D142E] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#682A6E]/30"
                  />
                  <span className="text-xs font-bold text-[#682A6E] shrink-0">Months</span>
                </div>
                <p className="text-[10px] text-[#8C718F] mt-1 font-medium">
                  Auto-calculated from Start/End dates or enter manually.
                </p>
              </div>

              {/* Required Dress Count */}
              <div>
                <label className="block text-[11px] font-bold text-[#6E4F71] mb-1 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#682A6E]" />
                  <span>Target Dress Count Required</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={targetDresses}
                    onChange={(e) => setTargetDresses(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF6FA] border border-[#E3D0E5] text-[#2D142E] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#682A6E]/30"
                  />
                  <span className="text-xs font-bold text-[#682A6E] shrink-0">Dresses</span>
                </div>
              </div>

              {/* Tier Status Name */}
              <div>
                <label className="block text-[11px] font-bold text-[#6E4F71] mb-1 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-[#C7963A]" />
                  <span>Unlocked VIP Status Tier Name</span>
                </label>
                <input
                  type="text"
                  value={tierName}
                  onChange={(e) => setTierName(e.target.value)}
                  placeholder="e.g. Gold VIP, Elite Circle VIP"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF6FA] border border-[#E3D0E5] text-[#2D142E] font-semibold focus:outline-none focus:ring-2 focus:ring-[#682A6E]/30"
                />
              </div>

              {/* Live Summary Preview */}
              <div className="p-4 rounded-2xl bg-[#FAF3FA] border border-[#EEDBF0] space-y-1">
                <span className="text-[10px] font-bold text-[#682A6E] uppercase tracking-wider block">
                  Rule Summary Preview:
                </span>
                <p className="text-xs font-semibold text-[#2D142E] leading-relaxed">
                  Buy <span className="font-extrabold text-[#682A6E]">{targetDresses} dresses</span> between{" "}
                  <span className="font-extrabold text-[#2D142E]">{startDate}</span> and{" "}
                  <span className="font-extrabold text-[#2D142E]">{endDate}</span> ({durationMonths} Months) ➔
                  Unlock <span className="font-extrabold text-[#C7963A]">{tierName}</span> Status.
                </p>
              </div>

              {/* Add Rule Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#2D142E] hover:bg-[#451F47] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4 text-[#F5CC96]" />
                <span>Save & Add Target Rule</span>
              </button>
            </form>
          </div>

          {/* Right Column (7 Cols): Active Target Rules List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-[#E9D6EB] shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0E2F1]">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-[#C7963A]" />
                  <h2 className="font-serif font-bold text-base text-[#2D142E]">
                    Active Boutique Target Rules ({rules.length})
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FCF6E7] text-[#C7963A] text-xs font-bold border border-[#F4E3C1]">
                  Live Member Rules
                </span>
              </div>

              {/* Rules Cards List */}
              <div className="space-y-3">
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-4 rounded-2xl bg-gradient-to-br from-[#FAF3FA] to-[#F5EAF7] border border-[#EEDBF0] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative transition-all hover:border-[#682A6E]/30"
                  >
                    <div className="space-y-2 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#2D142E] text-[#F5CC96]">
                          <Crown className="w-3.5 h-3.5 text-[#F5CC96]" />
                          <span>{rule.tierName}</span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#682A6E] border border-[#E3D0E5]">
                          {rule.durationLabel} ({rule.durationMonths} Months)
                        </span>
                      </div>

                      {/* Date Span */}
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#682A6E]">
                        <Calendar className="w-3.5 h-3.5 text-[#682A6E]" />
                        <span>{rule.startDate}</span>
                        <ArrowRight className="w-3 h-3 text-[#9C7F9E]" />
                        <span>{rule.endDate}</span>
                      </div>

                      <div className="text-sm font-bold text-[#2D142E]">
                        Target Requirement: {rule.targetDresses} Dresses
                      </div>

                      <p className="text-xs text-[#7E6380] font-medium leading-relaxed">
                        {rule.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-2.5 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-100/70 transition-all cursor-pointer self-end sm:self-auto shrink-0"
                      title="Delete Target Rule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {rules.length === 0 && (
                <div className="text-center py-8 text-xs text-[#8C718F] font-medium">
                  No target rules configured. Add a custom rule using the form on the left!
                </div>
              )}
            </div>

            {/* Information Banner */}
            <div className="bg-[#2D142E] text-white rounded-3xl p-5 border border-[#48204A] shadow-md space-y-2">
              <div className="flex items-center gap-2 text-[#F5CC96] font-serif font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Custom Target & Date Range Rules</span>
              </div>
              <p className="text-xs text-[#D2BDD5] leading-relaxed">
                You can manually set any number of months (e.g. 1 month, 3 months, 6 months, 12 months) along with exact Start and End dates. When a client accumulates the required dress count within this date period, they automatically qualify for the status tier!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
