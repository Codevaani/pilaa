"use client"

import { useState, useEffect, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { 
  BedDouble, 
  Building, 
  Eye, 
  Plus, 
  MapPin, 
  Users,
  Wifi,
  Car,
  Coffee,
  Tv,
  Bath
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface Hotel {
  id: string;
  name: string;
  location: string;
  type: string;
  status: string;
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  averagePrice: number;
  amenities: string[];
  images: string[];
  slug: string;
}

interface RoomStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  totalHotels: number;
}

export default function MyRoomsPage() {
  const { user, isLoaded } = useUser()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [stats, setStats] = useState<RoomStats>({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    totalHotels: 0
  })
  const [loading, setLoading] = useState(true)

  const fetchHotelsAndRooms = useCallback(async () => {
    try {
      const response = await fetch('/api/partner/rooms')
      if (response.ok) {
        const data = await response.json()
        setHotels(data.hotels || [])
        setStats(data.stats || stats)
      }
    } catch (error) {
      console.error('Failed to fetch hotels and rooms data')
    } finally {
      setLoading(false)
    }
  }, [stats])

  useEffect(() => {
    if (user?.publicMetadata?.role === 'partner') {
      fetchHotelsAndRooms()
    } else {
      setLoading(false)
    }
  }, [user, fetchHotelsAndRooms])

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-4 w-4" />
      case 'parking':
        return <Car className="h-4 w-4" />
      case 'restaurant':
        return <Coffee className="h-4 w-4" />
      case 'tv':
        return <Tv className="h-4 w-4" />
      case 'bathroom':
        return <Bath className="h-4 w-4" />
      default:
        return <div className="h-4 w-4 bg-primary/20 rounded-full" />
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <Skeleton className="h-8 w-1/4 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </div>
    )
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
        <div>
          <h1 className="text-3xl font-bold mb-2">My Rooms</h1>
          <p className="text-muted-foreground">
            Manage all rooms across your properties
          </p>
        </div>
        <Button asChild>
          <Link href="/partner/add-property">
            <Plus className="h-4 w-4 mr-2" />
            Add New Property
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Hotels</p>
                <p className="text-2xl font-bold text-primary">{stats.totalHotels}</p>
              </div>
              <Building className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Rooms</p>
                <p className="text-2xl font-bold text-primary">{stats.totalRooms}</p>
              </div>
              <BedDouble className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-green-600">{stats.availableRooms}</p>
              </div>
              <BedDouble className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Occupied</p>
                <p className="text-2xl font-bold text-orange-600">{stats.occupiedRooms}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <Card key={hotel.id} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{hotel.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {hotel.location}
                  </CardDescription>
                </div>
                <Badge variant={hotel.status === 'active' ? 'default' : 'secondary'}>
                  {hotel.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Hotel Image Placeholder */}
              <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                {hotel.images && hotel.images.length > 0 ? (
                  <img 
                    src={hotel.images[0]} 
                    alt={hotel.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Building className="h-12 w-12 text-muted-foreground" />
                )}
              </div>

              {/* Room Statistics */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-primary">{hotel.totalRooms}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{hotel.availableRooms}</div>
                  <div className="text-xs text-muted-foreground">Available</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">{hotel.occupiedRooms}</div>
                  <div className="text-xs text-muted-foreground">Occupied</div>
                </div>
              </div>

              {/* Hotel Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant="outline">{hotel.type}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Avg. Price:</span>
                  <span className="font-medium">₹{hotel.averagePrice?.toLocaleString() || 0}/night</span>
                </div>
              </div>

              {/* Amenities */}
              {hotel.amenities && hotel.amenities.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Amenities:</p>
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.slice(0, 4).map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-1 text-xs bg-muted px-2 py-1 rounded">
                        {getAmenityIcon(amenity)}
                        <span className="capitalize">{amenity}</span>
                      </div>
                    ))}
                    {hotel.amenities.length > 4 && (
                      <div className="text-xs text-muted-foreground px-2 py-1">
                        +{hotel.amenities.length - 4} more
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Button asChild className="w-full mt-4">
                <Link href={`/partner/rooms/${hotel.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View All Rooms
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {hotels.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BedDouble className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No rooms found</h3>
            <p className="text-muted-foreground mb-4">
              You haven't added any properties yet. Add your first property to start managing rooms.
            </p>
            <Button asChild>
              <Link href="/partner/add-property">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Property
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
