// src/presentation/components/AnimatedLogo.tsx

interface AnimatedLogoProps {
  className?: string
}

export default function AnimatedLogo({ className = 'w-full' }: AnimatedLogoProps) {
  return (
    <img
      src="/movicore-logo.png"
      alt="MoviCore"
      className={className}
      draggable={false}
    />
  )
}
