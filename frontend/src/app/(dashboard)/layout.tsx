"use client";

import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface DashboardLayoutProps {
    children: ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const router = useRouter()
    const { data, isLoading } = useCurrentUser()

    useEffect(() => {
        if (!isLoading && !data) {
            router.replace("/login")
        }
    }, [data, isLoading, router])

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 border-r p-4">
                Sidebar
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
                {/* Navbar */}
                <header className="h-16 border-b flex items-center px-6">
                    Navbar
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout