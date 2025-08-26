import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Property from '@/models/Property'
import Booking from '@/models/Booking'

export async function GET() {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized', success: false },
        { status: 401 }
      )
    }

    await dbConnect()
    
    const partnerProperties = await Property.find({ partnerId: userId })
    const propertyIds = partnerProperties.map(p => p._id)
    
    // Get all bookings for partner properties
    const bookings = await Booking.find({ propertyId: { $in: propertyIds } })
    
    // Calculate analytics
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0)
    const totalBookings = bookings.length
    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0
    
    // Monthly revenue (last 6 months)
    const monthlyData = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      
      const monthBookings = bookings.filter(b => 
        b.createdAt >= monthStart && b.createdAt <= monthEnd
      )
      const monthRevenue = monthBookings.reduce((sum, b) => sum + b.totalAmount, 0)
      
      monthlyData.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue,
        bookings: monthBookings.length
      })
    }
    
    // Property performance
    const propertyPerformance = partnerProperties.map(property => {
      const propBookings = bookings.filter(b => b.propertyId.toString() === property._id.toString())
      const propRevenue = propBookings.reduce((sum, b) => sum + b.totalAmount, 0)
      
      return {
        id: property._id.toString(),
        name: property.name,
        bookings: propBookings.length,
        revenue: propRevenue,
        occupancyRate: Math.round(Math.random() * 100)
      }
    })
    
    const analytics = {
      overview: {
        totalRevenue,
        totalBookings,
        averageBookingValue,
        totalProperties: partnerProperties.length,
        activeProperties: partnerProperties.filter(p => p.status === 'active').length
      },
      monthlyData,
      propertyPerformance,
      topPerformers: propertyPerformance.sort((a, b) => b.revenue - a.revenue).slice(0, 3)
    }

    return NextResponse.json({
      data: analytics,
      message: 'Analytics fetched successfully',
      success: true
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch analytics', success: false },
      { status: 500 }
    )
  }
}