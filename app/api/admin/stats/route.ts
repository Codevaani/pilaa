import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import connectDB from '@/lib/mongodb'
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

    await connectDB()
    
    const [totalProperties, totalBookings, pendingProperties] = await Promise.all([
      Property.countDocuments({}),
      Booking.countDocuments({}),
      Property.countDocuments({ status: 'pending' })
    ])

    const revenueResult = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ])
    
    // Get user count from bookings (unique users)
    const uniqueUsers = await Booking.distinct('guestEmail')

    const activePartners = await Property.distinct('partnerId')
    
    const stats = {
      totalUsers: uniqueUsers.length,
      totalProperties,
      totalBookings,
      totalRevenue: revenueResult[0]?.total || 0,
      pendingVerifications: pendingProperties,
      activePartners: activePartners.length
    }

    return NextResponse.json({
      data: stats,
      message: 'Admin stats fetched successfully',
      success: true
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch admin stats', success: false },
      { status: 500 }
    )
  }
}