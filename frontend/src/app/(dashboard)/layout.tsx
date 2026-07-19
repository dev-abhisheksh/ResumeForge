import { ReactNode } from "react";

interface DashboardLayoutProps {
    children: ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
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