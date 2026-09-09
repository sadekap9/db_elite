"use client";

import React from "react";
import { Zap, UserPlus, ShoppingBag, MessageSquare, Target } from "lucide-react";

interface QuickActionsProps {
  onActionClick?: (actionType: string) => void;
}

export default function QuickActions({ onActionClick }: QuickActionsProps) {
  const actions = [
    {
      id: "add_customer",
      label: "Add New Customer",
      icon: UserPlus,
    },
    {
      id: "add_purchase",
      label: "Add Purchase",
      icon: ShoppingBag,
    },
    {
      id: "generate_message",
      label: "Generate Message",
      icon: MessageSquare,
    },
    {
      id: "view_almost_elite",
      label: "View Almost Elite Customers",
      icon: Target,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E9D6EB] shadow-2xs space-y-3">
      {/* Header */}
      <div className="flex items-center gap-1.5">
        <Zap className="w-3.5 h-3.5 text-[#2D142E] fill-[#2D142E]" />
        <h3 className="font-bold text-xs text-[#2D142E]">Quick Actions</h3>
      </div>

      {/* Buttons List */}
      <div className="space-y-2">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onActionClick?.(act.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#FAF4FC] hover:bg-[#F3E5F5] border border-[#F0DFFA] text-[11px] font-semibold text-[#2D142E] transition-all duration-150 cursor-pointer group shadow-2xs hover:shadow-xs"
            >
              <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[#682A6E] border border-[#E8D4EA] group-hover:scale-105 transition-transform shrink-0">
                <Icon className="w-3 h-3" />
              </div>
              <span className="flex-1 text-left truncate">{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
