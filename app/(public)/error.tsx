"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <div className="text-6xl font-bold text-primary mb-4">Oops!</div>
          <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
          <p className="text-lg text-muted-foreground mb-6">
            We're sorry, but something unexpected happened. Our team has been notified and we're working to fix the issue.
          </p>
          <div className="bg-muted p-4 rounded-lg text-left">
            <p className="text-sm font-mono text-muted-foreground">
              Error: {error.message}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={() => reset()}>
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
        
        <div className="mt-8">
          <p className="text-muted-foreground">
            Need immediate assistance?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}