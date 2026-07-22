"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  FileCheck,
  User as UserIcon,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { logout } from "@/api/auth.api";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";

export interface DashboardNavbarProps {
  user?: {
    fullName?: string;
    email?: string;
    avatarUrl?: string;
  } | null;
  onLogout?: () => void;
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

const Navbar: React.FC<DashboardNavbarProps> = ({
  user,
  onLogout,
  onMobileMenuToggle,
  isMobileMenuOpen = false,
}) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {data:CurrentUser, error:CurrentUserError}= useCurrentUser()
  console.log(CurrentUser)

  // const UserDetails = CurrentUserData?.data?.user || CurrentUserData?.data?.data?.user

  // Fallback user values
  const userName = user?.fullName || "Admin";
  const userEmail = user?.email || "admin@resumeforge.io";

  // Compute initials for avatar fallback
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Handle Logout
  const handleLogout = async () => {
    setIsDropdownOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      try {
        await logout();
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        router.push("/login");
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full h-16 border-b-2 border-red-600 bg-white px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 transition-colors">
      
      {/* Left: Brand Logo (Optimized for Small Devices) */}
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 group focus:outline-none p-1"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-red-600 border-2 border-red-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200 shrink-0">
            <FileCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-none">
              Resume<span className="text-red-600 group-hover:text-red-700 transition-colors">Forge</span>
            </span>
            <span className="hidden xs:inline-flex items-center px-1.5 py-0.5 text-[9px] sm:text-[10px] font-black bg-red-600 text-white border border-red-700">
              PRO
            </span>
          </div>
        </Link>
      </div>

      {/* Middle: Welcome Message (Optimized / Hidden on Mobile to Avoid Crowding) */}
      <div className="hidden md:flex items-center">
        <div className="px-4 py-1.5 bg-white border-2 border-red-600 text-xs sm:text-sm font-extrabold text-slate-900 shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]">
          Welcome back, <span className="text-red-600">{CurrentUser?.fullName}</span> 👋
        </div>
      </div>

      {/* Right: User Avatar Menu & Mobile Menu Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-expanded={isDropdownOpen}
            aria-label="User menu"
            className="flex items-center gap-1.5 sm:gap-2.5 p-1 bg-white border-2 border-slate-300 hover:border-red-600 focus:outline-none transition-all"
          >
            <div className="relative">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-600 border border-red-700 flex items-center justify-center text-white font-black text-xs">
                {initials}
              </div>
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border border-black" />
            </div>

            <div className="hidden sm:flex flex-col text-left pr-1">
              <span className="text-xs font-extrabold text-slate-900 leading-tight">
                {userName}
              </span>
              <span className="text-[10px] text-red-600 font-bold">
                Pro Member
              </span>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180 text-red-600" : ""
              }`}
            />
          </button>

          {/* User Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white border-2 border-red-600 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] py-2 z-50 animate-in fade-in duration-150 origin-top-right">
              {/* Header */}
              <div className="px-3.5 py-2.5 border-b-2 border-red-600/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-red-600 border border-red-700 flex items-center justify-center text-white font-black text-xs shrink-0">
                    {CurrentUser?.role}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate">
                      {CurrentUser.fullName}
                    </p>
                    <p className="text-[10px] font-medium text-slate-600 truncate">
                      {CurrentUser.email}
                    </p>
                    <span className="mt-1 inline-flex items-center gap-1 w-max px-1.5 py-0.5 text-[9px] font-black bg-red-600 text-white">
                      <Sparkles className="w-2.5 h-2.5" />
                      Pro Plan
                    </span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="py-1 px-1 space-y-0.5">
                <Link
                  href="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-900 border border-transparent hover:border-red-600 hover:bg-red-50 hover:text-red-600 transition-colors group"
                >
                  <UserIcon className="w-4 h-4 text-slate-600 group-hover:text-red-600 transition-colors" />
                  <span>Profile</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-900 border border-transparent hover:border-red-600 hover:bg-red-50 hover:text-red-600 transition-colors group"
                >
                  <Settings className="w-4 h-4 text-slate-600 group-hover:text-red-600 transition-colors" />
                  <span>Settings</span>
                </Link>
              </div>

              {/* Logout */}
              <div className="pt-1 mt-1 border-t-2 border-red-600/20 px-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-black text-red-600 border border-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-colors group"
                >
                  <LogOut className="w-4 h-4 text-red-600 group-hover:text-white group-hover:scale-110 transition-all" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Sidebar Toggle Button (Positioned on the right for right-drawer opening) */}
        <button
          type="button"
          onClick={onMobileMenuToggle}
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="lg:hidden p-1.5 sm:p-2 text-slate-900 hover:text-white hover:bg-red-600 border-2 border-red-600 focus:outline-none transition-all shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;