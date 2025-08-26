"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useUser } from "@clerk/nextjs"
import { Search, Filter, Eye, CheckCircle, XCircle, Building } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Property {
  id: string;
  name: string;
  location: string;
  partner: string;
  type: string;
  status: string;
  rooms: number;
  bookings: number;
  rating: number;
  reviews: number;
  revenue: number;
  createdDate: string;
  image: string;
}

export default function AdminPropertiesPage() {
  const { user, isLoaded } = useUser()
  const [properties, setProperties] = useState<Property[]>([])
  const [propertyStats, setPropertyStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0,
    hotels: 0,
    resorts: 0,
    villas: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const fetchProperties = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/properties')
      if (response.ok) {
        const data = await response.json()
        setProperties(data.data || [])
        setPropertyStats(data.stats || propertyStats)
      }
    } catch (error) {
      console.error('Failed to fetch properties')
    } finally {
      setLoading(false)
    }
  }, [propertyStats])

  useEffect(() => {
    if (user?.publicMetadata?.role === 'admin') {
      fetchProperties()
    } else {
      setLoading(false)
    }
  }, [user, fetchProperties])



  const handlePropertyAction = async (propertyId: string, action: string) => {
    try {
      const response = await fetch('/api/admin/properties', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: propertyId,
          action: action
        })
      })

      if (response.ok) {
        await fetchProperties()
        alert(`Property ${action}d successfully!`)
      } else {
        alert('Failed to update property')
      }
    } catch (error) {
      console.error('Error updating property:', error)
      alert('Failed to update property')
    }
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.partner.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || property.type === selectedType
    const matchesStatus = selectedStatus === "all" || property.status === selectedStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  if (!isLoaded || loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!user || user.publicMetadata?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
      </div>
    )
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'suspended':
        return 'destructive'
      case 'pending':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'hotel':
        return 'default'
      case 'resort':
        return 'secondary'
      case 'villa':
        return 'outline'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Property Management</h1>
        <p className="text-muted-foreground">
          Manage all properties listed on the platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Properties</p>
                <p className="text-2xl font-bold text-primary">{propertyStats.total.toLocaleString()}</p>
              </div>
              <Building className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Properties</p>
                <p className="text-2xl font-bold text-green-600">{propertyStats.active.toLocaleString()}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">{propertyStats.pending.toLocaleString()}</p>
              </div>
              <Filter className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Suspended</p>
                <p className="text-2xl font-bold text-red-600">{propertyStats.suspended.toLocaleString()}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties by name, location, or partner..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border rounded-md px-3 py-2 bg-background"
              >
                <option value="all">All Types</option>
                <option value="hotel">Hotels</option>
                <option value="resort">Resorts</option>
                <option value="villa">Villas</option>
                <option value="apartment">Apartments</option>
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border rounded-md px-3 py-2 bg-background"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image
                src={property.image}
                alt={property.name}
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge variant={getStatusBadgeVariant(property.status)}>
                  {property.status}
                </Badge>
                <Badge variant={getTypeBadgeVariant(property.type)}>
                  {property.type}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{property.name}</h3>
                  <p className="text-sm text-muted-foreground">{property.location}</p>
                  <p className="text-xs text-muted-foreground">by {property.partner}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Rooms:</span>
                    <span className="ml-1 font-medium">{property.rooms}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Bookings:</span>
                    <span className="ml-1 font-medium">{property.bookings}</span>
                  </div>
                  {property.rating > 0 && (
                    <>
                      <div>
                        <span className="text-muted-foreground">Rating:</span>
                        <span className="ml-1 font-medium">{property.rating}★</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reviews:</span>
                        <span className="ml-1 font-medium">{property.reviews}</span>
                      </div>
                    </>
                  )}
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Revenue:</span>
                    <span className="ml-1 font-medium text-primary">₹{property.revenue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xs text-muted-foreground">
                    Created: {property.createdDate}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(`/hotel/${property.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    
                    {property.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handlePropertyAction(property.id, 'approve')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    )}
                    
                    {property.status === 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePropertyAction(property.id, 'suspend')}
                        className="text-destructive hover:text-destructive"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Suspend
                      </Button>
                    )}
                    
                    {property.status === 'suspended' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePropertyAction(property.id, 'activate')}
                        className="text-green-600 hover:text-green-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Activate
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No properties found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
