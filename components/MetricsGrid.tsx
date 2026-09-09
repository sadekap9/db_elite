"use client";

import React from "react";
import { Users, Crown, Target, ShoppingBag } from "lucide-react";

export default function MetricsGrid() {
  const [data, setData] = React.useState({
    totalCustomers: 0,
    eliteMembers: 0,
    almostElite: 0,
    activeCustomers: 0,
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/metrics")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.metrics) {
          setData(json.metrics);
        } else {
          setData({
            totalCustomers: 0,
            eliteMembers: 0,
            almostElite: 0,
            activeCustomers: 0,
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching metrics:", err);
        setData({
          totalCustomers: 0,
          eliteMembers: 0,
          almostElite: 0,
          activeCustomers: 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const metrics = [
    {
      title: "Total Customers",
      value: loading ? "..." : String(data.totalCustomers),
      subtext: "All registered customers",
      icon: Users,
      bgColor: "bg-[#F4EAF5]",
      iconColor: "text-[#58245D]",
      borderColor: "border-[#E8D4EA]",
    },
    {
      title: "Elite Members",
      value: loading ? "..." : String(data.eliteMembers),
      subtext: "12+ dresses in a year",
      icon: Crown,
      bgColor: "bg-[#FCF6E7]",
      iconColor: "text-[#C7963A]",
      borderColor: "border-[#F4E3C1]",
    },
    {
      title: "Almost Elite",
      value: loading ? "..." : String(data.almostElite),
      subtext: "11 dresses (1 away)",
      icon: Target,
      bgColor: "bg-[#F8EDF9]",
      iconColor: "text-[#833189]",
      borderColor: "border-[#ECD1EE]",
    },
    {
      title: "Active Customers",
      value: loading ? "..." : String(data.activeCustomers),
      subtext: "Purchased in last 6 months",
      icon: ShoppingBag,
      bgColor: "bg-[#F3EBF4]",
      iconColor: "text-[#58245D]",
      borderColor: "border-[#E6D4E8]",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
      {metrics.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`bg-white rounded-2xl p-3 md:p-3.5 border ${item.borderColor} shadow-2xs hover:shadow-xs transition-all duration-150 flex items-center gap-3 group`}
          >
            <div
              className={`w-9 h-9 rounded-full ${item.bgColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-150`}
            >
              <Icon className={`w-4 h-4 ${item.iconColor}`} />
            </div>

            <div className="space-y-0.5 leading-none">
              <span className="text-[11px] font-semibold text-[#806782] block">
                {item.title}
              </span>
              <div className="text-xl font-bold text-[#2D142E] tracking-tight font-sans">
                {item.value}
              </div>
              <span className="text-[9px] text-[#977D99] font-medium block">
                {item.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
