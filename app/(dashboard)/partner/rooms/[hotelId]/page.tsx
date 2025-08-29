"use client"

import { useState, useEffect, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  BedDouble, 
  Building, 
  ArrowLeft,
  Edit,
  Plus,
  Users,
  DollarSign,
  Calendar,
  Wifi,
  Car,
  Coffee,
  Tv,
  Bath,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface Room {
  id: string;
  roomNumber: string;
  type: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  price: number;
  capacity: number;
  amenities: string[];
  description: string;
  images: string[];
  currentGuest?: {
    name: string;
    checkIn: string;
    checkOut: string;
  };
  lastCleaned?: string;
  size: number; // in sq ft
  bedType: string;
  view: string;
}

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
}

interface HotelRoomsData {
  hotel: Hotel;
  rooms: Room[];
}

export default function HotelRoomsPage() {
  const { user, isLoaded } = useUser()
  const params = useParams()
  const router = useRouter()
  const hotelId = params.hotelId as string
  
  const [data, setData] = useState<HotelRoomsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const fetchHotelRooms = useCallback(async () => {
    if (!hotelId) return
    
    try {
      const response = await fetch(`/api/partner/rooms/${hotelId}`)
      if (response.ok) {
        const responseData = await response.json()
        setData(responseData.data)
      } else {
        console.error('Failed to fetch hotel rooms')
      }
    } catch (error) {
      console.error('Failed to fetch hotel rooms:', error)
    } finally {
      setLoading(false)
    }
  }, [hotelId])

  useEffect(() => {
    if (user?.publicMetadata?.role === 'partner') {
      fetchHotelRooms()
    } else {
      setLoading(false)
    }
  }, [user, fetchHotelRooms])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'occupied':
        return <Users className="h-4 w-4 text-orange-600" />
      case 'maintenance':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'cleaning':
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'default'
      case 'occupied':
        return 'destructive'
      case 'maintenance':
        return 'secondary'
      case 'cleaning':
        return 'outline'
      default:
        return 'outline'
    }
  }

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

  const filteredRooms = data?.rooms.filter(room => 
    statusFilter === 'all' || room.status === statusFilter
  ) || []

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
              <Skeleton key={i} className="h-80" />
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

  if (!data) {
    return (
      <div className="text-center py-12">
        <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Hotel not found</h3>
        <p className="text-muted-foreground mb-4">
          The hotel you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button onClick={() => router.push('/partner/rooms')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Rooms
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/partner/rooms')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-1">{data.hotel.name}</h1>
            <p className="text-muted-foreground">
              {data.hotel.location} • {data.hotel.type}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Hotel
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Room
          </Button>
        </div>
      </div>

      {/* Hotel Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Rooms</p>
                <p className="text-2xl font-bold text-primary">{data.hotel.totalRooms}</p>
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
                <p className="text-2xl font-bold text-green-600">{data.hotel.availableRooms}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Occupied</p>
                <p className="text-2xl font-bold text-orange-600">{data.hotel.occupiedRooms}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Price</p>
                <p className="text-2xl font-bold text-primary">₹{data.hotel.averagePrice}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Filter */}
      <div className="flex space-x-2">
        <Button 
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('all')}
        >
          All Rooms ({data.rooms.length})
        </Button>
        <Button 
          variant={statusFilter === 'available' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('available')}
        >
          Available ({data.rooms.filter(r => r.status === 'available').length})
        </Button>
        <Button 
          variant={statusFilter === 'occupied' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('occupied')}
        >
          Occupied ({data.rooms.filter(r => r.status === 'occupied').length})
        </Button>
        <Button 
          variant={statusFilter === 'maintenance' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('maintenance')}
        >
          Maintenance ({data.rooms.filter(r => r.status === 'maintenance').length})
        </Button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Room {room.roomNumber}</CardTitle>
                  <CardDescription>{room.type} • {room.bedType}</CardDescription>
                </div>
                <Badge variant={getStatusBadgeVariant(room.status)}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(room.status)}
                    <span className="capitalize">{room.status}</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Room Image Placeholder */}
              <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                {room.images && room.images.length > 0 ? (
                  <img 
                    src={room.images[0]} 
                    alt={`Room ${room.roomNumber}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <BedDouble className="h-12 w-12 text-muted-foreground" />
                )}
              </div>

              {/* Room Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-bold text-lg">₹{room.price}/night</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Capacity:</span>
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {room.capacity} guests
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Size:</span>
                  <span>{room.size} sq ft</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">View:</span>
                  <span className="capitalize">{room.view}</span>
                </div>
              </div>

              {/* Current Guest Info */}
              {room.status === 'occupied' && room.currentGuest && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users className="h-4 w-4 text-orange-600 mr-2" />
                    <span className="font-medium text-orange-800">{room.currentGuest.name}</span>
                  </div>
                  <div className="text-sm text-orange-700">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {room.currentGuest.checkIn} - {room.currentGuest.checkOut}
                    </div>
                  </div>
                </div>
              )}

              {/* Amenities */}
              {room.amenities && room.amenities.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Room Amenities:</p>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.slice(0, 4).map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-1 text-xs bg-muted px-2 py-1 rounded">
                        {getAmenityIcon(amenity)}
                        <span className="capitalize">{amenity}</span>
                      </div>
                    ))}
                    {room.amenities.length > 4 && (
                      <div className="text-xs text-muted-foreground px-2 py-1">
                        +{room.amenities.length - 4} more
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {room.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {room.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" className="flex-1">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredRooms.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BedDouble className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {statusFilter === 'all' ? 'No rooms found' : `No ${statusFilter} rooms`}
            </h3>
            <p className="text-muted-foreground mb-4">
              {statusFilter === 'all' 
                ? "This hotel doesn't have any rooms yet." 
                : `No rooms with status "${statusFilter}" found.`
              }
            </p>
            {statusFilter === 'all' ? (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add First Room
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setStatusFilter('all')}>
                Show All Rooms
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
