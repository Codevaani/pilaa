"use client"

import { useState, useEffect, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { TrendingUp, DollarSign, Calendar, Building, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalBookings: number;
    averageBookingValue: number;
    activeProperties: number;
    totalProperties: number;
  };
  monthlyData: {
    month: string;
    revenue: number;
    bookings: number;
  }[];
  topPerformers: {
    id: string;
    name: string;
    bookings: number;
    revenue: number;
    occupancyRate: number;
  }[];
  propertyPerformance: {
    id: string;
    name: string;
    bookings: number;
    occupancyRate: number;
    revenue: number;
  }[];
}

export default function PartnerAnalyticsPage() {
  const { user, isLoaded } = useUser()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await fetch('/api/partner/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user?.publicMetadata?.role === 'partner') {
      fetchAnalytics()
    } else {
      setLoading(false)
    }
  }, [user, fetchAnalytics])

  if (!isLoaded || loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-muted rounded"></div>
            <div className="h-96 bg-muted rounded"></div>
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

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">No Analytics Data</h3>
        <p className="text-muted-foreground">Add properties and get bookings to see analytics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics & Insights</h1>
        <p className="text-muted-foreground">
          Track your property performance and business metrics
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-primary">₹{analytics.overview.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold text-primary">{analytics.overview.totalBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Booking Value</p>
                <p className="text-2xl font-bold text-primary">₹{Math.round(analytics.overview.averageBookingValue).toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Properties</p>
                <p className="text-2xl font-bold text-primary">{analytics.overview.activeProperties}/{analytics.overview.totalProperties}</p>
              </div>
              <Building className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>Revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.monthlyData.map((month: { month: string; revenue: number; bookings: number }, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-sm font-medium">{month.month}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{month.revenue.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{month.bookings} bookings</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Properties</CardTitle>
            <CardDescription>Your best revenue generators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topPerformers.map((property: { id: string; name: string; bookings: number; revenue: number; occupancyRate: number }, index: number) => (
                <div key={property.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{property.name}</h4>
                      <p className="text-xs text-muted-foreground">{property.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">₹{property.revenue.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{property.occupancyRate}% occupied</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Properties Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Property Performance Overview</CardTitle>
          <CardDescription>Detailed performance metrics for all your properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.propertyPerformance.map((property: { id: string; name: string; bookings: number; occupancyRate: number; revenue: number }) => (
              <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{property.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{property.bookings} bookings</span>
                      <span>•</span>
                      <span>{property.occupancyRate}% occupancy</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-primary">₹{property.revenue.toLocaleString()}</div>
                  <Badge variant={property.revenue > 0 ? 'default' : 'secondary'}>
                    {property.revenue > 0 ? 'Active' : 'No Revenue'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}