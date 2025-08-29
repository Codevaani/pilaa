"use client"

import { useState, useEffect, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { 
  Building, 
  Plus, 
  Eye, 
  Edit, 
  MoreHorizontal, 
  Star, 
  MapPin, 
  Calendar,
  DollarSign,
  TrendingUp,
  Settings,
  ExternalLink
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import Link from "next/link"

interface Property {
  id: string;
  name: string;
  location: string;
  status: string;
  type: string;
  images: string[];
  rating: number;
  reviewCount: number;
  occupancyRate: number;
  availableRooms: number;
  totalRooms: number;
  averagePrice: number;
  amenities: string[];
  lastUpdated: string;
  slug: string;
  monthlyRevenue: number;
}

export default function MyPropertiesPage() {
  const { user, isLoaded } = useUser()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const fetchProperties = useCallback(async () => {
    try {
      const response = await fetch('/api/partner/properties')
      if (response.ok) {
        const data = await response.json()
        setProperties(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch properties')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user?.publicMetadata?.role === 'partner') {
      fetchProperties()
    } else {
      setLoading(false)
    }
  }, [user, fetchProperties])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'inactive':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || property.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  

  const totalStats = {
    totalProperties: properties.length,
    activeProperties: properties.filter(p => p.status === 'active').length,
    totalRooms: properties.reduce((sum, p) => sum + p.totalRooms, 0),
    totalRevenue: properties.reduce((sum, p) => sum + p.monthlyRevenue, 0),
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
          <h1 className="text-3xl font-bold mb-2">My Properties</h1>
          <p className="text-muted-foreground">
            Manage your listed properties and track their performance
          </p>
        </div>
        <Button asChild>
          <Link href="/partner/add-property">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">{totalStats.totalProperties}</div>
            <p className="text-muted-foreground">Total Properties</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{totalStats.activeProperties}</div>
            <p className="text-muted-foreground">Active Properties</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">{totalStats.totalRooms}</div>
            <p className="text-muted-foreground">Total Rooms</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">₹{totalStats.totalRevenue.toLocaleString()}</div>
            <p className="text-muted-foreground">Monthly Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search properties by name or location..."
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
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
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
        </CardContent>
      </Card>

      {/* Properties Grid/List */}
      {filteredProperties.length > 0 ? (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredProperties.map((property) => (
            <Card key={property.id} className={`group overflow-hidden hover:shadow-lg transition-all duration-300 ${
              viewMode === "list" ? "flex" : ""
            }`}>
              <div className={`relative ${viewMode === "list" ? "w-80 h-48" : "h-48"}`}>
                <Image
                  src={property.images[0]}
                  alt={property.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge variant={getStatusBadgeVariant(property.status)}>
                    {property.status}
                  </Badge>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge variant="outline" className="bg-white/80">
                    {property.type}
                  </Badge>
                </div>
              </div>
              
              <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{property.name}</h3>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location}
                    </div>
                  </div>

                  {property.status === 'active' && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-primary" />
                        <span>{property.rating} ({property.reviewCount})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span>{property.occupancyRate}% occupied</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{property.availableRooms}/{property.totalRooms} available</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span>₹{property.averagePrice.toLocaleString()}/night</span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {property.amenities.slice(0, 3).map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {property.amenities.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{property.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-xs text-muted-foreground">
                      Updated: {property.lastUpdated}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/hotel/${property.slug}`} target="_blank">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(`/hotel/${property.slug}`, '_blank')}
                        title="View Property"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => alert('Edit functionality coming soon!')}
                        title="Edit Property"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          const actions = ['Copy Link', 'Duplicate Property', 'Archive Property', 'Delete Property']
                          const action = prompt(`Choose action:\n${actions.map((a, i) => `${i+1}. ${a}`).join('\n')}`)
                          if (action) {
                            const actionIndex = parseInt(action) - 1
                            if (actionIndex >= 0 && actionIndex < actions.length) {
                              alert(`${actions[actionIndex]} selected for ${property.name}`)
                            }
                          }
                        }}
                        title="More Options"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {property.status === 'active' && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Monthly Revenue:</span>
                        <span className="font-bold text-primary">
                          ₹{property.monthlyRevenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm || statusFilter !== "all" ? "No properties found" : "No properties yet"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search criteria or filters"
                : "Start by adding your first property to begin earning"
              }
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

      {/* Quick Actions */}
      {filteredProperties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for managing your properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Plus className="h-6 w-6" />
                <span>Add New Property</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Settings className="h-6 w-6" />
                <span>Bulk Edit Prices</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Calendar className="h-6 w-6" />
                <span>Manage Availability</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
