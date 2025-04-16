import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import { motion, AnimatePresence } from "framer-motion"

const inter = Inter({ subsets: ["latin"] })

export default function App({ Component, pageProps }: any) {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Redirect from error pages to home
  useEffect(() => {
    if (router.pathname === "/_error" || router.pathname === "/404") {
      router.push("/")
    }
  }, [router])

  if (!isClient) {
    return null
  }

  return (
    <div className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors`}>
      <div className="flex h-screen">
        <motion.div 
          className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Sidebar isOpen={isSidebarOpen} />
        </motion.div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <AnimatePresence mode="wait">
            <motion.main
              key={router.pathname}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 p-4 transition-colors"
            >
              <Component {...pageProps} />
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
