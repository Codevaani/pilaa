"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Star, MapPin, Heart, Share2, ChevronLeft, ChevronRight, Users, Bed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"



interface Property {
  _id: string;
  name: string;
  images: string[];
  rating: number;
  reviewCount: number;
  address: {
    city: string;
    state: string;
    street: string;
    zipCode: string;
  };
  description: string;
  amenities: string[];
}

interface Room {
  _id: string;
  id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  capacity: {
    adults: number;
    children: number;
  };
  type: string;
  amenities: string[];
  availableRooms: number;
}

interface Review {
  _id: string;
  id: string;
  user: {
    name: string;
  };
  rating: number;
  createdAt: string;
  comment: string;
}

interface HotelData {
  property: Property;
  rooms: Room[];
  reviews: Review[];
}

function ImageGallery({ images }: { images: string[] }) {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="relative">
      <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
        <Image
          src={images[currentImage]}
          alt="Hotel image"
          fill
          className="object-cover"
          priority
        />
        
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentImage ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentImage(index)}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="flex space-x-2 mt-4 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            className={`relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 ${
              index === currentImage ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setCurrentImage(index)}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

function BookingWidget({ property, rooms, selectedRoom, setSelectedRoom }: { property: Property, rooms: Room[], selectedRoom: string, setSelectedRoom: (id: string) => void }) {
  // selectedRoom is now passed as prop
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState({ adults: 2, children: 0 })
  const [isBooking, setIsBooking] = useState(false)

  const selectedRoomData = rooms.find(room => (room._id || room.id) === selectedRoom)

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates')
      return
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      alert('Check-out date must be after check-in date')
      return
    }

    setIsBooking(true)
    
    try {
      const bookingData = {
        propertyId: property._id,
        roomId: selectedRoom,
        checkIn,
        checkOut,
        guests,
        totalAmount: selectedRoomData?.price || 0
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      })

      if (response.ok) {
        alert('Booking successful! You will receive a confirmation email shortly.')
        // Reset form
        setCheckIn('')
        setCheckOut('')
        setGuests({ adults: 2, children: 0 })
      } else {
        const error = await response.json()
        alert(error.message || 'Booking failed. Please try again.')
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('Booking failed. Please try again.')
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Book Your Stay</span>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              ₹{selectedRoomData?.price.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">per night</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Room Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">Select Room</label>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            {rooms.map((room) => (
              <option key={room._id || room.id} value={room._id || room.id}>
                {room.name} - ₹{room.price?.toLocaleString() || '0'}
              </option>
            ))}
          </select>
        </div>

        {/* Check-in/Check-out */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm font-medium mb-1 block">Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="text-sm font-medium mb-2 block">Guests</label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm">Adults:</span>
              <select
                value={guests.adults}
                onChange={(e) => setGuests(prev => ({ ...prev, adults: parseInt(e.target.value) }))}
                className="border rounded px-2 py-1"
              >
                {[1, 2, 3, 4].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Children:</span>
              <select
                value={guests.children}
                onChange={(e) => setGuests(prev => ({ ...prev, children: parseInt(e.target.value) }))}
                className="border rounded px-2 py-1"
              >
                {[0, 1, 2, 3].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Room Details */}
        {selectedRoomData && (
          <div className="bg-muted/50 rounded-lg p-3">
            <h4 className="font-medium mb-2">{selectedRoomData.name}</h4>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{selectedRoomData.capacity.adults} adults, {selectedRoomData.capacity.children} children</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedRoomData.amenities.slice(0, 3).map((amenity: string) => (
                <Badge key={amenity} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Button 
          className="w-full" 
          size="lg"
          onClick={handleBooking}
          disabled={isBooking}
        >
          {isBooking ? 'Processing...' : 'Book Now'}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Free cancellation • No prepayment needed
        </div>
      </CardContent>
    </Card>
  )
}

export default function HotelDetailPage() {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<HotelData | null>(null)
  const [selectedRoom, setSelectedRoom] = useState('')

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await fetch(`/api/properties/${params.slug}`)
        if (response.ok) {
          const result = await response.json()
          setData(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch hotel data')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.slug) {
      fetchHotelData()
    }
  }, [params.slug])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96 w-full rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <div>
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null
  
  const { property, rooms, reviews } = data

  // Set initial selected room when data loads
  if (selectedRoom === '' && rooms?.length > 0) {
    setSelectedRoom(rooms[0]._id || rooms[0].id || '')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{property.name}</h1>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-medium">{property.rating}</span>
                      <span className="text-muted-foreground">({property.reviewCount} reviews)</span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{property.address.city}, {property.address.state}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <ImageGallery images={property.images} />

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="rooms">Rooms</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">About this property</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Location</h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">
                        {property.address.street}, {property.address.city}, {property.address.state} {property.address.zipCode}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Located in the heart of {property.address.city}, this property offers easy access to major attractions and business districts.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="rooms" className="space-y-6">
                <div className="grid gap-6">
                  {rooms.map((room) => (
                    <Card key={room._id || room.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-1/3">
                            <div className="relative h-48 rounded-lg overflow-hidden">
                              <Image
                                src={room.images[0]}
                                alt={room.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <div className="md:w-2/3">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="text-lg font-semibold">{room.name}</h4>
                                <p className="text-muted-foreground text-sm mt-1">
                                  {room.description}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-primary">
                                  ₹{room.price.toLocaleString()}
                                </div>
                                <div className="text-sm text-muted-foreground">per night</div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span>{room.capacity.adults} adults, {room.capacity.children} children</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Bed className="h-4 w-4" />
                                <span>{room.type}</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {room.amenities.map((amenity) => (
                                <Badge key={amenity} variant="secondary">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="text-sm text-muted-foreground">
                                {room.availableRooms || 0} rooms available
                              </div>
                              <Button 
                                onClick={() => {
                                  setSelectedRoom(room._id || room.id || '')
                                  // Scroll to booking widget
                                  document.querySelector('.sticky')?.scrollIntoView({ behavior: 'smooth' })
                                }}
                                variant={selectedRoom === (room._id || room.id) ? 'default' : 'outline'}
                              >
                                {selectedRoom === (room._id || room.id) ? 'Selected' : 'Select Room'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Property Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Guest Reviews</h3>
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <Card key={review._id || review.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {(review.user?.name || 'A').charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-medium">{review.user?.name || 'Anonymous'}</span>
                                <div className="flex items-center space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? 'fill-primary text-primary'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-muted-foreground">{review.comment}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Widget */}
          <div>
            <BookingWidget property={property} rooms={rooms} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} />
          </div>
        </div>
      </div>
    </div>
  )
}
