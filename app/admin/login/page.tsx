"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Lock } from "lucide-react"
import { authService } from "@/lib/api/auth"

export default function AdminLoginPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [credentials, setCredentials] = useState({ username: "", password: "" })
    const [isLoading, setIsLoading] = useState(false)
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)

    // If already authenticated, go straight to dashboard
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const result = (await authService.verifyToken()) as { isAuthenticated?: boolean }
                if (result?.isAuthenticated) {
                    router.replace("/admin")
                }
            } finally {
                setIsCheckingAuth(false)
            }
        }
        checkAuth()
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await authService.login(credentials.username, credentials.password)

            toast({
                title: "Login successful",
                description: "Redirecting to admin dashboard...",
            })
            router.replace("/admin")
        } catch (error: any) {
            toast({
                title: "Login failed",
                description: error.message || "Invalid credentials",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (isCheckingAuth) {
        return null
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/50">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <Lock className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access the admin panel
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter username"
                                value={credentials.username}
                                onChange={(e) =>
                                    setCredentials({ ...credentials, username: e.target.value })
                                }
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                value={credentials.password}
                                onChange={(e) =>
                                    setCredentials({ ...credentials, password: e.target.value })
                                }
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
