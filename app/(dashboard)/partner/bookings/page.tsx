"use client"

import { useState, useEffect, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { 
  Calendar, 
  Users, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  MessageCircle,
  Eye,
  RefreshCw
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

interface Booking {
  id: string;
  _id: string;
  guestName: string;
  bookingId: string;
  propertyName: string;
  status: string;
  amount: number;
  totalAmount: number;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
  };
  nights: number;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;
  bookingDate: string;
  commission: number;
}

export default function PartnerBookingsPage() {
  const { user, isLoaded } = useUser()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchBookings = useCallback(async () => {
    try {
      const response = await fetch('/api/partner/bookings')
      if (response.ok) {
        const data = await response.json()
        setBookings(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user?.publicMetadata?.role === 'partner') {
      fetchBookings()
    } else {
      setLoading(false)
    }
  }, [user, fetchBookings])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default'
      case 'pending':
        return 'default' // Making pending more prominent with default (blue) styling
      case 'completed':
        return 'outline'
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = (booking.guestName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (booking.bookingId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (booking.propertyName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    const matchesTab = selectedTab === "all" || booking.status === selectedTab
    
    return matchesSearch && matchesTab
  })

  const handleBookingAction = async (bookingId: string, action: string) => {
    try {
      const response = await fetch(`/api/partner/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      
      if (response.ok) {
        const statusMap: Record<string, string> = {
          confirm: 'confirmed',
          reject: 'cancelled',
          complete: 'completed'
        }
        
        const newStatus = statusMap[action] || 'cancelled'
        
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId || booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        ))
      }
    } catch (error) {
      console.error('Failed to update booking')
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
          <Skeleton className="h-96" />
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
          <h1 className="text-3xl font-bold mb-2">Bookings Management</h1>
          <p className="text-muted-foreground">
            Manage reservations across all your properties
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Bookings
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">{bookings.length}</div>
            <p className="text-muted-foreground">Total Bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600">{bookings.filter(b => b.status === 'pending').length}</div>
            <p className="text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{bookings.filter(b => b.status === 'confirmed').length}</div>
            <p className="text-muted-foreground">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">₹{bookings.reduce((sum, b) => sum + (b.amount || 0), 0).toLocaleString()}</div>
            <p className="text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by guest name, booking ID, or property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-md px-3 py-2 bg-background"
              >
                <option value="all">All Properties</option>
                <option value="luxury-beach-resort">Luxury Beach Resort</option>
                <option value="city-center-hotel">City Center Hotel</option>
                <option value="mountain-view-villa">Mountain View Villa</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({bookings.filter(b => b.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed ({bookings.filter(b => b.status === 'confirmed').length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({bookings.filter(b => b.status === 'completed').length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({bookings.filter(b => b.status === 'cancelled').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab}>
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                    {/* Booking Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">{booking.guestName}</h3>
                            <Badge variant={getStatusBadgeVariant(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Booking ID: {booking._id || booking.id}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Property: {booking.propertyName || 'Property Name'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">
                            ₹{(booking.amount || booking.totalAmount || 0).toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Status: {booking.status}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
                              {booking.guests?.adults || 0}A, {booking.guests?.children || 0}C
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Duration</p>
                            <p className="text-sm text-muted-foreground">{booking.nights} nights</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{booking.guestEmail}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{booking.guestPhone}</span>
                        </div>
                      </div>

                      {booking.specialRequests && booking.specialRequests !== "None" && (
                        <div className="bg-muted/50 rounded-lg p-3 mb-4">
                          <p className="text-sm font-medium mb-1">Special Requests:</p>
                          <p className="text-sm text-muted-foreground">{booking.specialRequests}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Booked on: {booking.bookingDate}</span>
                        <span>Commission: ₹{(booking.commission || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 lg:ml-6">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => alert(`Booking Details:\n\nGuest: ${booking.guestName}\nID: ${booking._id || booking.id}\nProperty: ${booking.propertyName}\nStatus: ${booking.status}\nAmount: ₹${(booking.amount || booking.totalAmount || 0).toLocaleString()}\nCheck-in: ${booking.checkIn}\nCheck-out: ${booking.checkOut}\nGuests: ${booking.guests?.adults || 0}A, ${booking.guests?.children || 0}C\nEmail: ${booking.guestEmail}\nPhone: ${booking.guestPhone}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleBookingAction(booking.id, e.target.value)
                            e.target.value = ''
                          }
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm min-w-[120px] cursor-pointer"
                      >
                        <option value="">Change Status</option>
                        {booking.status === 'pending' && <option value="confirm">Confirm</option>}
                        {booking.status === 'pending' && <option value="reject">Reject</option>}
                        {booking.status === 'confirmed' && <option value="complete">Complete</option>}
                        {booking.status !== 'cancelled' && <option value="reject">Cancel</option>}
                      </select>
                      

                      
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Invoice
                      </Button>
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
                  {searchTerm || selectedTab !== "all" 
                    ? "Try adjusting your search criteria or filters"
                    : "No bookings yet. Bookings will appear here once guests make reservations."
                  }
                </p>
                <Button variant="outline">
                  Promote Your Properties
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      
    </div>
  )
}
