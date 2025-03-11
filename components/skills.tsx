import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Layout, Database, Smartphone, Layers, Gauge, Workflow, GitBranch } from "lucide-react"

interface SkillCardProps {
  title: string
  description: string
  icon: React.ReactNode
  skills: string[]
}

function SkillCard({ title, description, icon, skills }: SkillCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4 text-primary">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        <ul className="space-y-1">
          {skills.map((skill) => (
            <li key={skill} className="text-sm">
              {skill}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export function Skills() {
  const skillsData = [
    {
      title: "Frontend Development",
      description: "Creating responsive and interactive user interfaces",
      icon: <Layout className="h-8 w-8" />,
      skills: ["HTML/CSS", "JavaScript/TypeScript", "React.js", "Next.js"],
    },
    {
      title: "Backend Development",
      description: "Building robust server-side applications",
      icon: <Code className="h-8 w-8" />,
      skills: ["Node.js", "Express", "Python", "PHP"],
    },
    {
      title: "Database Management",
      description: "Designing and optimizing database structures",
      icon: <Database className="h-8 w-8" />,
      skills: ["MongoDB", "PostgreSQL", "MySQL", "Firebase"],
    },
    {
      title: "Mobile Development",
      description: "Creating native and cross-platform mobile apps",
      icon: <Smartphone className="h-8 w-8" />,
      skills: ["Flutter", "iOS (Swift)", "Android (Kotlin)"],
    },
    {
      title: "UI/UX Design",
      description: "Designing intuitive and beautiful user experiences",
      icon: <Layers className="h-8 w-8" />,
      skills: ["Figma", "Adobe XD"],
    },
    {
      title: "Performance Optimization",
      description: "Improving speed and efficiency of applications",
      icon: <Gauge className="h-8 w-8" />,
      skills: ["Lazy Loading", "Code Splitting", "Caching Strategies", "Image Optimization"],
    },
    {
      title: "DevOps",
      description: "Streamlining development and deployment processes",
      icon: <Workflow className="h-8 w-8" />,
      skills: ["Docker", "CI/CD", "AWS", "Vercel", "Netlify"],
    },
    {
      title: "Version Control",
      description: "Managing code changes and collaboration",
      icon: <GitBranch className="h-8 w-8" />,
      skills: ["Git", "GitHub", "GitLab", "Bitbucket", "Code Reviews"],
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {skillsData.map((skill) => (
        <SkillCard
          key={skill.title}
          title={skill.title}
          description={skill.description}
          icon={skill.icon}
          skills={skill.skills}
        />
      ))}
    </div>
  )
}

