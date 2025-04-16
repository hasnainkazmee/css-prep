"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { BookOpen, HelpCircle, Home, Notebook, Settings, Target } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    resources: false,
    help: false,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNavigation = (path: string) => {
    if (mounted) {
      router.push(path)
    }
  }

  const toggleExpand = (item: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }))
  }

  if (!mounted) {
    return (
      <div className={cn(
        "fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 z-50",
        isOpen ? "w-64" : "w-0"
      )} />
    )
  }

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 z-50",
      isOpen ? "w-64" : "w-0"
    )}>
      <div className="h-full overflow-y-auto">
        <nav className="p-4">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                pathname === "/" && "bg-gray-100 dark:bg-gray-700"
              )}
              onClick={() => handleNavigation("/")}
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>

            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                pathname === "/syllabus" && "bg-gray-100 dark:bg-gray-700"
              )}
              onClick={() => handleNavigation("/syllabus")}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Syllabus
            </Button>

            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                pathname === "/notes" && "bg-gray-100 dark:bg-gray-700"
              )}
              onClick={() => handleNavigation("/notes")}
            >
              <Notebook className="mr-2 h-4 w-4" />
              Notes
            </Button>

            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                pathname === "/progress" && "bg-gray-100 dark:bg-gray-700"
              )}
              onClick={() => handleNavigation("/progress")}
            >
              <Target className="mr-2 h-4 w-4" />
              Progress
            </Button>

            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                pathname === "/exam-room" && "bg-gray-100 dark:bg-gray-700"
              )}
              onClick={() => handleNavigation("/exam-room")}
            >
              <Target className="mr-2 h-4 w-4" />
              Exam Room
            </Button>

            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                pathname === "/settings" && "bg-gray-100 dark:bg-gray-700"
              )}
              onClick={() => handleNavigation("/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </nav>
      </div>
    </div>
  )
}
