"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import type { SkillCategory, Skill } from "@/lib/types"
import { Plus, Save, Trash2, Code, Layout, Database, Smartphone, Layers, Gauge, Workflow, GitBranch } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const iconMap: Record<string, any> = {
    Code,
    Layout,
    Database,
    Smartphone,
    Layers,
    Gauge,
    Workflow,
    GitBranch,
}

import { skillsService } from "@/lib/api/skills"

export default function SkillsManagement() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([])
    const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newSkillName, setNewSkillName] = useState("")

    useEffect(() => {
        fetchSkills()
    }, [])

    const fetchSkills = async () => {
        try {
            const data = await skillsService.getAdminSkills()
            setSkillCategories(data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load skills",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSaveOrder = async () => {
        setIsSaving(true)
        try {
            const orderData = skillCategories.map((c, index) => ({
                id: c._id,
                order: index + 1
            }));

            await skillsService.reorderCategories(orderData);

            toast({
                title: "Success",
                description: "Skills updated successfully",
            })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update skills",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleAddCategory = () => {
        const newCategory: SkillCategory = {
            _id: "",
            categoryId: `category-${Date.now()}`,
            title: "",
            description: "",
            icon: "Code",
            skills: [],
            isActive: true,
            order: skillCategories.length + 1,
        }
        setEditingCategory(newCategory)
        setIsDialogOpen(true)
    }

    const handleEditCategory = (category: SkillCategory) => {
        setEditingCategory({ ...category })
        setIsDialogOpen(true)
    }

    const handleSaveCategory = async () => {
        if (!editingCategory) return

        try {
            if (editingCategory._id) {
                // Update
                await skillsService.updateCategory(editingCategory._id, editingCategory)
                toast({ title: "Success", description: "Category updated" })
            } else {
                // Create
                const { _id, ...data } = editingCategory
                await skillsService.createCategory(data)
                toast({ title: "Success", description: "Category created" })
            }

            setIsDialogOpen(false)
            setEditingCategory(null)
            fetchSkills()
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" })
        }
    }

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Are you sure?")) return
        try {
            await skillsService.deleteCategory(id)
            fetchSkills()
            toast({ title: "Success", description: "Category deleted" })
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" })
        }
    }

    const handleToggleVisibility = async (category: SkillCategory) => {
        try {
            await skillsService.toggleCategory(category._id)
            setSkillCategories(skillCategories.map(c =>
                c._id === category._id ? { ...c, isActive: !c.isActive } : c
            ))
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" })
        }
    }

    const handleAddSkill = () => {
        if (!editingCategory || !newSkillName.trim()) return
        const newSkill: Skill = {
            name: newSkillName.trim(),
            level: 80,
        }
        setEditingCategory({
            ...editingCategory,
            skills: [...editingCategory.skills, newSkill],
        })
        setNewSkillName("")
    }

    const handleRemoveSkill = (skillName: string) => {
        if (!editingCategory) return
        setEditingCategory({
            ...editingCategory,
            skills: editingCategory.skills.filter((s) => s.name !== skillName),
        })
    }

    const handleUpdateSkillLevel = (skillName: string, level: number) => {
        if (!editingCategory) return
        setEditingCategory({
            ...editingCategory,
            skills: editingCategory.skills.map((s) =>
                s.name === skillName ? { ...s, level } : s
            ),
        })
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Skills Management</h1>
                    <p className="text-muted-foreground">
                        Manage your skills and categories
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleAddCategory}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                    </Button>
                    <Button onClick={handleSaveOrder} disabled={isSaving}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? "Saving..." : "Save Order"}
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {skillCategories.map((category) => {
                    const Icon = iconMap[category.icon] || Code
                    return (
                        <Card key={category._id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Icon className="h-5 w-5 text-primary" />
                                            <CardTitle className="text-lg">{category.title}</CardTitle>
                                        </div>
                                        <CardDescription className="text-sm">
                                            {category.description}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        {category.skills.map((skill) => (
                                            <div key={skill.name} className="text-sm">
                                                • {skill.name}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <Switch
                                            checked={category.isActive}
                                            onCheckedChange={() => handleToggleVisibility(category)}
                                        />
                                        <span className="text-sm">Visible</span>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => handleEditCategory(category)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDeleteCategory(category._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory?.title ? "Edit Category" : "Add New Category"}
                        </DialogTitle>
                        <DialogDescription>
                            Enter the category details and skills
                        </DialogDescription>
                    </DialogHeader>
                    {editingCategory && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Category Title</Label>
                                <Input
                                    value={editingCategory.title}
                                    onChange={(e) =>
                                        setEditingCategory({
                                            ...editingCategory,
                                            title: e.target.value,
                                        })
                                    }
                                    placeholder="e.g., Frontend Development"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={editingCategory.description}
                                    onChange={(e) =>
                                        setEditingCategory({
                                            ...editingCategory,
                                            description: e.target.value,
                                        })
                                    }
                                    rows={2}
                                    placeholder="Brief description of this skill category"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Icon</Label>
                                <Select
                                    value={editingCategory.icon}
                                    onValueChange={(value) =>
                                        setEditingCategory({ ...editingCategory, icon: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(iconMap).map((iconName) => (
                                            <SelectItem key={iconName} value={iconName}>
                                                {iconName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Skills</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newSkillName}
                                        onChange={(e) => setNewSkillName(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                handleAddSkill()
                                            }
                                        }}
                                        placeholder="Add a skill"
                                    />
                                    <Button type="button" onClick={handleAddSkill}>
                                        Add
                                    </Button>
                                </div>
                                <div className="space-y-2 mt-3">
                                    {editingCategory.skills.map((skill) => (
                                        <div
                                            key={skill.name}
                                            className="flex items-center gap-2 p-2 border rounded"
                                        >
                                            <span className="flex-1">{skill.name}</span>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={skill.level || 80}
                                                onChange={(e) =>
                                                    handleUpdateSkillLevel(
                                                        skill.name,
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                className="w-20"
                                            />
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleRemoveSkill(skill.name)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={editingCategory.isActive}
                                    onCheckedChange={(checked) =>
                                        setEditingCategory({ ...editingCategory, isActive: checked })
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
                        <Button onClick={handleSaveCategory}>Save Category</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
