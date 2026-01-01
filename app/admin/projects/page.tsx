"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import type { Project } from "@/lib/types"
import { Plus, Save, Trash2, ExternalLink, ArrowUp, ArrowDown } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { projectsService } from "@/lib/api/projects"

export default function ProjectsManagement() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [projects, setProjects] = useState<Project[]>([])
    const [editingProject, setEditingProject] = useState<Project | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newTag, setNewTag] = useState("")

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const data = await projectsService.getAdminProjects()
            setProjects(data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load projects",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSaveOrder = async () => {
        setIsSaving(true)
        try {
            const orderData = projects.map((p, index) => ({
                id: p._id,
                order: index + 1
            }));

            await projectsService.reorderProjects(orderData);

            toast({
                title: "Success",
                description: "Project order updated successfully",
            })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update order",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleAddProject = () => {
        const newProject: Project = {
            _id: "", // Will be assigned by backend
            title: "",
            description: "",
            tags: [],
            imageUrl: "",
            liveUrl: "",
            githubUrl: "",
            isActive: true,
            order: projects.length + 1,
            featured: false,
        }
        setEditingProject(newProject)
        setIsDialogOpen(true)
    }

    const handleEditProject = (project: Project) => {
        setEditingProject({ ...project })
        setIsDialogOpen(true)
    }

    const handleSaveProject = async () => {
        if (!editingProject) return

        try {
            if (editingProject._id) {
                // Update existing
                await projectsService.updateProject(editingProject._id, editingProject)
                toast({ title: "Success", description: "Project updated" })
            } else {
                // Create new
                // Remove empty _id before sending
                const { _id, ...projectData } = editingProject
                await projectsService.createProject(projectData)
                toast({ title: "Success", description: "Project created" })
            }

            setIsDialogOpen(false)
            setEditingProject(null)
            fetchProjects() // Refresh list
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to save project",
                variant: "destructive",
            })
        }
    }

    const handleDeleteProject = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return

        try {
            await projectsService.deleteProject(id)
            toast({ title: "Success", description: "Project deleted" })
            fetchProjects()
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete project",
                variant: "destructive",
            })
        }
    }

    const handleToggleVisibility = async (project: Project) => {
        try {
            await projectsService.toggleProject(project._id)
            // Optimistic update
            const updatedProjects = projects.map((p) =>
                p._id === project._id ? { ...p, isActive: !p.isActive } : p
            )
            setProjects(updatedProjects)
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to toggle visibility",
                variant: "destructive",
            })
        }
    }

    const handleMoveProject = (index: number, direction: "up" | "down") => {
        const newProjects = [...projects]
        const swapIndex = direction === "up" ? index - 1 : index + 1

        if (swapIndex < 0 || swapIndex >= projects.length) return

            ;[newProjects[index], newProjects[swapIndex]] = [
                newProjects[swapIndex],
                newProjects[index],
            ]

        // Update local state immediately
        setProjects(newProjects)
    }

    const handleAddTag = () => {
        if (!editingProject || !newTag.trim()) return
        setEditingProject({
            ...editingProject,
            tags: [...editingProject.tags, newTag.trim()],
        })
        setNewTag("")
    }

    const handleRemoveTag = (tag: string) => {
        if (!editingProject) return
        setEditingProject({
            ...editingProject,
            tags: editingProject.tags.filter((t) => t !== tag),
        })
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Projects Management</h1>
                    <p className="text-muted-foreground">
                        Manage your project portfolio
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleAddProject}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Project
                    </Button>
                    <Button onClick={handleSaveOrder} disabled={isSaving}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? "Saving..." : "Save Order"}
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                {projects.map((project, index) => (
                    <Card key={project._id}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2">
                                        {project.title || "Untitled Project"}
                                        {project.featured && (
                                            <Badge variant="secondary">Featured</Badge>
                                        )}
                                    </CardTitle>
                                    <CardDescription>{project.description}</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleMoveProject(index, "up")}
                                        disabled={index === 0}
                                    >
                                        <ArrowUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleMoveProject(index, "down")}
                                        disabled={index === projects.length - 1}
                                    >
                                        <ArrowDown className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEditProject(project)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDeleteProject(project._id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={project.isActive}
                                            onCheckedChange={() => handleToggleVisibility(project)}
                                        />
                                        <span>Visible</span>
                                    </div>
                                    {project.liveUrl && (
                                        <a
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-primary hover:underline"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            Live Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingProject?.title ? "Edit Project" : "Add New Project"}
                        </DialogTitle>
                        <DialogDescription>
                            Enter the project details below
                        </DialogDescription>
                    </DialogHeader>
                    {editingProject && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    value={editingProject.title}
                                    onChange={(e) =>
                                        setEditingProject({ ...editingProject, title: e.target.value })
                                    }
                                    placeholder="Project title"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={editingProject.description}
                                    onChange={(e) =>
                                        setEditingProject({
                                            ...editingProject,
                                            description: e.target.value,
                                        })
                                    }
                                    rows={3}
                                    placeholder="Project description"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Image URL</Label>
                                <Input
                                    value={editingProject.imageUrl}
                                    onChange={(e) =>
                                        setEditingProject({ ...editingProject, imageUrl: e.target.value })
                                    }
                                    placeholder="/project-image.jpg"
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Live URL (optional)</Label>
                                    <Input
                                        value={editingProject.liveUrl || ""}
                                        onChange={(e) =>
                                            setEditingProject({
                                                ...editingProject,
                                                liveUrl: e.target.value,
                                            })
                                        }
                                        placeholder="https://example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>GitHub URL (optional)</Label>
                                    <Input
                                        value={editingProject.githubUrl || ""}
                                        onChange={(e) =>
                                            setEditingProject({
                                                ...editingProject,
                                                githubUrl: e.target.value,
                                            })
                                        }
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Tags</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                handleAddTag()
                                            }
                                        }}
                                        placeholder="Add a tag"
                                    />
                                    <Button type="button" onClick={handleAddTag}>
                                        Add
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {editingProject.tags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="cursor-pointer"
                                            onClick={() => handleRemoveTag(tag)}
                                        >
                                            {tag} ×
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={editingProject.isActive}
                                        onCheckedChange={(checked) =>
                                            setEditingProject({ ...editingProject, isActive: checked })
                                        }
                                    />
                                    <Label>Visible</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={editingProject.featured}
                                        onCheckedChange={(checked) =>
                                            setEditingProject({ ...editingProject, featured: checked })
                                        }
                                    />
                                    <Label>Featured</Label>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveProject}>Save Project</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
