import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Booking from '@/models/Booking'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Please sign in to make a booking', success: false },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { propertyId, roomId, checkIn, checkOut, guests, totalAmount } = body
    
    if (!propertyId || !checkIn || !checkOut) {
      return NextResponse.json(
        { message: 'Missing required booking information', success: false },
        { status: 400 }
      )
    }
    
    await dbConnect()
    
    const bookingData = {
      userId,
      propertyId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests,
      totalAmount,
      status: 'confirmed',
      confirmationNumber: `BK${Date.now()}`
    }
    
    // Add roomId only if it exists
    if (roomId) {
      bookingData.roomId = roomId
    }
    
    const booking = new Booking(bookingData)
    await booking.save()

    return NextResponse.json({
      message: 'Booking created successfully',
      success: true,
      data: booking
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { message: 'Failed to create booking', success: false },
      { status: 500 }
    )
  }
}