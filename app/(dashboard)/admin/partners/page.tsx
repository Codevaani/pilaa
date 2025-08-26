"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { UserCheck, Building, Mail, Phone, MapPin, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AdminPartnersPage() {
  const { user, isLoaded } = useUser()
  const [partners, setPartners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/admin/partners')
      if (response.ok) {
        const data = await response.json()
        setPartners(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch partners')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.publicMetadata?.role === 'admin') {
      fetchPartners()
    } else {
      setLoading(false)
    }
  }, [user])

  if (!isLoaded || loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Partners</h1>
        <p className="text-muted-foreground">
          Manage all approved partners in the system
        </p>
      </div>

      {/* Stats Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Partners</p>
              <p className="text-3xl font-bold text-primary">{partners.length}</p>
            </div>
            <UserCheck className="h-12 w-12 text-primary" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <Card key={partner.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{partner.businessName}</CardTitle>
                <Badge variant="default">
                  <UserCheck className="h-3 w-3 mr-1" />
                  Partner
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <UserCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">{partner.applicantName}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{partner.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{partner.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{partner.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{partner.propertyType}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Joined {partner.approvedDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {partners.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No partners found</h3>
            <p className="text-muted-foreground">
              No approved partners in the system yet
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}