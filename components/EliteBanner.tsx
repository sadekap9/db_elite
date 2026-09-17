"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface EliteBannerProps {
  onViewDetails?: () => void;
}

export default function EliteBanner({ onViewDetails }: EliteBannerProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#EADBEE] shadow-xs p-4 sm:p-6 md:p-8 min-h-[160px] sm:min-h-[180px] flex items-center bg-gradient-to-r from-[#FAF3FA] via-[#FAF4F8] to-[#F5EAF1]">
      {/* Fashion Woman Right Edge Background */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[45%] sm:w-[50%] md:w-[45%] bg-cover bg-right sm:bg-center pointer-events-none z-0 opacity-70 sm:opacity-90 rounded-r-2xl overflow-hidden"
        style={{ backgroundImage: `url('/dubaiboutique_girl.png')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF3FA] via-[#FAF3FA]/50 sm:via-[#FAF3FA]/30 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col justify-center gap-2 sm:gap-2.5 max-w-[65%] xs:max-w-[70%] sm:max-w-md lg:max-w-lg">
        {/* Left Column: Text Content matching Image 2 */}
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#2D142E] tracking-tight leading-tight">
          Dubai&apos;s Boutique Elite
        </h2>

        <div className="text-[9px] sm:text-[10px] md:text-[11px] font-bold tracking-[0.15em] sm:tracking-[0.2em] text-[#6E3072] uppercase flex items-center gap-1.5 flex-wrap">
          <span>12 DRESSES</span>
          <span>•</span>
          <span>1 YEAR</span>
          <span>•</span>
          <span>1 ELITE CIRCLE</span>
        </div>

        <p className="text-[11px] sm:text-xs md:text-sm text-[#4A264D] font-medium leading-relaxed max-w-xs sm:max-w-sm md:max-w-md">
          A private circle for our most loyal customers. Early access, exclusive privileges, and bespoke rewards.
        </p>

        <div className="pt-1">
          <button
            onClick={onViewDetails}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-[#2D142E] hover:bg-[#471E4A] text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer group"
          >
            <span>View Program Details</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F5CC96] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
