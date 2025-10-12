'use client'

import { useEffect, useRef } from 'react'

export function FloatingParticles() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const particles = 20
    const container = containerRef.current

    for (let i = 0; i < particles; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'

      const size = Math.random() * 4 + 2
      const startX = Math.random() * 100
      const delay = Math.random() * 5
      const duration = Math.random() * 10 + 15

      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${startX}%`
      particle.style.bottom = '0'
      particle.style.background = `rgba(${Math.random() > 0.5 ? '59, 130, 246' : '168, 85, 247'}, ${Math.random() * 0.3 + 0.2})`
      particle.style.animation = `float-particle ${duration}s linear infinite`
      particle.style.animationDelay = `${delay}s`

      container.appendChild(particle)
    }

    return () => {
      container.innerHTML = ''
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" />
}
