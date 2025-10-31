export function SolarShareLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer circle */}
      <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="2" opacity="0.2" />

      {/* Sun rays - representing solar */}
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <line x1="100" y1="15" x2="100" y2="35" />
        <line x1="100" y1="165" x2="100" y2="185" />
        <line x1="15" y1="100" x2="35" y2="100" />
        <line x1="165" y1="100" x2="185" y2="100" />
        <line x1="35" y1="35" x2="50" y2="50" />
        <line x1="150" y1="150" x2="165" y2="165" />
        <line x1="165" y1="35" x2="150" y2="50" />
        <line x1="50" y1="150" x2="35" y2="165" />
      </g>

      {/* Central circle - representing energy hub */}
      <circle cx="100" cy="100" r="45" fill="currentColor" opacity="0.1" />
      <circle cx="100" cy="100" r="35" stroke="currentColor" strokeWidth="2.5" />

      {/* Lightning bolt - representing electricity/charging */}
      <path d="M 100 65 L 110 85 L 95 85 L 105 110 L 85 95 L 100 95 Z" fill="currentColor" opacity="0.8" />

      {/* Sharing arcs - representing community */}
      <path d="M 70 100 Q 70 75 100 75" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      <path d="M 130 100 Q 130 75 100 75" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      <path d="M 70 100 Q 70 125 100 125" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      <path d="M 130 100 Q 130 125 100 125" stroke="currentColor" strokeWidth="2" opacity="0.6" />
    </svg>
  )
}
