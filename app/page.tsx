import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { ProjectCard } from "@/components/project-card"
import { ContactForm } from "@/components/contact-form"
import { Skills } from "@/components/skills"
import { Testimonials } from "@/components/testimonials"
import fallbackContent from "@/data/content.json"
import { ArrowDown } from "lucide-react"

export const dynamic = 'force-dynamic'

async function getData() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  try {
    const [profileRes, projectsRes, skillsRes, testimonialsRes, settingsRes] = await Promise.all([
      fetch(`${API_URL}/profile`, { next: { revalidate: 60 } }),
      fetch(`${API_URL}/projects`, { next: { revalidate: 60 } }),
      fetch(`${API_URL}/skills`, { next: { revalidate: 60 } }),
      fetch(`${API_URL}/testimonials`, { next: { revalidate: 60 } }),
      fetch(`${API_URL}/settings`, { next: { revalidate: 60 } })
    ]);

    const [profile, projects, skills, testimonials, settings] = await Promise.all([
      profileRes.json(),
      projectsRes.json(),
      skillsRes.json(),
      testimonialsRes.json(),
      settingsRes.json()
    ]);

    return {
      profile: profile.data,
      projects: projects.data,
      skillCategories: skills.data,
      testimonials: testimonials.data,
      settings: settings.data
    };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return {
      profile: fallbackContent.profile,
      projects: fallbackContent.projects,
      skillCategories: fallbackContent.skillCategories,
      testimonials: fallbackContent.testimonials,
      settings: {
        sections: fallbackContent.sections,
        navigation: fallbackContent.navigation,
      },
    };
  }
}

export default async function Home() {
  const data = await getData();

  const defaultProfile = {
    name: '',
    tagline: '',
    bio: [] as string[],
    location: '',
    experience: '',
    email: '',
    availability: '',
    image: '',
    socialLinks: {} as Record<string, string>,
  };

  const { profile = defaultProfile, projects = [], skillCategories = [], testimonials = [], settings = {} as any } = data || {};
  const safeProfile = {
    ...defaultProfile,
    ...profile,
    bio: profile?.bio ?? [],
    socialLinks: profile?.socialLinks ?? {},
  };
  const { sections = [], navigation = [] } = settings || {};

  // Get visible sections in order
  const visibleSections = sections.filter((s: any) => s.visible).sort((a: any, b: any) => a.order - b.order)
  const sectionMap = new Map(visibleSections.map((s: any) => [s.id, s]))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container flex items-center justify-between h-16">
          <a href="#" className="text-xl font-bold">
            {safeProfile.name}
          </a>
          <nav className="hidden md:flex items-center gap-6">
            {navigation.filter((n: any) => n.visible).map((item: any) => (
              <a key={item.href} href={item.href} className="text-sm font-medium hover:text-primary transition-colors">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button asChild className="hidden md:flex">
              <a href="#contact">Hire Me</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {sectionMap.has('hero') && (
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
          <div className="container flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Hi, I'm <span className="text-primary">{safeProfile.name}</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-8">
              {safeProfile.tagline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <a href="#projects">View My Work</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#contact">Contact Me</a>
              </Button>
            </div>
            <a
              href="#about"
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
              aria-label="Scroll down"
            >
              <ArrowDown className="h-6 w-6 text-primary" />
            </a>
          </div>
        </section>
      )}

      {/* About Section */}
      {sectionMap.has('about') && (
        <section id="about" className="py-20 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">{sectionMap.get('about')?.title}</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="aspect-square relative rounded-xl overflow-hidden">
                <img src={safeProfile.image} alt={safeProfile.name} className="object-cover w-full h-full" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Who I Am</h3>
                {safeProfile.bio.map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground mb-6">
                    {paragraph}
                  </p>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Location</h4>
                    <p className="text-muted-foreground">{safeProfile.location}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Experience</h4>
                    <p className="text-muted-foreground">{safeProfile.experience}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Email</h4>
                    <p className="text-muted-foreground">{safeProfile.email}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Availability</h4>
                    <p className="text-muted-foreground">{safeProfile.availability}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {sectionMap.has('skills') && (
        <section id="skills" className="py-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">{sectionMap.get('skills')?.title}</h2>
            <Skills skillCategories={skillCategories} />
          </div>
        </section>
      )}

      {/* Projects Section */}
      {sectionMap.has('projects') && projects.length > 0 && (
        <section id="projects" className="py-20 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">{sectionMap.get('projects')?.title}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id || (project as any)._id || `${project.title}-${index}`}
                  title={project.title}
                  description={project.description}
                  tags={project.tags}
                  imageUrl={project.imageUrl}
                  liveUrl={project.liveUrl}
                  githubUrl={project.githubUrl}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {sectionMap.has('testimonials') && testimonials.length > 0 && (
        <section id="testimonials" className="py-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">{sectionMap.get('testimonials')?.title}</h2>
            <Testimonials testimonials={testimonials} />
          </div>
        </section>
      )}

      {/* Contact Section */}
      {sectionMap.has('contact') && (
        <section id="contact" className="py-20 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">{sectionMap.get('contact')?.title}</h2>
            <div className="max-w-2xl mx-auto">
              <ContactForm />
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} {safeProfile.name}. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {safeProfile.socialLinks.linkedin && (
              <a href={safeProfile.socialLinks.linkedin} className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            )}
            {safeProfile.socialLinks.github && (
              <a href={safeProfile.socialLinks.github} className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            )}
            {safeProfile.socialLinks.twitter && (
              <a href={safeProfile.socialLinks.twitter} className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
            )}
            {safeProfile.socialLinks.dribbble && (
              <a href={safeProfile.socialLinks.dribbble} className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                Dribbble
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}

