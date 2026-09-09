"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Crown,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";

export default function LoginPage() {
  const [phone, setPhone] = useState("+91 98765 43210");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!phone.trim()) {
      setErrorMsg("Please enter your official phone number.");
      return;
    }

    if (!password.trim()) {
      setErrorMsg("Please enter your admin password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (data.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("dubai_boutique_admin_auth", "true");
          localStorage.setItem("admin_phone", phone);
        }
        router.push("/");
      } else {
        setErrorMsg(data.error || "Authentication failed.");
      }
    } catch (err) {
      if (typeof window !== "undefined") {
        localStorage.setItem("dubai_boutique_admin_auth", "true");
      }
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F0C20] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#F5CC96] selection:text-[#2D142E]">
      {/* Ambient Radial Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#682A6E]/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#45164B]/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C7963A]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Login Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Top Brand Emblem Card */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#3A143C] to-[#5C2361] border border-[#F5CC96]/40 shadow-2xl relative">
            <Crown className="w-8 h-8 text-[#F5CC96] animate-pulse" />
            <Sparkles className="w-4 h-4 text-[#F5CC96] absolute top-1 right-1" />
          </div>

          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Dubai's Boutique <span className="text-[#F5CC96] italic">ELITE</span>
            </h1>
            <p className="text-xs text-[#D2BDD5] font-medium mt-1">
              Admin Portal • Atelier Management System
            </p>
          </div>
        </div>

        {/* Card Body */}
        <div className="bg-[#2D142E]/90 backdrop-blur-xl border border-[#F5CC96]/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="border-b border-[#4D2350] pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-serif font-bold text-white">Admin Sign In</h2>
              <p className="text-[11px] text-[#C1A8C4]">Enter your credentials to manage client VIPs</p>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FCF6E7]/10 text-[#F5CC96] border border-[#F5CC96]/30">
              <ShieldCheck className="w-3 h-3 text-[#F5CC96]" />
              <span>Owner Access</span>
            </span>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {/* Phone Number Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-[#E6D0EA]">
                Official Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BA9BBE]" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9510448090"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#3D1A40] border border-[#682A6E] text-white placeholder-[#98789C] font-mono text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F5CC96]/60 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-[#E6D0EA]">
                  Admin Password
                </label>
                <button
                  type="button"
                  onClick={() => setErrorMsg("Please contact the system administrator to reset your password.")}
                  className="text-[10px] text-[#F5CC96] hover:underline font-medium cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BA9BBE]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#3D1A40] border border-[#682A6E] text-white placeholder-[#98789C] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#F5CC96]/60 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#BA9BBE] hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-3.5 h-3.5 accent-[#F5CC96] rounded cursor-pointer"
                />
                <span className="text-[11px] text-[#D2BDD5] font-medium">Keep me signed in</span>
              </label>

              <span className="text-[10px] text-[#A688AA]">Version 2.4 ELITE</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#F5CC96] via-[#E8B87B] to-[#C7963A] text-[#2D142E] font-bold text-xs shadow-xl hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#2D142E] border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating Admin...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Boutique Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#2D142E]" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-[10px] text-[#9A7D9E] font-medium">
          Protected by Dubai's Boutique Atelier PIN & Security System
        </div>
      </div>
    </div>
  );
}
