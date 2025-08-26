import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
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

    // Get user statistics from bookings
    const userStats = await Booking.aggregate([
      {
        $group: {
          _id: '$userId',
          totalBookings: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          lastBooking: { $max: '$createdAt' }
        }
      },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          totalBookings: { $sum: '$totalBookings' },
          totalRevenue: { $sum: '$totalSpent' }
        }
      }
    ])

    // Get recent bookings with user info
    const recentUsers = await Booking.aggregate([
      {
        $group: {
          _id: '$userId',
          name: { $first: '$guestName' },
          email: { $first: '$guestEmail' },
          totalBookings: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          lastActive: { $max: '$createdAt' },
          joinedDate: { $min: '$createdAt' }
        }
      },
      { $sort: { lastActive: -1 } },
      { $limit: 50 },
      {
        $project: {
          id: '$_id',
          name: 1,
          email: 1,
          role: { $literal: 'user' },
          status: { $literal: 'active' },
          totalBookings: 1,
          totalSpent: 1,
          lastActive: { $dateToString: { format: '%Y-%m-%d', date: '$lastActive' } },
          joinedDate: { $dateToString: { format: '%Y-%m-%d', date: '$joinedDate' } },
          avatar: { $literal: null }
        }
      }
    ])

    const stats = {
      total: userStats[0]?.totalUsers || 0,
      active: userStats[0]?.totalUsers || 0,
      suspended: 0,
      pending: 0,
      users: userStats[0]?.totalUsers || 0,
      partners: 0,
      admins: 1
    }

    return NextResponse.json({
      data: recentUsers,
      stats,
      message: 'Users fetched successfully',
      success: true
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch users', success: false },
      { status: 500 }
    )
  }
}