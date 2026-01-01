"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import type { Testimonial } from "@/lib/types"

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<"left" | "right" | null>(null)

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No testimonials available yet.
      </div>
    )
  }

  const nextTestimonial = () => {
    setDirection("right")
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setDirection("left")
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="w-full flex-shrink-0">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Quote className="h-8 w-8 text-primary mb-6" />
                  <p className="text-lg mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {testimonials.length > 1 && (
        <>
          <div className="flex justify-center mt-6 gap-2">
            <Button variant="outline" size="icon" onClick={prevTestimonial} aria-label="Previous testimonial">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextTestimonial} aria-label="Next testimonial">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-center mt-4 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${index === activeIndex ? "bg-primary" : "bg-muted"}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

