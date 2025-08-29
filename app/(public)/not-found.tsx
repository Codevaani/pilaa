"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const router = useRouter()
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary mb-4">404</div>
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
        
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-xl font-semibold mb-4">Need help finding something?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="secondary">
              <Link href="/help">Visit Help Center</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}