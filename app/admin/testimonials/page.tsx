"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import type { Testimonial } from "@/lib/types"
import { Plus, Save, Trash2, Quote } from "lucide-react"
import { testimonialsService } from "@/lib/api/testimonials"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"



export default function TestimonialsManagement() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    useEffect(() => {
        fetchTestimonials()
    }, [])

    const fetchTestimonials = async () => {
        try {
            const data = await testimonialsService.getAdminTestimonials()
            setTestimonials(data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load testimonials",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSaveOrder = async () => {
        setIsSaving(true)
        try {
            const orderData = testimonials.map((t, index) => ({
                id: t._id,
                order: index + 1
            }));

            await testimonialsService.reorderTestimonials(orderData);

            toast({
                title: "Success",
                description: "Testimonials updated successfully",
            })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update testimonials",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleAddTestimonial = () => {
        const newTestimonial: Testimonial = {
            _id: "",
            name: "",
            role: "",
            company: "",
            content: "",
            avatar: "/placeholder.svg?height=100&width=100",
            isActive: true,
            order: testimonials.length + 1,
        }
        setEditingTestimonial(newTestimonial)
        setIsDialogOpen(true)
    }

    const handleEditTestimonial = (testimonial: Testimonial) => {
        setEditingTestimonial({ ...testimonial })
        setIsDialogOpen(true)
    }

    const handleSaveTestimonial = async () => {
        if (!editingTestimonial) return

        try {
            if (editingTestimonial._id) {
                await testimonialsService.updateTestimonial(editingTestimonial._id, editingTestimonial)
                toast({ title: "Success", description: "Testimonial updated" })
            } else {
                const { _id, ...data } = editingTestimonial
                await testimonialsService.createTestimonial(data)
                toast({ title: "Success", description: "Testimonial created" })
            }
            setIsDialogOpen(false)
            setEditingTestimonial(null)
            fetchTestimonials()
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" })
        }
    }

    const handleDeleteTestimonial = async (id: string) => {
        if (!confirm("Are you sure?")) return
        try {
            await testimonialsService.deleteTestimonial(id)
            fetchTestimonials()
            toast({ title: "Success", description: "Testimonial deleted" })
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" })
        }
    }

    const handleToggleVisibility = async (testimonial: Testimonial) => {
        try {
            await testimonialsService.toggleTestimonial(testimonial._id)
            setTestimonials(testimonials.map(t =>
                t._id === testimonial._id ? { ...t, isActive: !t.isActive } : t
            ))
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" })
        }
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Testimonials Management</h1>
                    <p className="text-muted-foreground">
                        Manage client testimonials and reviews
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleAddTestimonial}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Testimonial
                    </Button>
                    <Button onClick={handleSaveOrder} disabled={isSaving}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? "Saving..." : "Save Order"}
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                {testimonials.map((testimonial) => (
                    <Card key={testimonial._id}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <Quote className="h-8 w-8 text-primary flex-shrink-0" />
                                    <div className="space-y-1">
                                        <CardTitle>{testimonial.name || "Unnamed Client"}</CardTitle>
                                        <CardDescription>
                                            {testimonial.role} {testimonial.company && `at ${testimonial.company}`}
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEditTestimonial(testimonial)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDeleteTestimonial(testimonial._id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground italic mb-3">
                                "{testimonial.content}"
                            </p>
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={testimonial.isActive}
                                    onCheckedChange={() => handleToggleVisibility(testimonial)}
                                />
                                <span className="text-sm">Visible</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingTestimonial?.name
                                ? "Edit Testimonial"
                                : "Add New Testimonial"}
                        </DialogTitle>
                        <DialogDescription>
                            Enter the client testimonial details
                        </DialogDescription>
                    </DialogHeader>
                    {editingTestimonial && (
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Client Name</Label>
                                    <Input
                                        value={editingTestimonial.name}
                                        onChange={(e) =>
                                            setEditingTestimonial({
                                                ...editingTestimonial,
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Input
                                        value={editingTestimonial.role}
                                        onChange={(e) =>
                                            setEditingTestimonial({
                                                ...editingTestimonial,
                                                role: e.target.value,
                                            })
                                        }
                                        placeholder="CEO, Product Manager, etc."
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Company</Label>
                                <Input
                                    value={editingTestimonial.company}
                                    onChange={(e) =>
                                        setEditingTestimonial({
                                            ...editingTestimonial,
                                            company: e.target.value,
                                        })
                                    }
                                    placeholder="Company name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Testimonial Content</Label>
                                <Textarea
                                    value={editingTestimonial.content}
                                    onChange={(e) =>
                                        setEditingTestimonial({
                                            ...editingTestimonial,
                                            content: e.target.value,
                                        })
                                    }
                                    rows={4}
                                    placeholder="What did the client say about your work?"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Avatar URL</Label>
                                <Input
                                    value={editingTestimonial.avatar}
                                    onChange={(e) =>
                                        setEditingTestimonial({
                                            ...editingTestimonial,
                                            avatar: e.target.value,
                                        })
                                    }
                                    placeholder="/avatar.jpg"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Upload image to /public folder and enter the path here
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={editingTestimonial.isActive}
                                    onCheckedChange={(checked) =>
                                        setEditingTestimonial({
                                            ...editingTestimonial,
                                            isActive: checked,
                                        })
                                    }
                                />
                                <Label>Visible</Label>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveTestimonial}>Save Testimonial</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
