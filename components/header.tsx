"use client"

import { Menu, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/ThemeToggle"

interface HeaderProps {
  toggleSidebar: () => void
}

export default function Header({ toggleSidebar }: HeaderProps) {
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
        <ThemeToggle />

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
      </div>
    </header>
  )
}
