"use client"

import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { 
  Building2, 
  Bed, 
  ArrowLeft,
  ChevronRight,
  Plus
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AddPropertyPage() {
  const { user, isLoaded } = useUser()


  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!user || user.publicMetadata?.role !== 'partner') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Access denied. Partner privileges required.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/partner/properties">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add Property</h1>
            <p className="text-muted-foreground">
              Choose what you want to add to your property portfolio
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Add Hotel Card */}
        <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
          <Link href="/partner/add-property/add-hotel">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Add Hotel</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <p className="text-muted-foreground mb-6">
                Add a new hotel property with all its details, amenities, and basic information. Perfect for listing a complete hotel.
              </p>
              <div className="flex items-center justify-center space-x-2 text-primary group-hover:text-primary/80">
                <span className="font-medium">Get Started</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Link>
        </Card>

        {/* Add Room Card */}
        <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
          <Link href="/partner/add-property/add-room">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Bed className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Add Room</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <p className="text-muted-foreground mb-6">
                Add rooms to your existing hotels. Select from your hotel portfolio and create new room types with pricing and amenities.
              </p>
              <div className="flex items-center justify-center space-x-2 text-primary group-hover:text-primary/80">
                <span className="font-medium">Get Started</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Info Section */}
      <div className="bg-muted/50 rounded-lg p-6 max-w-4xl mx-auto">
        <h3 className="font-semibold mb-3 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-primary" />
          How it works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
          <div>
            <h4 className="font-medium text-foreground mb-2">1. Add Hotel First</h4>
            <p>Create your hotel with all the basic information, location, amenities, and photos. This creates the foundation of your property.</p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">2. Then Add Rooms</h4>
            <p>Once your hotel is created, you can add different room types with specific pricing, amenities, and availability to that hotel.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
