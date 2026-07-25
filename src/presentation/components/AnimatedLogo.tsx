// src/presentation/components/AnimatedLogo.tsx

interface AnimatedLogoProps {
  className?: string
}

export default function AnimatedLogo({ className = 'w-80' }: AnimatedLogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Resplandor pulsante detrás del pin (radar GPS) */}
      <div className="movicore-logo-glow absolute right-[18%] top-[22%] h-10 w-10 rounded-full bg-accent-red" />

      {/* Movimiento horizontal (el bus "acelera" y regresa) */}
      <div className="movicore-logo-drive relative w-full">
        {/* Flotación vertical (levitar) */}
        <div className="movicore-logo-float relative w-full">
          <img
            src="/movicore-logo.png"
            alt="MoviCore"
            className="w-full drop-shadow-2xl"
            draggable={false}
          />
          {/* Barrido de brillo futurista */}
          <div className="movicore-logo-sweep pointer-events-none absolute inset-0" />
        </div>
      </div>
    </div>
  )
}
