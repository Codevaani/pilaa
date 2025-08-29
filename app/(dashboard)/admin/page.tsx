"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Users, Building, BookOpen, DollarSign, TrendingUp, CheckCircle, XCircle } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Verification {
  id: string;
  businessName: string;
  applicantName: string;
  location: string;
  propertyType: string;
  submittedDate: string;
  status: string;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedDate: string;
}

export default function AdminPanelPage() {
  const { user, isLoaded } = useUser()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingVerifications: 0,
    activePartners: 0,
  })
  const [pendingVerifications, setPendingVerifications] = useState<Verification[]>([])
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAdminData = useCallback(async () => {
    try {
      const [statsRes, verificationsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/verifications'),
        fetch('/api/admin/users')
      ])
      
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData.data || stats)
      }
      
      if (verificationsRes.ok) {
        const verificationsData = await verificationsRes.json()
        setPendingVerifications(verificationsData.data || [])
      }
      
      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setRecentUsers(usersData.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch admin data')
    } finally {
      setLoading(false)
    }
  }, [stats])

  useEffect(() => {
    if (user?.publicMetadata?.role === 'admin') {
      fetchAdminData()
    } else {
      setLoading(false)
    }
  }, [user, fetchAdminData])



  const handleVerification = (id: string, action: 'approve' | 'reject') => {
    console.log(`${action} verification for ID: ${id}`)
    alert(`Partner application ${action}d successfully!`)
  }

  // Check if user is loaded and has admin role
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

  // Check if user has admin role
  if (!user || user.publicMetadata?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don&apos;t have permission to access the admin panel.
            </p>
            <Button asChild>
              <Link href="/">Go to Home</Link>
            </Button>
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.firstName}! Manage your platform and monitor performance.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-primary">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Properties</p>
                <p className="text-2xl font-bold text-primary">{stats.totalProperties.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-primary">{stats.totalBookings.toLocaleString()}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-primary">₹{(stats.totalRevenue / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="verifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="verifications">Verifications</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Verifications Tab */}
        <TabsContent value="verifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Pending Partner Verifications</span>
                <Badge variant="secondary">{pendingVerifications.filter(v => v.status === 'pending').length} pending</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingVerifications.filter(v => v.status === 'pending').slice(0, 5).map((verification) => (
                  <div key={verification.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-medium">{verification.businessName}</h4>
                          <p className="text-sm text-muted-foreground">
                            by {verification.applicantName} • {verification.location}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{verification.propertyType}</Badge>
                            <span className="text-xs text-muted-foreground">
                              Submitted: {verification.submittedDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVerification(verification.id, 'reject')}
                        className="text-destructive hover:text-destructive"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleVerification(verification.id, 'approve')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.length > 0 ? recentUsers.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {user.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{user.name || 'Unknown User'}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={user.role === 'partner' ? 'default' : 'secondary'}>
                        {user.role || 'user'}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Joined: {user.joinedDate || 'Recently'}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Properties Tab */}
        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <CardTitle>Property Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Property Management</h3>
                <p className="text-muted-foreground mb-4">
                  Advanced property management features coming soon
                </p>
                <Button variant="outline">View All Properties</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground mb-4">
                  Detailed reports and analytics dashboard coming soon
                </p>
                <Button variant="outline">Generate Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
