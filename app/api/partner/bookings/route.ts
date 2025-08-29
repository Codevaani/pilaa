import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Property from '@/models/Property'
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
    
    // Get partner properties
    const partnerProperties = await Property.find({ partnerId: userId })
    const propertyIds = partnerProperties.map(p => p._id.toString())
    
    console.log('Partner User ID:', userId)
    console.log('Partner properties:', partnerProperties.length)
    console.log('Property IDs:', propertyIds)
    console.log('Partner properties details:', partnerProperties.map(p => ({ id: p._id.toString(), name: p.name, partnerId: p.partnerId })))
    
    // Find bookings for these properties
    const bookings = await BookingTemp.find({ propertyId: { $in: propertyIds } })
      .sort({ createdAt: -1 })
      .limit(50)
    
    console.log('Found bookings:', bookings.length)
    
    // Transform bookings for frontend
    const transformedBookings = bookings.map(booking => ({
      id: booking._id.toString(),
      _id: booking._id.toString(),
      bookingId: booking.confirmationNumber || booking._id.toString(),
      guestName: booking.guestName || 'Unknown Guest',
      propertyName: booking.propertyId?.name || booking.propertyName || 'Unknown Property',
      property: booking.propertyId?.name || booking.propertyName || 'Unknown Property',
      checkIn: booking.checkIn.toISOString().split('T')[0],
      checkOut: booking.checkOut.toISOString().split('T')[0],
      guests: {
        adults: booking.guests?.adults || 1,
        children: booking.guests?.children || 0
      },
      nights: Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24)),
      amount: booking.totalAmount,
      totalAmount: booking.totalAmount,
      status: booking.status,
      guestEmail: booking.guestEmail || '',
      guestPhone: booking.guestPhone || '',
      specialRequests: booking.specialRequests || '',
      bookingDate: booking.createdAt.toISOString().split('T')[0],
      commission: booking.commission || 0
    }))

    return NextResponse.json({
      data: transformedBookings,
      message: 'Partner bookings fetched successfully',
      success: true
    })
  } catch (error) {
    console.error('Error fetching partner bookings:', error)
    return NextResponse.json(
      { message: 'Failed to fetch bookings', success: false, error: error.message },
      { status: 500 }
    )
  }
}