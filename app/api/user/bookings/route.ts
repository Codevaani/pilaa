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
    
    const bookings = await Booking.find({ userId })
      .populate('propertyId')
      .populate('roomId')
      .sort({ createdAt: -1 })

    const stats = {
      total: bookings.length,
      upcoming: bookings.filter(b => b.status === 'upcoming' || b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      totalSpent: bookings.reduce((sum, b) => sum + b.totalAmount, 0)
    }

    return NextResponse.json({
      data: bookings,
      stats,
      message: 'Bookings fetched successfully',
      success: true
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch bookings', success: false },
      { status: 500 }
    )
  }
}