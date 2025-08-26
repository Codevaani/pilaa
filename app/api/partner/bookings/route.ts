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
    
    const bookings = await Booking.find({ propertyId: { $in: propertyIds } })
      .sort({ createdAt: -1 })
      .limit(10)
    
    // Transform bookings for frontend
    const transformedBookings = bookings.map(booking => ({
      id: booking._id.toString(),
      guestName: booking.guestName,
      property: booking.propertyId?.toString() || 'Unknown Property',
      checkIn: booking.checkIn.toISOString().split('T')[0],
      checkOut: booking.checkOut.toISOString().split('T')[0],
      amount: booking.totalAmount,
      status: booking.status
    }))

    return NextResponse.json({
      data: transformedBookings,
      message: 'Partner bookings fetched successfully',
      success: true
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch bookings', success: false },
      { status: 500 }
    )
  }
}