"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface EliteBannerProps {
  onViewDetails?: () => void;
}

export default function EliteBanner({ onViewDetails }: EliteBannerProps) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-cover bg-right border border-[#EADBEE] shadow-xs p-6 md:p-8 min-h-[180px] flex items-center bg-[#E5D7E3]"
      style={{
        backgroundImage: `url('/elitebanner.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center right",
      }}
    >
      <div className="relative z-10 flex flex-col justify-center gap-2.5 max-w-md lg:max-w-lg">
        {/* Left Column: Text Content matching Image 2 */}
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#2D142E] tracking-tight leading-tight">
          Dubai&apos;s Boutique Elite
        </h2>

        <div className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-[#6E3072] uppercase flex items-center gap-1.5 flex-wrap">
          <span>12 DRESSES</span>
          <span>•</span>
          <span>1 YEAR</span>
          <span>•</span>
          <span>1 ELITE CIRCLE</span>
        </div>

        <p className="text-xs md:text-sm text-[#4A264D] font-medium leading-relaxed max-w-sm md:max-w-md">
          A private circle for our most loyal customers. Early access, exclusive privileges, and bespoke rewards.
        </p>

        <div className="pt-1">
          <button
            onClick={onViewDetails}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#2D142E] hover:bg-[#471E4A] text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer group"
          >
            <span>View Program Details</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F5CC96] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
