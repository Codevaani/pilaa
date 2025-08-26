"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { sanitizeLog } from "@/lib/security"
import { Calendar, MapPin, Users, Star, Download, Eye, MessageCircle, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

const [bookings, setBookings] = useState<any[]>([])
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    totalSpent: 0,
  })
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/user/bookings')
      if (response.ok) {
        const data = await response.json()
        setBookings(data.data || [])
        setBookingStats(data.stats || bookingStats)
      }
    } catch (error) {
      console.error('Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchBookings()
    } else {
      setLoading(false)
    }
  }, [user])

export default function MyBookingsPage() {
  const { user, isLoaded } = useUser()
  const [selectedTab, setSelectedTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)



  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'upcoming':
        return 'default'
      case 'completed':
        return 'secondary'
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'upcoming':
        return 'text-primary'
      case 'completed':
        return 'text-green-600'
      case 'cancelled':
        return 'text-red-600'
      default:
        return 'text-muted-foreground'
    }
  }

  const filteredBookings = bookings.filter(booking => {
    if (selectedTab === "all") return true
    if (selectedTab === "upcoming") return booking.status === "upcoming" || booking.status === "confirmed"
    if (selectedTab === "completed") return booking.status === "completed"
    if (selectedTab === "cancelled") return booking.status === "cancelled"
    return true
  })

  const handleAction = (bookingId: string, action: string) => {
    const sanitizedId = sanitizeLog(bookingId)
    const sanitizedAction = sanitizeLog(action)
    console.log(`${sanitizedAction} booking ${sanitizedId}`)
    alert(`Booking ${sanitizedAction} action performed!`)
  }

  if (!isLoaded || loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <Skeleton className="h-8 w-1/4 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please sign in to view your bookings.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-muted-foreground">
          Manage your hotel reservations and travel history
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">{bookingStats.total}</div>
            <p className="text-muted-foreground">Total Bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">{bookingStats.upcoming}</div>
            <p className="text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{bookingStats.completed}</div>
            <p className="text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">₹{bookingStats.totalSpent.toLocaleString()}</div>
            <p className="text-muted-foreground">Total Spent</p>
          </CardContent>
        </Card>
      </div>

      {/* Bookings */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab}>
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Property Image */}
                    <div className="relative w-full md:w-64 h-48 md:h-auto">
                      <Image
                        src={booking.propertyImage}
                        alt={booking.propertyName}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge variant={getStatusBadgeVariant(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold mb-1">{booking.propertyName}</h3>
                              <div className="flex items-center text-muted-foreground text-sm mb-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                {booking.location}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Booking ID: {booking.id} • Confirmation: {booking.confirmationNumber}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">Check-in</p>
                                <p className="text-sm text-muted-foreground">{booking.checkIn}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">Check-out</p>
                                <p className="text-sm text-muted-foreground">{booking.checkOut}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">Guests</p>
                                <p className="text-sm text-muted-foreground">
                                  {booking.guests.adults} adults, {booking.guests.children} children
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Room Type</p>
                              <p className="font-medium">{booking.roomType}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Total Amount</p>
                              <p className="text-xl font-bold text-primary">₹{booking.totalAmount.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-6">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          
                          {booking.status === 'upcoming' || booking.status === 'confirmed' ? (
                            <>
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Download Voucher
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleAction(booking.id, 'modify')}
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Modify Booking
                              </Button>
                            </>
                          ) : booking.status === 'completed' && !booking.rating ? (
                            <Button 
                              size="sm"
                              onClick={() => handleAction(booking.id, 'review')}
                            >
                              <Star className="h-4 w-4 mr-2" />
                              Write Review
                            </Button>
                          ) : booking.status === 'completed' && booking.rating ? (
                            <div className="flex items-center space-x-1 text-sm">
                              <Star className="h-4 w-4 fill-primary text-primary" />
                              <span>Rated {booking.rating}/5</span>
                            </div>
                          ) : null}
                          
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Contact Support
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBookings.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No bookings found</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedTab === "all" 
                    ? "You haven't made any bookings yet" 
                    : `No ${selectedTab} bookings found`}
                </p>
                <Button asChild>
                  <a href="/search">Browse Hotels</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
