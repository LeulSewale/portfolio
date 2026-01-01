"use client"

import { usePathname } from "next/navigation"
import { AdminNav } from "@/components/admin/admin-nav"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isLogin = pathname === "/admin/login"

    if (isLogin) {
        // Standalone login layout: no sidebar, fully centered
        return (
            <main className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-full max-w-xl px-4">{children}</div>
            </main>
        )
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <AdminNav />
            <main className="flex-1 overflow-y-auto">
                <div className="container py-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
