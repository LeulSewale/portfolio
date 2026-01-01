"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import type { SectionConfig, NavigationItem } from "@/lib/types"
import { Save } from "lucide-react"

import { settingsService } from "@/lib/api/settings"

export default function SettingsManagement() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [sections, setSections] = useState<SectionConfig[]>([])
    const [navigation, setNavigation] = useState<NavigationItem[]>([])

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const data = await settingsService.getSettings()
            if (data) {
                setSections(data.sections || [])
                setNavigation(data.navigation || [])
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load settings",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await settingsService.updateSettings({ sections, navigation })

            toast({
                title: "Success",
                description: "Settings updated successfully",
            })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update settings",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">
                        Configure section visibility and navigation
                    </p>
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Section Visibility</CardTitle>
                    <CardDescription>
                        Control which sections are displayed on your public portfolio
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {sections.map((section) => (
                            <div key={section.id} className="flex items-center justify-between p-3 border rounded">
                                <div>
                                    <h4 className="font-medium">{section.title}</h4>
                                    <p className="text-sm text-muted-foreground">Order: {section.order}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={section.visible}
                                            onCheckedChange={(checked) => {
                                                const updated = sections.map((s) =>
                                                    s.id === section.id ? { ...s, visible: checked } : s
                                                )
                                                setSections(updated)
                                            }}
                                        />
                                        <span className="text-sm">Visible</span>
                                    </div>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={section.order}
                                        onChange={(e) => {
                                            const updated = sections.map((s) =>
                                                s.id === section.id ? { ...s, order: parseInt(e.target.value) || 1 } : s
                                            )
                                            setSections(updated)
                                        }}
                                        className="w-20"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Navigation Items</CardTitle>
                    <CardDescription>
                        Configure navigation menu items
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {navigation.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 border rounded">
                                <div className="flex-1 grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-xs">Label</Label>
                                        <Input
                                            value={item.label}
                                            onChange={(e) => {
                                                const updated = [...navigation]
                                                updated[index] = { ...item, label: e.target.value }
                                                setNavigation(updated)
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Link</Label>
                                        <Input
                                            value={item.href}
                                            onChange={(e) => {
                                                const updated = [...navigation]
                                                updated[index] = { ...item, href: e.target.value }
                                                setNavigation(updated)
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={item.visible}
                                        onCheckedChange={(checked) => {
                                            const updated = [...navigation]
                                            updated[index] = { ...item, visible: checked }
                                            setNavigation(updated)
                                        }}
                                    />
                                    <span className="text-sm">Visible</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
