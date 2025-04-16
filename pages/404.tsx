"use client"

import { useEffect } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function Custom404() {
  const router = useRouter()

  useEffect(() => {
    // Log the 404 error for debugging
    console.log(`404 error: Page not found - ${router.asPath}`)
  }, [router.asPath])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <FileQuestion className="h-24 w-24 text-gray-400 mb-6" />
      <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => router.back()}>Go Back</Button>
        <Button variant="outline" onClick={() => router.push("/")}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  )
}
