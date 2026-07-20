"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const router = useRouter();
  const { data, isLoading } = useCurrentUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !data) {
      router.replace("/login");
    }
  }, [data, isLoading, router]);

  // Extract user payload from Axios response data
  const user = data?.data;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      {/* Dashboard Top Navbar */}
      <Navbar
        user={user}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen((prev) => !prev)}
      />

      {/* Main Container with Sidebar Offset on Desktop */}
      <div className="flex flex-1 relative bg-white lg:pl-64">
        {/* Fixed Desktop Sidebar & Right Mobile Drawer */}
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          user={user}
        />

        {/* Dashboard Children Main Content (Subtle increase to max-w-7xl / 1280px) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;