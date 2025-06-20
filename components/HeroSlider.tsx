// components/HeroSlider.tsx
"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface HeroSlide {
  id: number
  title: string
  subtitle: string
  description: string
  src: string
}

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0)
  const len = slides.length

  useEffect(() => {
    const iv = setInterval(() => {
      setCurrent((prev) => (prev + 1) % len)
    }, 5000)
    return () => clearInterval(iv)
  }, [len])

  const prevSlide = () => setCurrent((prev) => (prev - 1 + len) % len)
  const nextSlide = () => setCurrent((prev) => (prev + 1) % len)
  const prevIndex = (current - 1 + len) % len

  return (
    <section className="mx-auto px-4 relative h-64 overflow-hidden mt-16 rounded-lg max-w-7xl">
      {slides.map((s, idx) => {
        // 1) 위치 계산
        let translateClass = "translate-x-full"
        if (idx === current) translateClass = "translate-x-0"
        else if (idx === prevIndex) translateClass = "-translate-x-full"

        // 2) z-index 계산
        let zIndexClass = "z-0"
        if (idx === current) zIndexClass = "z-20"
        else if (idx === prevIndex) zIndexClass = "z-10"

        return (
          <div
            key={s.id}
            className={`
              absolute inset-0
              transition-transform duration-700 ease-in-out
              ${translateClass} ${zIndexClass}
            `}
            style={{
              backgroundImage: `url(${s.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="w-full h-full bg-black/30 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-5xl font-bold mb-2 drop-shadow-lg">{s.title}</h1>
                <p className="text-xl mb-1 drop-shadow-md">{s.subtitle}</p>
                <p className="text-sm opacity-90 drop-shadow-sm">{s.description}</p>
              </div>
            </div>
          </div>
        )
      })}

      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 z-30"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 z-30"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      <div className="absolute bottom-6 right-6 bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
        {current + 1}/{len}
      </div>
    </section>
  )
}