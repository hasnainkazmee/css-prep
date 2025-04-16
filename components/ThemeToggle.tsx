"use client"

import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { saveTheme, getTheme } from '@/utils/localStorage'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getTheme())

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    saveTheme(theme)
  }, [theme])

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="h-8 w-8"
    >
      {theme === 'light' ? (
        <Sun className="h-5 w-5 text-yellow-600" />
      ) : (
        <Moon className="h-5 w-5 text-blue-400" />
      )}
    </Button>
  )
} 