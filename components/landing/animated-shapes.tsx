'use client'

export function AnimatedShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating circles */}
      <svg className="absolute top-20 left-10 w-24 h-24 text-primary-200 opacity-30 animate-float" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="currentColor" />
      </svg>

      <svg className="absolute top-40 right-20 w-16 h-16 text-secondary-200 opacity-40 animate-pulse-slow" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="currentColor" />
      </svg>

      <svg className="absolute bottom-32 left-1/4 w-20 h-20 text-accent-200 opacity-30 animate-bounce-slow" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="currentColor" />
      </svg>

      {/* Geometric shapes */}
      <svg className="absolute top-1/3 right-10 w-32 h-32 text-primary-100 opacity-20 animate-float" viewBox="0 0 100 100">
        <polygon points="50,10 90,90 10,90" fill="currentColor" />
      </svg>

      <svg className="absolute bottom-20 right-1/3 w-24 h-24 text-secondary-100 opacity-25 animate-pulse-slow" viewBox="0 0 100 100">
        <rect x="20" y="20" width="60" height="60" fill="currentColor" transform="rotate(45 50 50)" />
      </svg>

      {/* Animated lines */}
      <svg className="absolute top-1/2 left-0 w-64 h-2 text-primary-200 opacity-20" viewBox="0 0 200 10">
        <line x1="0" y1="5" x2="200" y2="5" stroke="currentColor" strokeWidth="2" strokeDasharray="10,5">
          <animate attributeName="stroke-dashoffset" from="0" to="30" dur="2s" repeatCount="indefinite" />
        </line>
      </svg>

      <svg className="absolute bottom-1/3 right-0 w-64 h-2 text-accent-200 opacity-20" viewBox="0 0 200 10">
        <line x1="0" y1="5" x2="200" y2="5" stroke="currentColor" strokeWidth="2" strokeDasharray="10,5">
          <animate attributeName="stroke-dashoffset" from="30" to="0" dur="2s" repeatCount="indefinite" />
        </line>
      </svg>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full blur-3xl opacity-20 animate-pulse-slow" />
      <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-gradient-to-r from-accent-400 to-primary-400 rounded-full blur-3xl opacity-20 animate-float" />
    </div>
  )
}
