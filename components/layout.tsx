"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Header from "./header"
import Sidebar from "./sidebar"
import RightPanel from "./right-panel"
import { useRouter } from "next/router"

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    const savedDarkMode = localStorage.getItem("darkMode")
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode))
      if (JSON.parse(savedDarkMode)) {
        document.documentElement.classList.add("dark")
      }
    }
  }, [])

  useEffect(() => {
    if (!isClient) return
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode))
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode, isClient])

  useEffect(() => {
    if (!isClient) return
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
        setIsRightPanelOpen(false)
      } else {
        setIsSidebarOpen(true)
        setIsRightPanelOpen(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isClient])

  useEffect(() => {
    if (!isClient) return
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
      setIsRightPanelOpen(false)
    }
  }, [router.pathname, isClient])

  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4">
          <div className="flex items-center">
            <div className="font-bold text-xl">
              <span className="text-blue-600">CSS</span>
              <span className="ml-1">Prep</span>
            </div>
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-auto p-4 bg-white">{children}</main>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "dark" : ""}`}>
      <Header
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        toggleRightPanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="flex-1 overflow-auto p-4 bg-white dark:bg-gray-900 transition-all">{children}</main>
        <RightPanel isOpen={isRightPanelOpen} />
      </div>
    </div>
  )
}
