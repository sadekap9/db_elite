"use client";

import React from "react";
import {
  FileText,
  ArrowRight,
  ChevronRight,
  Megaphone,
  Crown,
  MessageSquare,
  Gift,
} from "lucide-react";

export interface TemplateItem {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  defaultText: string;
}

interface MessageTemplatesProps {
  onSelectTemplate?: (template: TemplateItem) => void;
}

export default function MessageTemplates({ onSelectTemplate }: MessageTemplatesProps) {
  const [templates, setTemplates] = React.useState<TemplateItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/message-templates")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.templates) {
          const mapped: TemplateItem[] = json.templates.map((t: any) => ({
            id: t.id,
            title: t.templateName || "WhatsApp Template",
            subtitle: t.targetAudience || t.category || "General",
            icon: t.category === "Promotion" ? Megaphone : t.category === "Reward" ? Gift : Crown,
            defaultText: t.messageText || "",
          }));
          setTemplates(mapped);
        }
      })
      .catch((err) => console.error("Error fetching templates:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E9D6EB] shadow-2xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#2D142E]" />
          <h3 className="font-bold text-xs text-[#2D142E]">Message Templates</h3>
        </div>
        <button className="text-[11px] font-semibold text-[#86378D] hover:text-[#58245D] flex items-center gap-1 transition-colors cursor-pointer">
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Templates List */}
      <div className="space-y-1">
        {loading ? (
          <div className="py-4 text-center text-[10px] text-[#8F7492] font-semibold animate-pulse">
            Loading templates...
          </div>
        ) : templates.length === 0 ? (
          <div className="py-4 text-center text-[10px] text-[#8F7492] font-semibold">
            No templates configured.
          </div>
        ) : (
          templates.map((tpl) => {
            const Icon = tpl.icon;
            return (
              <button
                key={tpl.id}
                onClick={() => onSelectTemplate?.(tpl)}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF3FA] border border-transparent hover:border-[#F0DCF2] transition-all duration-150 cursor-pointer group text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-[#F5EBF7] flex items-center justify-center text-[#682A6E] shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-bold text-[#2D142E] group-hover:text-[#682A6E] transition-colors truncate">
                      {tpl.title}
                    </h4>
                    <p className="text-[9px] text-[#8F7492] font-medium truncate">
                      {tpl.subtitle}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-[#C1ABC3] group-hover:text-[#682A6E] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
