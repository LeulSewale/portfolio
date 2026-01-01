"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
    LayoutDashboard,
    User,
    Code,
    FolderKanban,
    MessageSquare,
    Settings,
    LogOut,
} from "lucide-react"

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Profile", href: "/admin/profile", icon: User },
    { name: "Skills", href: "/admin/skills", icon: Code },
    { name: "Projects", href: "/admin/projects", icon: FolderKanban },
    { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
    { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminNav() {
    const pathname = usePathname()
    const router = useRouter()
    const { toast } = useToast()

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            })

            const data = await response.json()

            if (data.success) {
                toast({
                    title: "Logged out",
                    description: "You have been logged out successfully",
                })
                router.push("/")
                router.refresh()
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to logout",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="flex h-full w-64 flex-col border-r bg-muted/40">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/admin" className="flex items-center gap-2 font-semibold">
                    <LayoutDashboard className="h-6 w-6" />
                    <span>Admin Panel</span>
                </Link>
            </div>
            <ScrollArea className="flex-1 px-3 py-4">
                <div className="space-y-1">
                    {navigation.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={`w-full justify-start gap-2 ${isActive ? "bg-secondary" : ""
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.name}
                                </Button>
                            </Link>
                        )
                    })}
                </div>
            </ScrollArea>
            <div className="border-t p-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
                <Separator className="my-3" />
                <Link href="/" target="_blank">
                    <Button variant="outline" className="w-full">
                        View Public Site
                    </Button>
                </Link>
            </div>
        </div>
    )
}
