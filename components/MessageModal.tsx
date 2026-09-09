"use client";

import React, { useState } from "react";
import { X, Send, Copy, Check, Sparkles, MessageCircle } from "lucide-react";
import { CustomerData } from "./CustomersFocusTable";
import { TemplateItem } from "./MessageTemplates";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: CustomerData | null;
  template?: TemplateItem | null;
}

function getDefaultMessage(customer?: CustomerData | null, template?: TemplateItem | null) {
  if (customer) {
    if (template) {
      return `Dear ${customer.name},\n\n${template.defaultText}\n\nWarm regards,\nDubai's Boutique`;
    }
    const dresses = customer.dressesCount || 0;
    const target = customer.totalTarget || 12;
    const remaining = target - dresses;

    let progressText = "";
    if (dresses >= target) {
      progressText = `Congratulations! You have unlocked full Elite Circle privileges!`;
    } else if (remaining === 1) {
      progressText = `You are just 1 dress away from unlocking full Elite Circle privileges!`;
    } else {
      progressText = `You are just ${remaining} dresses away from unlocking full Elite Circle privileges!`;
    }

    return `Dear ${customer.name},\n\nHope you are having a wonderful day! You have purchased ${dresses} out of ${target} dresses this year. ${progressText}\n\nWarm regards,\nDubai's Boutique`;
  }
  if (template) {
    return `Dear Valued Client,\n\n${template.defaultText}\n\nWarm regards,\nDubai's Boutique`;
  }
  return "";
}

export default function MessageModal({
  isOpen,
  onClose,
  customer,
  template,
}: MessageModalProps) {
  const [userEditedText, setUserEditedText] = useState<string | null>(null);
  const [prevPropsKey, setPrevPropsKey] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const currentKey = `${customer?.id || ""}-${template?.id || template?.title || ""}-${isOpen}`;

  if (currentKey !== prevPropsKey) {
    setPrevPropsKey(currentKey);
    setUserEditedText(null);
  }

  if (!isOpen) return null;

  const defaultMessage = getDefaultMessage(customer, template);
  const messageText = userEditedText ?? defaultMessage;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const rawPhone = customer?.phone ? customer.phone.replace(/\D/g, "") : "";
    const encodedMsg = encodeURIComponent(messageText);
    window.open(`https://wa.me/${rawPhone}?text=${encodedMsg}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D0A1F]/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E4CEE6] space-y-5 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F2E4F3] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F4EBF5] flex items-center justify-center text-[#25D366]">
              <MessageCircle className="w-5 h-5 fill-[#25D366]/20 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2D142E]">
                {customer ? `Message to ${customer.name}` : "Generate Client Message"}
              </h3>
              <p className="text-xs text-[#866B88]">
                {customer ? `Phone: ${customer.phone}` : template?.title || "Custom WhatsApp Template"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F3EAF4] text-[#7A5B7D] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Details Card */}
        {customer && (
          <div className="bg-[#FAF3FA] rounded-2xl p-3.5 border border-[#EEDBF0] flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={customer.avatarUrl}
                alt={customer.name}
                className="w-10 h-10 rounded-full object-cover border border-[#D9BEDC]"
              />
              <div>
                <span className="font-bold text-[#2D142E] block">{customer.name}</span>
                <span className="text-[11px] text-[#7E6380]">
                  Purchased: {customer.dressesCount}/{customer.totalTarget} dresses ({customer.statusText})
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#2D142E] text-white">
              {customer.category}
            </span>
          </div>
        )}

        {/* Textarea */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#2D142E] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C7963A]" />
            <span>Message Content (WhatsApp Draft)</span>
          </label>
          <textarea
            rows={5}
            value={messageText}
            onChange={(e) => setUserEditedText(e.target.value)}
            className="w-full p-3.5 rounded-2xl bg-[#FAF6FA] border border-[#E3D0E5] text-xs font-medium text-[#2D142E] focus:outline-none focus:ring-2 focus:ring-[#682A6E]/40 leading-relaxed resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#F3EBF4] hover:bg-[#EADBEE] text-[#58245D] text-xs font-semibold transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy Text"}</span>
          </button>

          <button
            onClick={handleSendWhatsApp}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5A] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
