"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, FolderKanban, MessageSquare, User } from "lucide-react"
import type { PortfolioContent } from "@/lib/types"

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        projects: 0,
        skills: 0,
        testimonials: 0,
        lastUpdated: "",
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const response = await fetch("/api/content")
            const data = await response.json()

            if (data.success) {
                const content: PortfolioContent = data.data
                setStats({
                    projects: content.projects.length,
                    skills: content.skillCategories.reduce(
                        (acc, cat) => acc + cat.skills.length,
                        0
                    ),
                    testimonials: content.testimonials.length,
                    lastUpdated: new Date(content.updatedAt).toLocaleString(),
                })
            }
        } catch (error) {
            console.error("Error fetching stats:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const statCards = [
        {
            title: "Projects",
            value: stats.projects,
            icon: FolderKanban,
            description: "Total projects in portfolio",
        },
        {
            title: "Skills",
            value: stats.skills,
            icon: Code,
            description: "Total skills listed",
        },
        {
            title: "Testimonials",
            value: stats.testimonials,
            icon: MessageSquare,
            description: "Client testimonials",
        },
        {
            title: "Profile",
            value: "✓",
            icon: User,
            description: "Profile information",
        },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome to your portfolio admin panel
                </p>
            </div>

            {!isLoading && stats.lastUpdated && (
                <p className="text-sm text-muted-foreground">
                    Last updated: {stats.lastUpdated}
                </p>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {isLoading ? "..." : stat.value}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                        Manage your portfolio content from the navigation menu
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm">
                        <p>• Update your profile information</p>
                        <p>• Add or edit skills and categories</p>
                        <p>• Manage project portfolio</p>
                        <p>• Add client testimonials</p>
                        <p>• Configure section visibility and ordering</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
