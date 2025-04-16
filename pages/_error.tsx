"use client"

import type { NextPageContext } from "next"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ErrorProps {
  statusCode?: number
  message?: string
}

function Error({ statusCode, message }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <AlertTriangle className="h-24 w-24 text-amber-500 mb-6" />
      <h1 className="text-4xl font-bold mb-2">{statusCode ? `Error ${statusCode}` : "An Error Occurred"}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        {message || "We're sorry, something went wrong. Please try again later."}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
