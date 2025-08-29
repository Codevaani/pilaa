import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import BookingTemp from '@/models/BookingTemp'

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
    
    const bookings = await BookingTemp.find({ userId })
      .populate('propertyId')
      .populate('roomId')
      .sort({ createdAt: -1 })
    
    // Transform bookings to ensure all fields are present
    const transformedBookings = bookings.map(booking => ({
      id: booking._id.toString(),
      propertyImage: booking.propertyImage || '/placeholder-hotel.jpg',
      propertyName: booking.propertyId?.name || booking.propertyName || 'Unknown Property',
      location: booking.propertyId?.location || booking.location || 'Unknown Location',
      confirmationNumber: booking.confirmationNumber || booking._id.toString().slice(-8),
      checkIn: booking.checkIn.toISOString().split('T')[0],
      checkOut: booking.checkOut.toISOString().split('T')[0],
      guests: {
        adults: booking.guests?.adults || 1,
        children: booking.guests?.children || 0
      },
      roomType: booking.roomId?.type || booking.roomType || 'Standard Room',
      totalAmount: booking.totalAmount,
      status: booking.status,
      rating: booking.rating
    }))

    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      upcoming: bookings.filter(b => b.status === 'upcoming' || b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      totalSpent: bookings.reduce((sum, b) => sum + b.totalAmount, 0)
    }

    return NextResponse.json({
      data: transformedBookings,
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