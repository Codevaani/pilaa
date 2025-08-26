"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Building, DollarSign, Calendar, Users, Plus, Eye, Edit, TrendingUp, XCircle } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Property {
  id: string;
  name: string;
  location: string;
  type: string;
  status: string;
  rooms: number;
  revenue: number;
  bookings: number;
  occupancy: number;
}

interface RecentBooking {
  id: string;
  guestName: string;
  property: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  status: string;
}

export default function PartnerPanelPage() {
  const { user, isLoaded } = useUser()
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    averageRating: 0,
    thisMonthBookings: 0,
  })
  const [properties, setProperties] = useState<Property[]>([])
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPartnerData = useCallback(async () => {
    try {
      const [statsRes, propertiesRes, bookingsRes] = await Promise.all([
        fetch('/api/partner/stats'),
        fetch('/api/partner/properties'),
        fetch('/api/partner/bookings')
      ])
      
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData.data || stats)
      }
      
      if (propertiesRes.ok) {
        const propertiesData = await propertiesRes.json()
        setProperties(propertiesData.data || [])
      }
      
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json()
        setRecentBookings(bookingsData.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch partner data')
    } finally {
      setLoading(false)
    }
  }, [stats])

  useEffect(() => {
    if (user?.publicMetadata?.role === 'partner') {
      fetchPartnerData()
    } else {
      setLoading(false)
    }
  }, [user, fetchPartnerData])



  // Check if user is loaded and has partner role
  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Check if user has partner role
  if (!user || user.publicMetadata?.role !== 'partner') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don&apos;t have permission to access the partner panel. Please apply to become a partner first.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button asChild>
                <Link href="/partner/register">Become a Partner</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Go to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 p-8">
        <div className="container mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Partner Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.firstName}! Manage your properties and bookings.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Properties</p>
                <p className="text-2xl font-bold text-primary">{stats.totalProperties}</p>
              </div>
              <Building className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold text-primary">{stats.totalBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-primary">₹{(stats.totalRevenue / 1000).toFixed(0)}K</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                <p className="text-2xl font-bold text-primary">{stats.occupancyRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="properties" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="properties">My Properties</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Properties Tab */}
        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <CardTitle>My Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {properties.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          <Building className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium">{property.name}</h4>
                          <p className="text-sm text-muted-foreground">{property.location}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{property.type}</Badge>
                            <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
                              {property.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {property.rooms} rooms
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right mr-4">
                      <div className="text-sm space-y-1">
                        <div>Revenue: ₹{(property.revenue || 0).toLocaleString()}</div>
                        <div>Bookings: {property.bookings || 0}</div>
                        <div>Occupancy: {property.occupancy || 0}%</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{booking.guestName}</h4>
                        <p className="text-sm text-muted-foreground">{booking.property}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking.checkIn} to {booking.checkOut}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        ₹{booking.amount.toLocaleString()}
                      </div>
                      <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground mb-4">
                  Detailed analytics and reporting features coming soon
                </p>
                <Button variant="outline">View Reports</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Partner Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Account Settings</h3>
                <p className="text-muted-foreground mb-4">
                  Partner account management features coming soon
                </p>
                <Button variant="outline">Manage Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
