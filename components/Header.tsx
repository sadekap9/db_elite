"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  Crown,
  LogOut,
  UserCheck,
  Check,
  X,
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Save,
  Menu,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onSearchChange?: (val: string) => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export default function Header({ onSearchChange, onToggleSidebar }: HeaderProps) {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Admin Profile & Security State
  const [adminName, setAdminName] = useState("Siddiqa Parveen");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load saved admin name from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("dubai_boutique_admin_name");
      if (savedName) setAdminName(savedName);
    }
  }, []);

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || "SP";
  };

  const adminInitials = getInitials(adminName);
  const firstName = adminName.trim().split(" ")[0] || "Admin";

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveProfileSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      showToast("Error: New passwords do not match!");
      return;
    }

    if (newPassword && !currentPassword) {
      showToast("Error: Please enter your current password to update password.");
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("dubai_boutique_admin_name", adminName);
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsProfileModalOpen(false);
    showToast("Admin profile & name updated successfully!");
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsAdminMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full relative z-40">
      {/* Toast Banner */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-[100] bg-[#2D142E] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#F5CC96]/60 text-xs font-semibold flex items-center gap-3 animate-in slide-in-from-top-3 fade-in duration-300">
          <div className="w-7 h-7 rounded-full bg-[#F5CC96]/20 flex items-center justify-center text-[#F5CC96] shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white block text-xs">{toastMsg}</span>
            <span className="text-[10px] text-[#D2BDD5] font-medium block">Dubai&apos;s Boutique Admin</span>
          </div>
          <button
            onClick={() => setToastMsg(null)}
            className="ml-2 p-1 text-[#BA9BBE] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Unified Luxury Header Card with Full-Height Hero Background */}
      <div className="w-full relative rounded-3xl bg-gradient-to-r from-[#FAF3FA] via-[#FAF4F8] to-[#F5EAF1] border border-[#EADBEE] p-5 md:p-6 shadow-2xs min-h-[170px] flex flex-col justify-between gap-6">
        {/* Background Image of Fashion Woman on the Right Edge (Full Height) */}
        <div
          className="absolute right-0 top-0 bottom-0 w-[45%] lg:w-[40%] bg-cover bg-center pointer-events-none z-0 opacity-90 hidden md:block rounded-r-3xl overflow-hidden"
          style={{ backgroundImage: `url('/dubaiboutique_girl.png')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF4F8] via-[#FAF4F8]/40 to-transparent" />
        </div>

        {/* Top Row: Search Bar & Admin Controls */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="md:hidden p-2 rounded-full bg-white/90 border border-[#E3D3E5] text-[#4D2051] hover:bg-[#EADBEE] transition-all cursor-pointer shadow-2xs shrink-0"
                title="Toggle Menu"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}
            {/* Search Bar */}
            <div className="relative w-full sm:w-80 md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C718F]" />
              <input
                type="text"
                placeholder="Search customers by name, phone or dress..."
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white/90 border border-[#E3D3E5] text-xs font-medium text-[#2D142E] placeholder-[#957C98] focus:outline-none focus:ring-2 focus:ring-[#713476]/30 transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3.5 self-end sm:self-auto relative">
            {/* Notification Button & Popup */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setIsNotificationsOpen((prev) => !prev);
                  setIsAdminMenuOpen(false);
                }}
                className="relative p-2 rounded-full bg-white/90 border border-[#E3D3E5] text-[#4D2051] hover:bg-[#EADBEE] transition-all cursor-pointer shadow-2xs"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#E54848] border border-white animate-ping" />
                <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#E54848] border border-white" />
              </button>

              {/* Notification Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 top-12 z-[100] w-80 bg-white rounded-3xl p-4 shadow-2xl border border-[#E4CEE6] animate-in fade-in slide-in-from-top-2 duration-200 text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#F2E4F3] pb-2.5">
                    <span className="font-serif font-bold text-[#2D142E] text-sm flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-[#682A6E]" />
                      <span>Notifications & Alerts</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#F5ECF6] text-[#79347E] text-[10px] font-bold">
                      3 New
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2.5 rounded-2xl bg-[#FAF3FA] border border-[#EEDBF0] space-y-1">
                      <span className="font-bold text-[#2D142E] block">
                        Ayesha Al-Maktoum (11/12 Dresses)
                      </span>
                      <span className="text-[10px] text-[#7E6380] block">
                        1 dress away from unlocking Elite Circle VIP status!
                      </span>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-[#FAF3FA] border border-[#EEDBF0] space-y-1">
                      <span className="font-bold text-[#2D142E] block">
                        Birthday Alert: Sheikha Mariam
                      </span>
                      <span className="text-[10px] text-[#7E6380] block">
                        Birthday coming up on 12 Sep. Dispatch greeting!
                      </span>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-[#FAF3FA] border border-[#EEDBF0] space-y-1">
                      <span className="font-bold text-[#2D142E] block">
                        Fitting Appointment Confirmed
                      </span>
                      <span className="text-[10px] text-[#7E6380] block">
                        Fatima Al-Zahra • Rose Gold Abaya fitting scheduled.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Card & Admin Popup Dropdown */}
            <div className="relative" ref={menuRef}>
              <div
                onClick={() => {
                  setIsAdminMenuOpen((prev) => !prev);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-2 pl-1.5 py-0.5 pr-2.5 rounded-full bg-white border border-[#EBDDEE] shadow-2xs cursor-pointer hover:shadow-xs hover:border-[#682A6E]/40 transition-all select-none"
              >
                <div className="w-7 h-7 rounded-full bg-[#3D1A40] text-[#F3D5FA] font-bold text-xs flex items-center justify-center shadow-inner">
                  {adminInitials}
                </div>
                <div className="text-left leading-none">
                  <span className="text-xs font-bold text-[#2D142E] block">Hi, {firstName}!</span>
                  <span className="text-[9px] text-[#8C718F] font-medium block mt-0.5">Owner</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#8C718F] ml-0.5 transition-transform duration-200 ${
                    isAdminMenuOpen ? "rotate-180 text-[#682A6E]" : ""
                  }`}
                />
              </div>

              {/* ADMIN POPUP DROPDOWN OVERLAY (Only View Profile & Log Out) */}
              {isAdminMenuOpen && (
                <div className="absolute right-0 top-12 z-[100] w-76 bg-white rounded-3xl p-4 shadow-2xl border border-[#E4CEE6] animate-in fade-in slide-in-from-top-2 duration-200 text-xs space-y-4">
                  {/* Admin Profile Header */}
                  <div className="flex items-center gap-3 bg-gradient-to-br from-[#FAF3FA] to-[#F5EAF7] p-3.5 rounded-2xl border border-[#EEDBF0]">
                    <div className="w-11 h-11 rounded-full bg-[#2D142E] text-[#F5CC96] font-bold text-sm flex items-center justify-center border-2 border-[#D9BEDC] shadow-md shrink-0">
                      {adminInitials}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#2D142E] text-xs truncate">
                          {adminName}
                        </span>
                        <UserCheck className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                      </div>
                    </div>
                  </div>

                  {/* Actions: View Profile */}
                  <div className="space-y-1 pt-1 border-t border-[#F2E4F3]">
                    <button
                      onClick={() => {
                        setIsAdminMenuOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#FAF3FA] text-[#2D142E] font-semibold transition-colors cursor-pointer text-left"
                    >
                      <User className="w-4 h-4 text-[#682A6E]" />
                      <span>View Profile</span>
                    </button>
                  </div>

                  {/* Log Out */}
                  <div className="pt-1 border-t border-[#F2E4F3]">
                    <button
                      onClick={async () => {
                        setIsAdminMenuOpen(false);
                        try {
                          await fetch("/api/auth/logout", { method: "POST" });
                        } catch (err) {
                          console.log("Logout API fallback:", err);
                        }
                        if (typeof window !== "undefined") {
                          localStorage.removeItem("dubai_boutique_admin_auth");
                        }
                        showToast("Admin logged out successfully.");
                        setTimeout(() => {
                          router.push("/login");
                        }, 500);
                      }}
                      className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-600" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Row: Greeting & Center Quote */}
        <div className="relative z-10 pt-2 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Side: Greeting */}
          <div className="space-y-1.5 max-w-sm md:max-w-md">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#2D142E] tracking-tight flex items-center gap-2">
              <span>Good Morning, {firstName}!</span>
              <span className="text-[#A567A8] font-normal text-xl">♡</span>
            </h1>
            <p className="text-xs md:text-sm text-[#6E4F71] font-medium">
              Let&apos;s make more women feel special today.
            </p>
          </div>

          {/* Center Quote */}
          <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-1 px-8 border-x border-[#E9D5EC]">
            <p className="font-serif italic text-sm md:text-base text-[#4D2051] leading-snug">
              &ldquo;Fashion creates confident women.&rdquo;
            </p>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#9A739D] uppercase">
              — DUBAI&apos;S BOUTIQUE
            </span>
          </div>

          {/* Right Spacer to preserve layout over woman background */}
          <div className="hidden md:block w-36 lg:w-48 shrink-0" />
        </div>
      </div>

      {/* EDIT ADMIN PROFILE & CHANGE PASSWORD MODAL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#E4CEE6] relative space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-[#8C718F] hover:text-[#2D142E] hover:bg-[#F3EBF5] rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-4 border-b border-[#F2E4F3] pb-4">
              <div className="w-16 h-16 rounded-full bg-[#2D142E] text-[#F5CC96] font-serif font-bold text-xl flex items-center justify-center border-4 border-[#D9BEDC] shadow-md relative shrink-0">
                {adminInitials}
                <div className="absolute bottom-0 right-0 p-1 rounded-full bg-[#25D366] text-white border-2 border-white">
                  <UserCheck className="w-3 h-3" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#2D142E]">{adminName}</h3>
                <p className="text-xs text-[#8C718F] font-medium">Boutique Owner & Admin</p>
                <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FCF6E7] text-[#C7963A] border border-[#F4E3C1]">
                  <Crown className="w-3 h-3 text-[#C7963A]" />
                  <span>Super Admin</span>
                </span>
              </div>
            </div>

            {/* Form to Update Name & Change Password */}
            <form onSubmit={handleSaveProfileSecurity} className="space-y-4 text-xs">
              {/* Section 1: Admin Name & Phone */}
              <div className="bg-[#FAF3FA] p-4 rounded-2xl border border-[#EEDBF0] space-y-3">
                <div className="flex items-center gap-2 text-[#2D142E] font-bold text-xs pb-1 border-b border-[#EBD6EE]">
                  <User className="w-4 h-4 text-[#682A6E]" />
                  <span>Admin Information</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#6E4F71] mb-1">
                    Admin Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C718F]" />
                    <input
                      type="text"
                      required
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="Enter Admin Name"
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-[#E3D0E5] text-[#2D142E] font-bold focus:outline-none focus:ring-2 focus:ring-[#682A6E]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#6E4F71] mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C718F]" />
                    <input
                      type="text"
                      disabled
                      value="+91 98765 43210"
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#F0E4F2] border border-[#D9C4DC] text-[#7A617D] font-mono cursor-not-allowed font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Change Password */}
              <div className="bg-[#FAF3FA] p-4 rounded-2xl border border-[#EEDBF0] space-y-3">
                <div className="flex items-center justify-between border-b border-[#EBD6EE] pb-1">
                  <div className="flex items-center gap-2 text-[#2D142E] font-bold text-xs">
                    <Lock className="w-4 h-4 text-[#682A6E]" />
                    <span>Change Admin Password</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-[10px] text-[#682A6E] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="w-3 h-3" /> Hide Passwords
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" /> Show Passwords
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#6E4F71] mb-1">
                    Current Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E3D0E5] text-[#2D142E] focus:outline-none focus:ring-2 focus:ring-[#682A6E]/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E4F71] mb-1">
                      New Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E3D0E5] text-[#2D142E] focus:outline-none focus:ring-2 focus:ring-[#682A6E]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E4F71] mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E3D0E5] text-[#2D142E] focus:outline-none focus:ring-2 focus:ring-[#682A6E]/30"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-[#F0E4F2] hover:bg-[#E4D0E7] text-[#2D142E] text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-[#2D142E] hover:bg-[#451F47] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                >
                  <Save className="w-4 h-4 text-[#F5CC96]" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}


