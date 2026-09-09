"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MetricsGrid from "@/components/MetricsGrid";
import EliteBanner from "@/components/EliteBanner";
import CustomersFocusTable, { CustomerData } from "@/components/CustomersFocusTable";
import QuickActions from "@/components/QuickActions";
import MessageTemplates, { TemplateItem } from "@/components/MessageTemplates";
import BottomCards from "@/components/BottomCards";
import MessageModal from "@/components/MessageModal";
import QuickActionModal from "@/components/QuickActionModal";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNavTab, setActiveNavTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Modal States
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [quickActionType, setQuickActionType] = useState<string | null>(null);

  // Handlers
  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleOpenMessageCustomer = (customer: CustomerData) => {
    setSelectedCustomer(customer);
    setSelectedTemplate(null);
    setIsMessageModalOpen(true);
  };

  const handleSelectTemplate = (template: TemplateItem) => {
    setSelectedTemplate(template);
    setSelectedCustomer(null);
    setIsMessageModalOpen(true);
  };

  const handleQuickAction = (actionId: string) => {
    if (actionId === "generate_message") {
      setSelectedTemplate(null);
      setSelectedCustomer(null);
      setIsMessageModalOpen(true);
    } else {
      setQuickActionType(actionId);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF7F2] text-[#2D142E] font-sans antialiased selection:bg-[#EADBEE] selection:text-[#2D142E] relative">
      {/* Left Navigation Sidebar (Sticky h-screen) */}
      <Sidebar
        activeTab={activeNavTab}
        onSelectTab={setActiveNavTab}
        isOpen={isSidebarOpen}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 lg:p-5 space-y-4 max-w-[1440px] mx-auto overflow-y-auto">
        {/* Top Header with Burger Toggle */}
        <Header
          onSearchChange={setSearchQuery}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={handleToggleSidebar}
        />

        {/* 4 KPI Metrics Grid */}
        <MetricsGrid />

        {/* Featured Promotion Banner: Dubai's Boutique Elite */}
        <EliteBanner
          onViewDetails={() => {
            setQuickActionType("view_almost_elite");
          }}
        />

        {/* 2-Column Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column (8 cols / 66%) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Customers to Focus On Table */}
            <CustomersFocusTable
              searchQuery={searchQuery}
              onOpenMessageModal={handleOpenMessageCustomer}
            />

            {/* Bottom 3 Strategic Brand Cards */}
            <BottomCards />
          </div>

          {/* Right Column (4 cols / 33%) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Quick Actions Widget */}
            <QuickActions onActionClick={handleQuickAction} />

            {/* Message Templates Widget */}
            <MessageTemplates onSelectTemplate={handleSelectTemplate} />
          </div>
        </div>
      </main>

      {/* WhatsApp Message Modal */}
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        customer={selectedCustomer}
        template={selectedTemplate}
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
