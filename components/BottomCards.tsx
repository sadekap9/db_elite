"use client";

import React from "react";
import { Users, Shirt, Heart } from "lucide-react";

export default function BottomCards() {
  const cards = [
    {
      title: "Build Deeper Relationships",
      subtitle: "Know your customers. Make them feel special.",
      icon: Users,
    },
    {
      title: "Turn Shoppers Into a Community",
      subtitle: "12 dresses. 1 year. 1 Elite circle.",
      icon: Shirt,
    },
    {
      title: "More Than Fashion",
      subtitle: "Because some customers deserve more than just a thank you.",
      icon: Heart,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl p-3.5 border border-[#E9D6EB] shadow-2xs flex items-center gap-3 hover:shadow-xs transition-all duration-150 group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#F5EAF6] flex items-center justify-center shrink-0 border border-[#EDD5F0] group-hover:scale-105 transition-transform">
              <Icon className="w-4 h-4 text-[#58245D]" />
            </div>
            <div className="space-y-0.5 leading-tight">
              <h4 className="font-serif font-bold text-xs text-[#2D142E]">
                {c.title}
              </h4>
              <p className="text-[10px] text-[#806682] font-medium leading-snug">
                {c.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
