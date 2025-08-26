"use client"

import { useState, useEffect, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { sanitizeLog } from "@/lib/security"
import { Heart, MapPin, Star, Eye, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"

interface Hotel {
  id: string;
  name: string;
  location: string;
  image: string;
  availability: boolean;
  rating: number;
  reviews: number;
  propertyType: string;
  amenities: string[];
  savedDate: string;
  priceRange: {
    min: number;
    max: number;
  };
}

export default function SavedHotelsPage() {
  const { user, isLoaded } = useUser()
  const [savedHotels, setSavedHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const fetchSavedHotels = useCallback(async () => {
    try {
      const response = await fetch('/api/user/saved')
      if (response.ok) {
        const data = await response.json()
        setSavedHotels(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch saved hotels')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchSavedHotels()
    } else {
      setLoading(false)
    }
  }, [user, fetchSavedHotels])



  const handleRemoveFromSaved = (hotelId: string) => {
    const sanitizedId = sanitizeLog(hotelId)
    console.log(`Remove hotel ${sanitizedId} from saved`)
    alert("Hotel removed from saved list!")
  }

  const filteredHotels = savedHotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === "all" || 
                         (selectedFilter === "available" && hotel.availability) ||
                         (selectedFilter === "unavailable" && !hotel.availability) ||
                         hotel.propertyType.toLowerCase().includes(selectedFilter.toLowerCase())
    
    return matchesSearch && matchesFilter
  })

  if (!isLoaded || loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <Skeleton className="h-8 w-1/4 mb-4" />
          <Skeleton className="h-12 w-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please sign in to view your saved hotels.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Saved Hotels</h1>
          <p className="text-muted-foreground">
            Your favorite hotels and properties ({savedHotels.length} saved)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            List
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search saved hotels by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border rounded-md px-3 py-2 bg-background"
              >
                <option value="all">All Properties</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
                <option value="hotel">Hotels</option>
                <option value="resort">Resorts</option>
                <option value="villa">Villas</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Hotels Grid/List */}
      {filteredHotels.length > 0 ? (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredHotels.map((hotel) => (
            <Card key={hotel.id} className={`group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 ${
              viewMode === "list" ? "flex" : ""
            }`}>
              <div className={`relative ${viewMode === "list" ? "w-80 h-48" : "h-48"}`}>
                <Image
                  src={hotel.image}
                  alt={hotel.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-white/80 hover:bg-white"
                    onClick={(e) => {
                      e.preventDefault()
                      handleRemoveFromSaved(hotel.id)
                    }}
                  >
                    <Heart className="h-4 w-4 fill-primary text-primary" />
                  </Button>
                </div>
                {!hotel.availability && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="destructive">Unavailable</Badge>
                  </div>
                )}
              </div>
              
              <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg line-clamp-1">{hotel.name}</h3>
                    <div className="flex items-center text-muted-foreground text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {hotel.location}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium">{hotel.rating}</span>
                    <span className="text-muted-foreground">({hotel.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="outline">{hotel.propertyType}</Badge>
                  {hotel.amenities.slice(0, 2).map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {hotel.amenities.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{hotel.amenities.length - 2} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-muted-foreground">
                    Saved on {hotel.savedDate}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      ₹{hotel.priceRange.min.toLocaleString()} - ₹{hotel.priceRange.max.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">per night</div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1" asChild>
                    <Link href={`/hotel/${hotel.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      handleRemoveFromSaved(hotel.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm || selectedFilter !== "all" ? "No hotels found" : "No saved hotels yet"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedFilter !== "all" 
                ? "Try adjusting your search criteria or filters"
                : "Start exploring and save your favorite hotels for easy access later"
              }
            </p>
            <Button asChild>
              <Link href="/search">
                {searchTerm || selectedFilter !== "all" ? "Clear Filters" : "Browse Hotels"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      {filteredHotels.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{savedHotels.length}</div>
                <div className="text-sm text-muted-foreground">Total Saved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {savedHotels.filter(h => h.availability).length}
                </div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {savedHotels.length > 0 ? (savedHotels.reduce((sum, h) => sum + h.rating, 0) / savedHotels.length).toFixed(1) : '0'}
                </div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {savedHotels.length > 0 ? `₹${Math.min(...savedHotels.map(h => h.priceRange.min)).toLocaleString()}+` : '₹0'}
                </div>
                <div className="text-sm text-muted-foreground">Starting From</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
