"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  User,
  Settings,
  X,
  Projector,
} from "lucide-react";
import { useResume } from "@/hooks/resume/useResumes";

export interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  user?: {
    fullName?: string;
    email?: string;
  } | null;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Resumes",
    href: "/resumes",
    icon: FileText,
  },
  {
    label: "Resume Analysis",
    href: "/analysis",
    icon: Sparkles,
    badge: "AI",
  },
  {
    label: "Tailor Resume",
    href: "/tailor",
    icon: Sparkles,
    badge: "SOON",
    isSoon: true,
  },
  {
    label: "Project Vault",
    href: "/project",
    icon: Projector,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    badge: "SOON",
    isSoon: true,
  },
];

const Sidebar: React.FC<DashboardSidebarProps> = ({
  isOpen = false,
  onClose,
}) => {
  const pathname = usePathname();
  const { data: resumeData } = useResume();
  const resumeCount = Array.isArray(resumeData)
    ? resumeData.length
    : (resumeData as any)?.data?.length || (resumeData as any)?.resumes?.length || 0;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 right-0 lg:left-0 lg:right-auto lg:top-16 lg:bottom-0 z-40 w-64 bg-white border-l-2 lg:border-l-0 lg:border-r-2 border-red-600 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
          isOpen ? "translate-x-0 shadow-2xl shadow-red-950/20" : "translate-x-full lg:translate-x-0 lg:shadow-none"
        }`}
      >
        <div className="py-3">
          {/* Mobile Only Header with Close Button */}
          <div className="flex items-center justify-between px-4 pb-3 lg:hidden border-b-2 border-red-600">
            <span className="text-xs font-black text-red-600 uppercase tracking-wider">
              Navigation Menu
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close sidebar"
              className="p-1.5 text-slate-800 hover:text-white hover:bg-red-600 border-2 border-red-600 focus:outline-none transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-2">
            <div className="px-3 pt-2 pb-1 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Navigation
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname?.startsWith(item.href));

              if (item.isSoon) {
                return (
                  <div
                    key={item.href}
                    className="relative flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-extrabold bg-slate-50 text-slate-400 border-2 border-slate-200 cursor-not-allowed opacity-70"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 stroke-[2.2] text-slate-400" />
                      <span>{item.label}</span>
                    </div>

                    <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-black bg-amber-500 text-white uppercase tracking-wider border border-amber-600">
                      SOON
                    </span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`relative flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-extrabold transition-all duration-150 border-2 ${
                    isActive
                      ? "bg-red-600 text-white border-red-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-white text-slate-800 border-slate-200 hover:border-red-600 hover:text-red-600 hover:bg-red-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 stroke-[2.2] ${
                        isActive ? "text-white" : "text-slate-600 group-hover:text-red-600"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.label === "My Resumes" ? (
                    <span
                      className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-black border ${
                        isActive
                          ? "bg-white text-red-700 border-white"
                          : "bg-red-50 text-red-700 border-red-600/30"
                      }`}
                    >
                      {resumeCount}
                    </span>
                  ) : item.badge ? (
                    <span
                      className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider border ${
                        isActive
                          ? "bg-white text-red-700 border-white"
                          : "bg-red-600 text-white border-red-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
