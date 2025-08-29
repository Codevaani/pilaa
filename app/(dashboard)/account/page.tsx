"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Camera, Mail, Phone, MapPin, Calendar } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface UserStats {
  totalBookings: number
  totalSpent: number
  membershipLevel: string
  averageRating: number
}

interface RecentActivity {
  id: string
  type: string
  title: string
  description: string
  date: string
}

export default function AccountProfilePage() {
  const { user, isLoaded } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  })
  const [userStats, setUserStats] = useState<UserStats>({
    totalBookings: 0,
    totalSpent: 0,
    membershipLevel: "Bronze",
    averageRating: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])

  // Fetch user stats and activity
  const fetchUserData = useCallback(async () => {
    if (!user) return
    
    try {
      // Fetch user stats from bookings API
      const response = await fetch('/api/user/bookings')
      if (response.ok) {
        const data = await response.json()
        const stats = data.stats
        
        // Calculate membership level based on total bookings
        let membershipLevel = "Bronze"
        if (stats.total >= 20) {
          membershipLevel = "Platinum"
        } else if (stats.total >= 10) {
          membershipLevel = "Gold"
        } else if (stats.total >= 5) {
          membershipLevel = "Silver"
        }
        
        setUserStats({
          totalBookings: stats.total || 0,
          totalSpent: stats.totalSpent || 0,
          membershipLevel,
          averageRating: 4.5, // You can calculate this from reviews API
        })
        
        // Generate recent activity from bookings
        const bookings = data.data || []
        const activities: RecentActivity[] = bookings
          .slice(0, 3)
          .map((booking: any, index: number) => ({
            id: booking.id,
            type: 'booking',
            title: `Booking ${booking.status === 'confirmed' ? 'Confirmed' : booking.status}`,
            description: `${booking.propertyName} - ${booking.checkIn}`,
            date: getRelativeTime(new Date(booking.bookingDate || Date.now()))
          }))
        
        setRecentActivity(activities)
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Helper function to format relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return '1 day ago'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }

  // Fetch user data when user is loaded
  useEffect(() => {
    if (user) {
      fetchUserData()
    } else {
      setLoading(false)
    }
  }, [user, fetchUserData])

  // Update form data when user loads
  useEffect(() => {
    if (isLoaded && user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phoneNumbers?.[0]?.phoneNumber || "",
      })
    }
  }, [isLoaded, user])

  const handleSave = async () => {
    if (!user) return
    
    try {
      await user.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
      })
      
      // Update phone number if changed
      if (formData.phone && formData.phone !== user.phoneNumbers?.[0]?.phoneNumber) {
        try {
          await user.createPhoneNumber({ phoneNumber: formData.phone })
        } catch (error) {
          console.log("Phone number update failed:", error)
        }
      }
      
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phoneNumbers?.[0]?.phoneNumber || "",
      })
    }
    setIsEditing(false)
  }

  // Show loading skeleton while user data is loading
  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center space-y-4">
                <Skeleton className="w-24 h-24 rounded-full" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show message if user is not found
  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please sign in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>
            Manage your account information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {user.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={user.fullName || "Profile"}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress.charAt(0)}
                    </span>
                  </div>
                )}
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                  onClick={() => {
                    // Handle profile image update
                    console.log("Update profile image")
                  }}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {loading ? "Loading..." : userStats.membershipLevel} Member
                </Badge>
              </div>
            </div>

            {/* Profile Information */}
            <div className="flex-1 space-y-4">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">First Name</label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Last Name</label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email</label>
                      <Input
                        type="email"
                        value={user.emailAddresses[0]?.emailAddress || ""}
                        disabled
                        className="opacity-50"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Email cannot be changed here. Use account settings.
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Phone</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSave}>Save Changes</Button>
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user.emailAddresses[0]?.emailAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">
                          {user.phoneNumbers?.[0]?.phoneNumber || "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">Mumbai, Maharashtra</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Member Since</p>
                        <p className="font-medium">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long'
                          }) : "January 2024"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            {loading ? (
              <Skeleton className="h-8 w-16 mx-auto mb-2" />
            ) : (
              <div className="text-2xl font-bold text-primary">{userStats.totalBookings}</div>
            )}
            <p className="text-muted-foreground">Total Bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            {loading ? (
              <Skeleton className="h-8 w-20 mx-auto mb-2" />
            ) : (
              <div className="text-2xl font-bold text-primary">₹{userStats.totalSpent.toLocaleString()}</div>
            )}
            <p className="text-muted-foreground">Total Spent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            {loading ? (
              <Skeleton className="h-8 w-12 mx-auto mb-2" />
            ) : (
              <div className="text-2xl font-bold text-primary">{userStats.averageRating.toFixed(1)}</div>
            )}
            <p className="text-muted-foreground">Average Rating Given</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <>                
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </>
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.date}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No recent activity</p>
                <p className="text-sm text-muted-foreground mt-1">Your booking activity will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
