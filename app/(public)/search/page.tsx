"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, Wifi, Car, Coffee, Dumbbell, Filter, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchBar } from "@/components/search-bar"

const amenityIcons = {
  wifi: Wifi,
  parking: Car,
  restaurant: Coffee,
  gym: Dumbbell,
  spa: Star,
  pool: Star,
  beach: Star,
}

function SearchFilters() {
  const [priceRange, setPriceRange] = useState([0, 20000])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [selectedRating, setSelectedRating] = useState(0)

  return (
    <Card className="p-6 h-fit sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">Filters</h3>
        <Button variant="ghost" size="sm">Clear All</Button>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="Min"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
              className="w-full"
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="Max"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 20000])}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Rating</h4>
        <div className="space-y-2">
          {[4.5, 4.0, 3.5, 3.0].map((rating) => (
            <label key={rating} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={selectedRating === rating}
                onChange={(e) => setSelectedRating(parseFloat(e.target.value))}
                className="rounded"
              />
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>{rating}+</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Amenities</h4>
        <div className="space-y-2">
          {Object.entries(amenityIcons).map(([amenity, Icon]) => (
            <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedAmenities.includes(amenity)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedAmenities([...selectedAmenities, amenity])
                  } else {
                    setSelectedAmenities(selectedAmenities.filter(a => a !== amenity))
                  }
                }}
                className="rounded"
              />
              <Icon className="h-4 w-4" />
              <span className="capitalize">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <Button className="w-full">Apply Filters</Button>
    </Card>
  )
}

function HotelCard({ hotel, viewMode }: { hotel: any, viewMode: 'grid' | 'list' }) {
  const isListView = viewMode === 'list'

  return (
    <Link href={`/hotel/${hotel.slug}`}>
      <Card className={`group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 ${isListView ? 'flex' : ''}`}>
        <div className={`relative ${isListView ? 'w-80 h-48' : 'h-48'}`}>
          <Image
            src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop'}
            alt={hotel.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className={`p-4 ${isListView ? 'flex-1' : ''}`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg line-clamp-1">{hotel.name}</h3>
              <div className="flex items-center text-muted-foreground text-sm mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                {hotel.address?.city}, {hotel.address?.state}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {hotel.propertyType}
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-medium">{hotel.rating}</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex items-center space-x-2 mb-3">
            {hotel.amenities?.slice(0, 4).map((amenity: string) => {
              const Icon = amenityIcons[amenity as keyof typeof amenityIcons]
              return Icon ? <Icon key={amenity} className="h-4 w-4 text-muted-foreground" /> : null
            })}
            {hotel.amenities?.length > 4 && (
              <span className="text-xs text-muted-foreground">+{hotel.amenities.length - 4} more</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {hotel.reviewCount} reviews
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">
                ₹{hotel.priceRange?.min?.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">per night</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function SearchResults({ hotels, loading, totalResults }: { hotels: any[], loading: boolean, totalResults: number }) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('popularity')

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex space-x-4">
              <Skeleton className="w-80 h-48" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-32 ml-auto" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Search Results</h2>
          <p className="text-muted-foreground">{totalResults} properties found</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="popularity">Sort by Popularity</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Hotel Cards */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}>
        {hotels.map((hotel) => (
          <HotelCard key={hotel._id} hotel={hotel} viewMode={viewMode} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <div className="flex space-x-2">
          <Button variant="outline" disabled>Previous</Button>
          <Button variant="default">1</Button>
          <Button variant="outline">2</Button>
          <Button variant="outline">3</Button>
          <Button variant="outline">Next</Button>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [, setShowMobileFilters] = useState(false)
  const [hotels, setHotels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalResults, setTotalResults] = useState(0)

  const fetchHotels = async () => {
    try {
      const params = new URLSearchParams()
      if (searchParams.get('city')) params.set('city', searchParams.get('city')!)
      if (searchParams.get('minPrice')) params.set('minPrice', searchParams.get('minPrice')!)
      if (searchParams.get('maxPrice')) params.set('maxPrice', searchParams.get('maxPrice')!)
      if (searchParams.get('rating')) params.set('rating', searchParams.get('rating')!)
      
      const response = await fetch(`/api/properties?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setHotels(data.data || [])
        setTotalResults(data.pagination?.total || 0)
      }
    } catch (error) {
      console.error('Failed to fetch hotels')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHotels()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background">
      {/* Search Bar */}
      <div className="border-b bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <SearchBar />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-80">
            <SearchFilters />
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setShowMobileFilters(true)}
              className="w-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Results */}
          <div className="flex-1">
            <SearchResults hotels={hotels} loading={loading} totalResults={totalResults} />
          </div>
        </div>
      </div>
    </div>
  )
}
