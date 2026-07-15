// src/presentation/components/theme-toggle.tsx
import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '../store/theme.store'
import { Button } from './ui/button'

export default function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Cambiar tema">
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
