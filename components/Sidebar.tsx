"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Crown,
  MessageSquare,
  Settings,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { useRouter } from "next/navigation";

interface SidebarProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  isOpen?: boolean;
  onToggleSidebar?: () => void;
}

export default function Sidebar({
  activeTab = "Dashboard",
  onSelectTab,
  isOpen = true,
  onToggleSidebar,
}: SidebarProps) {
  const [selected, setSelected] = useState(activeTab);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/" },
    { name: "Customers", icon: Users, href: "/customers" },
    { name: "Message Templates", icon: MessageSquare, href: "/message-templates" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ];

  const handleSelect = (name: string, href: string) => {
    setSelected(name);
    if (onSelectTab) onSelectTab(name);

    if (isMobile && onToggleSidebar) {
      onToggleSidebar();
    }

    if (href && href !== "#") {
      router.push(href);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay - ONLY rendered on mobile when drawer is open */}
      {isMobile && isOpen && (
        <div
          onClick={onToggleSidebar}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[90] animate-in fade-in duration-200"
        />
      )}

      {/* Floating Mobile Toggle Button (Visible when closed on mobile) */}
      {isMobile && !isOpen && (
        <button
          onClick={onToggleSidebar}
          className="fixed bottom-5 left-5 z-[80] w-12 h-12 rounded-full bg-[#2D142E] text-[#F5CC96] border border-[#F5CC96]/40 shadow-2xl flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
          title="Open Menu"
        >
          <Crown className="w-5 h-5" />
        </button>
      )}

      <aside
        className={`${
          isMobile
            ? `fixed top-0 left-0 h-screen z-[100] transition-transform duration-300 ${
                isOpen ? "w-[240px] translate-x-0" : "w-[240px] -translate-x-full"
              }`
            : `sticky top-0 h-screen shrink-0 z-30 transition-all duration-300 ${
                isOpen ? "w-[220px]" : "w-16"
              }`
        } text-white flex flex-col justify-between select-none shadow-2xl overflow-y-auto no-scrollbar`}
        style={{
          background: "linear-gradient(180deg, #2D142E 0%, #1F0B21 65%, #150416 100%)",
        }}
      >
        {/* Top Header & Logo */}
        <div className="p-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#47224B]/70">
            {isOpen ? (
              <div className="flex flex-col items-center text-center w-full relative pt-1">
                {/* Toggle Close Button */}
                <button
                  onClick={onToggleSidebar}
                  className="absolute right-0 top-0 p-1 text-[#BA9BBE] hover:text-white rounded-lg hover:bg-[#3B193E] transition-colors cursor-pointer"
                  title="Close Sidebar"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>

                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#682A6E] to-[#9B45A3] flex items-center justify-center shadow-md mb-1 border border-[#B36CBB]/30">
                  <Crown className="w-4 h-4 text-[#FAD59F]" />
                </div>
                <h1 className="font-serif text-base tracking-wide font-bold text-[#FDF8FE] leading-tight">
                  Dubai&apos;s Boutique
                </h1>
                <span className="text-[9px] tracking-[0.25em] font-bold text-[#E5B5EA] uppercase">
                  ELITE
                </span>
                <p className="text-[8px] tracking-wider text-[#BA9BBE] mt-0.5 uppercase font-medium">
                  More Than Fashion • A Closer Family
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full gap-2 py-1">
                <button
                  onClick={onToggleSidebar}
                  className="p-1.5 text-[#F5CC96] hover:bg-[#3B193E] rounded-lg transition-colors cursor-pointer"
                  title="Expand Sidebar"
                >
                  <PanelLeftOpen className="w-4 h-4" />
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#682A6E] to-[#9B45A3] flex items-center justify-center shadow-md border border-[#B36CBB]/30">
                  <Crown className="w-4 h-4 text-[#FAD59F]" />
                </div>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="mt-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = selected === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => handleSelect(item.name, item.href)}
                  title={!isOpen ? item.name : undefined}
                  className={`w-full flex items-center ${
                    isOpen ? "gap-3 px-3 py-2" : "justify-center p-2.5"
                  } rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-[#4D2051] text-white shadow-xs border border-[#713476]/50"
                      : "text-[#D2BDD5] hover:bg-[#3B193E] hover:text-white"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform duration-150 ${
                      isActive ? "text-[#F5CC96] scale-105" : "text-[#B995BD]"
                    }`}
                  />
                  {isOpen && <span className="truncate">{item.name}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Luxury Overlay Card */}
        {isOpen ? (
          <div className="p-3 m-2.5 rounded-2xl bg-gradient-to-br from-[#3D1A40] via-[#2A102C] to-[#1A061C] border border-[#5E2B63]/40 relative overflow-hidden text-center shadow-inner group">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-500"
              style={{
                backgroundImage: `url('/db_girl.png')`,
              }}
            />
            <div className="relative z-10 py-1">
              <p className="font-serif italic text-xs text-[#F7DEFD] font-medium leading-relaxed drop-shadow-xs">
                Confident <br />
                Women <br />
                Beautiful <br />
                Stories <span className="text-[#F5CC96]">♥</span>
              </p>
              <div className="mt-2 flex items-center justify-center gap-1 text-[9px] text-[#C4A0C7] tracking-widest uppercase font-medium">
                <Sparkles className="w-2.5 h-2.5 text-[#F5CC96]" />
                <span>Dubai&apos;s Boutique</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-2 mb-2 text-center">
            <Sparkles className="w-4 h-4 text-[#F5CC96] mx-auto animate-pulse" />
          </div>
        )}
      </aside>
    </>
  );
}
