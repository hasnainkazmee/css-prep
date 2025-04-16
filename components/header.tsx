"use client"

import { Menu, X, Moon, Sun, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"

interface HeaderProps {
  toggleSidebar: () => void
  toggleRightPanel: () => void
  isDarkMode: boolean
  toggleDarkMode: () => void
}

export default function Header({ toggleSidebar, toggleRightPanel, isDarkMode, toggleDarkMode }: HeaderProps) {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4">
        <div className="flex items-center">
          <div className="font-bold text-xl">
            <span className="text-blue-600">CSS</span>
            <span className="ml-1">Prep</span>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-4 transition-colors">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <div className="font-bold text-xl cursor-pointer flex items-center" onClick={() => router.push("/")}>
          <span className="text-blue-600 dark:text-blue-400">CSS</span>
          <span className="ml-1">Prep</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Moon className={`h-4 w-4 ${isDarkMode ? "text-blue-400" : "text-gray-400"}`} />
          <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} aria-label="Toggle dark mode" />
          <Sun className={`h-4 w-4 ${!isDarkMode ? "text-amber-500" : "text-gray-400"}`} />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-blue-600 rounded-full"></span>
          <span className="sr-only">Notifications</span>
        </Button>

        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Ali" />
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <span className="font-medium hidden md:inline">Ali</span>
        </div>

        <Button variant="ghost" size="icon" onClick={toggleRightPanel} className="md:hidden">
          <X className="h-5 w-5" />
          <span className="sr-only">Toggle right panel</span>
        </Button>
      </div>
    </header>
  )
}
