"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Profile } from "@/lib/types"
import { Save } from "lucide-react"

import { profileService } from "@/lib/api/profile"

export default function ProfileManagement() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [profile, setProfile] = useState<Profile | null>(null)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const data = await profileService.getAdminProfile()
            setProfile(data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load profile",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        if (!profile) return

        setIsSaving(true)
        try {
            const updated = await profileService.updateProfile(profile)
            setProfile(updated)
            toast({
                title: "Success",
                description: "Profile updated successfully",
            })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update profile",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!profile) {
        return <div>Profile data not found</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Profile Management</h1>
                    <p className="text-muted-foreground">
                        Update your personal information and bio
                    </p>
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Your name and tagline</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={profile.name}
                                onChange={(e) =>
                                    setProfile({ ...profile, name: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tagline">Tagline</Label>
                            <Textarea
                                id="tagline"
                                value={profile.tagline}
                                onChange={(e) =>
                                    setProfile({ ...profile, tagline: e.target.value })
                                }
                                rows={2}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Biography</CardTitle>
                        <CardDescription>Your professional bio (one paragraph per line)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {profile.bio.map((paragraph, index) => (
                            <div key={index} className="space-y-2">
                                <Label htmlFor={`bio-${index}`}>Paragraph {index + 1}</Label>
                                <Textarea
                                    id={`bio-${index}`}
                                    value={paragraph}
                                    onChange={(e) => {
                                        const newBio = [...profile.bio]
                                        newBio[index] = e.target.value
                                        setProfile({ ...profile, bio: newBio })
                                    }}
                                    rows={4}
                                />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Contact & Details</CardTitle>
                        <CardDescription>Location, experience, and contact information</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={profile.location}
                                onChange={(e) =>
                                    setProfile({ ...profile, location: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="experience">Experience</Label>
                            <Input
                                id="experience"
                                value={profile.experience}
                                onChange={(e) =>
                                    setProfile({ ...profile, experience: e.target.value })
                                }
                                placeholder="e.g. 5+ Years"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={profile.email}
                                onChange={(e) =>
                                    setProfile({ ...profile, email: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="availability">Availability</Label>
                            <Input
                                id="availability"
                                value={profile.availability}
                                onChange={(e) =>
                                    setProfile({ ...profile, availability: e.target.value })
                                }
                                placeholder="e.g. Freelance / Contract"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Social Links</CardTitle>
                        <CardDescription>Your social media profiles</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn URL</Label>
                            <Input
                                id="linkedin"
                                value={profile.socialLinks.linkedin || ""}
                                onChange={(e) =>
                                    setProfile({
                                        ...profile,
                                        socialLinks: { ...profile.socialLinks, linkedin: e.target.value },
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="github">GitHub URL</Label>
                            <Input
                                id="github"
                                value={profile.socialLinks.github || ""}
                                onChange={(e) =>
                                    setProfile({
                                        ...profile,
                                        socialLinks: { ...profile.socialLinks, github: e.target.value },
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="twitter">Twitter URL</Label>
                            <Input
                                id="twitter"
                                value={profile.socialLinks.twitter || ""}
                                onChange={(e) =>
                                    setProfile({
                                        ...profile,
                                        socialLinks: { ...profile.socialLinks, twitter: e.target.value },
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dribbble">Dribbble URL</Label>
                            <Input
                                id="dribbble"
                                value={profile.socialLinks.dribbble || ""}
                                onChange={(e) =>
                                    setProfile({
                                        ...profile,
                                        socialLinks: { ...profile.socialLinks, dribbble: e.target.value },
                                    })
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Profile Image</CardTitle>
                        <CardDescription>Path to your profile image</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="image">Image URL</Label>
                            <Input
                                id="image"
                                value={profile.image}
                                onChange={(e) =>
                                    setProfile({ ...profile, image: e.target.value })
                                }
                                placeholder="/profile-image.jpg"
                            />
                            <p className="text-xs text-muted-foreground">
                                Upload image to /public folder and enter the path here
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
