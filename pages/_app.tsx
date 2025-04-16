"use client"

import { useEffect } from "react"
import type { AppProps } from "next/app"
import { useRouter } from "next/router"
import Layout from "@/components/layout"
import { initializeData } from "@/utils/localStorage"
import "@/styles/globals.css"

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  // Initialize localStorage data on client-side
  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== "undefined") {
      initializeData()

      // Handle initial 404 error by redirecting to home page if needed
      if (router.pathname === "/_error" || router.pathname === "/404") {
        router.replace("/")
      }
    }
  }, [router])

  // Prevent rendering until router is ready
  if (!router.isReady) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
