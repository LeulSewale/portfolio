import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { ProjectCard } from "@/components/project-card"
import { ContactForm } from "@/components/contact-form"
import { Skills } from "@/components/skills"
import { Testimonials } from "@/components/testimonials"
import { ArrowDown } from "lucide-react"
import leulImage from '/assets/images/leul.png'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container flex items-center justify-between h-16">
          <a href="#" className="text-xl font-bold">
            Leul Sewale
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </a>
            <a href="#skills" className="text-sm font-medium hover:text-primary transition-colors">
              Skills
            </a>
            <a href="#projects" className="text-sm font-medium hover:text-primary transition-colors">
              Projects
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonials
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </a>
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
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Hi, I'm <span className="text-primary">Leul Sewale</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-8">
            I'm a freelance developer specializing in creating beautiful, functional websites and applications.
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

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">About Me</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="aspect-square relative rounded-xl overflow-hidden">
              <img src="/leul.png?height=600&width=600" alt="Leul " className="object-cover w-full h-full" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Who I Am</h3>
              <p className="text-muted-foreground mb-6">
              Dynamic and results-driven Software Engineer with over 3 years of professional experience in full-stack and mobile development. 
              Known for adaptability, accountability, and strong problem-solving skills. Successfully contributed to high-impact website and mobile app projects, 
              including the development of an intelligent Smart Patient-care and Assistance system leveraging machine learning predictions. 
              Currently excelling as a Software Developer, specializing in front-end, mobile application, and back-end development,
               with a focus on delivering innovative and scalable solutions.
              </p>
              <p className="text-muted-foreground mb-6">
                My approach combines technical expertise with a deep understanding of user experience and business
                goals. I believe in creating solutions that not only look great but also deliver results.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Location</h4>
                  <p className="text-muted-foreground">Addis Ethiopia</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Experience</h4>
                  <p className="text-muted-foreground">3+ Years</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Email</h4>
                  <p className="text-muted-foreground">leulsewale10@gmail.com</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Availability</h4>
                  <p className="text-muted-foreground">Freelance / Contract</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">My Skills</h2>
          <Skills />
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">My Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProjectCard
              title="Nutemaru Aplication"
              description="A fully responsive online-learning platform with payment integration"
              tags={["flutter(dart)", "Firebase Ath", "Socket_io_client","Bloc"]}
              imageUrl="/nutemaru.jpg?height=00&width=600"
              liveUrl="https://play.google.com/store/apps/details?id=com.nunatechsolutions.nutemaru&pcampaignid=web_share&pli=1&pcampaignid=web_share&pli=1&pcampaignid=web_share&pli=1"
            />
            <ProjectCard
              title="Online-bus Booking Application"
              description="A bus booking application with real-time tracking and notifications"
              tags={["flutter(dart)", "Firebase Ath", "Provider", ]}
              imageUrl="/portofolioss1.jpg?height=400&width=600"
            />
             <ProjectCard
              title="Landing Page"
              description="A high-converting landing page for a SaaS product"
              tags={["React js","HTML/CSS", "JavaScript", "Tailwind CSS"]}
              imageUrl="/daLLOL.jpg?height=400&width=600"
              liveUrl="https://dalloltech.com/"
            />
            <ProjectCard
              title="Smart Patientcare and Assistance "
              description="Smart patientcare is a health-care delivery system
               that uses trending technology such as artificial intelligence, video conferencing,
                and mobile internet to remotely access information, connect people, and institutions in the healthcare sector, manages and responds to healthcare needs"
              tags={["React js", "Flutter","Firebase", "Redux","Provider"]}
              imageUrl="/portfolios2.jpg?height=400&width=600"
            />
            <ProjectCard
              title="Dashboard UI"
              description="An admin dashboard with data visualization and user management"
              tags={["React js","HTML/CSS", "JavaScript", "Tailwind CSS"]}
              imageUrl="/wedeni.jpg?height=400&width=600"
              liveUrl="https://wedeni.dalloltech.com/"
            />
           
            <ProjectCard
              title="Blog Platform"
              description="A content management system with custom editor"
              tags={["React js","HTML/CSS", "JavaScript", "Tailwind CSS","node js","express js","MongoDB"]}
              imageUrl="/adminpage.jpg?height=400&width=600"
              liveUrl="https://bus.dalloltech.com/company"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">What Clients Say</h2>
          <Testimonials />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Get In Touch</h2>
          <div className="max-w-2xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Leul Sewale. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a href="https://www.linkedin.com/in/leul-sewale-5734b0246/" className="text-muted-foreground hover:text-primary transition-colors">
              LinkedIn
            </a>
            <a href="https://github.com/LeulSewale" className="text-muted-foreground hover:text-primary transition-colors">
              GitHub
            </a>
            {/* <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Dribbble
            </a> */}
          </div>
        </div>
      </footer>
    </div>
  )
}

