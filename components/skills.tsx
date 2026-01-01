import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Layout, Database, Smartphone, Layers, Gauge, Workflow, GitBranch } from "lucide-react"
import type { SkillCategory } from "@/lib/types"

interface SkillCardProps {
  title: string
  description: string
  icon: React.ReactNode
  skills: string[]
}

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

interface SkillsProps {
  skillCategories: SkillCategory[]
}

export function Skills({ skillCategories }: SkillsProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {skillCategories.map((category, index) => {
        const Icon = iconMap[category.icon] || Code
        const key =
          category.id ||
          (category as any)._id ||
          (category as any).categoryId ||
          `${category.title}-${index}`
        return (
          <SkillCard
            key={key}
            title={category.title}
            description={category.description}
            icon={<Icon className="h-8 w-8" />}
            skills={category.skills.map(s => s.name)}
          />
        )
      })}
    </div>
  )
}

