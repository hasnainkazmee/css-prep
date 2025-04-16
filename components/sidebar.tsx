"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  PenTool,
  BarChart2,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

interface SidebarProps {
  isOpen: boolean
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const router = useRouter()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    resources: false,
    help: false,
  })

  const toggleExpand = (key: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const isActive = (path: string) => router.pathname === path

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/",
    },
    {
      icon: BookOpen,
      label: "Syllabus",
      path: "/syllabus",
    },
    {
      icon: FileText,
      label: "Notes",
      path: "/notes",
    },
    {
      icon: PenTool,
      label: "Exam Room",
      path: "/exam-room",
    },
    {
      icon: BarChart2,
      label: "Progress",
      path: "/progress",
    },
  ]

  if (!isOpen) return null

  return (
    <aside className="w-64 bg-gray-100 dark:bg-gray-800 overflow-y-auto transition-all border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            href={item.path}
            key={item.path}
            className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
              isActive(item.path)
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}

        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <div
            className="flex items-center justify-between px-3 py-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => toggleExpand("resources")}
          >
            <div className="flex items-center space-x-3">
              <BookOpen className="h-5 w-5" />
              <span>Resources</span>
            </div>
            {expandedItems.resources ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>

          {expandedItems.resources && (
            <div className="ml-8 mt-1 space-y-1">
              <Link
                href="/resources/past-papers"
                className={`block px-3 py-2 rounded-md transition-colors ${
                  isActive("/resources/past-papers")
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                Past Papers
              </Link>
              <Link
                href="/resources/articles"
                className={`block px-3 py-2 rounded-md transition-colors ${
                  isActive("/resources/articles")
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                Articles
              </Link>
            </div>
          )}
        </div>

        <div className="pt-2">
          <div
            className="flex items-center justify-between px-3 py-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => toggleExpand("help")}
          >
            <div className="flex items-center space-x-3">
              <HelpCircle className="h-5 w-5" />
              <span>Help & Support</span>
            </div>
            {expandedItems.help ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>

          {expandedItems.help && (
            <div className="ml-8 mt-1 space-y-1">
              <Link
                href="/help/faq"
                className={`block px-3 py-2 rounded-md transition-colors ${
                  isActive("/help/faq")
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                FAQ
              </Link>
              <Link
                href="/help/contact"
                className={`block px-3 py-2 rounded-md transition-colors ${
                  isActive("/help/contact")
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                Contact Us
              </Link>
            </div>
          )}
        </div>

        <Link
          href="/settings"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors mt-4 ${
            isActive("/settings")
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </nav>
    </aside>
  )
}
