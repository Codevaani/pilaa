import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { currentUser } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import BookingTemp from '@/models/BookingTemp'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Please sign in to make a booking', success: false },
        { status: 401 }
      )
    }

    // Get user information from Clerk
    const user = await currentUser()
    if (!user) {
      return NextResponse.json(
        { message: 'User information not found', success: false },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { propertyId, roomId, checkIn, checkOut, guests, totalAmount, propertyName, roomType, location, propertyImage } = body
    
    if (!propertyId || !checkIn || !checkOut) {
      return NextResponse.json(
        { message: 'Missing required booking information', success: false },
        { status: 400 }
      )
    }
    
    await dbConnect()
    
    // Get guest information from user data
    const guestName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Guest User'
    const guestEmail = user.emailAddresses[0]?.emailAddress || ''
    const guestPhone = user.phoneNumbers[0]?.phoneNumber || ''

    // Calculate nights
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))

    interface BookingData {
      userId: string;
      propertyId: string;
      roomId?: string;
      checkIn: Date;
      checkOut: Date;
      guests: { adults: number; children: number };
      totalAmount: number;
      status: string;
      confirmationNumber: string;
      guestName: string;
      guestEmail: string;
      guestPhone?: string;
      nights: number;
      propertyName?: string;
      roomType?: string;
      location?: string;
      propertyImage?: string;
    }

    // Ensure status is one of the valid enum values
    const validStatus = 'pending' as const
    
    const bookingData: BookingData = {
      userId,
      propertyId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: {
        adults: guests?.adults || 2,
        children: guests?.children || 0
      },
      totalAmount,
      status: validStatus,
      confirmationNumber: `BK${Date.now()}`,
      guestName,
      guestEmail,
      nights
    }
    
    // Add optional fields only if they have values
    if (guestPhone) {
      bookingData.guestPhone = guestPhone
    }
    if (propertyName) {
      bookingData.propertyName = propertyName
    }
    if (roomType) {
      bookingData.roomType = roomType
    }
    if (location) {
      bookingData.location = location
    }
    if (propertyImage) {
      bookingData.propertyImage = propertyImage
    }
    
    // Add roomId only if it exists
    if (roomId) {
      bookingData.roomId = roomId
    }
    
    console.log('Creating booking with data:', JSON.stringify(bookingData, null, 2))
    console.log('Property ID being saved:', bookingData.propertyId)
    
    const booking = new BookingTemp(bookingData)
    
    // Validate the booking before saving
    const validationError = booking.validateSync()
    if (validationError) {
      console.error('Validation error:', validationError)
      return NextResponse.json(
        { 
          message: 'Booking validation failed', 
          success: false,
          errors: validationError.errors
        },
        { status: 400 }
      )
    }
    
    await booking.save()

    return NextResponse.json({
      message: 'Booking created successfully',
      success: true,
      data: booking
    })
  } catch (error: any) {
    console.error('Error creating booking:', error)
    console.error('Error message:', error.message)
    console.error('Error details:', error.errors)
    
    let errorMessage = 'Failed to create booking'
    if (error.name === 'ValidationError') {
      errorMessage = 'Booking validation failed: ' + Object.values(error.errors).map((err: any) => err.message).join(', ')
    }
    
    return NextResponse.json(
      { 
        message: errorMessage, 
        success: false,
        details: error.message
      },
      { status: 500 }
    )
  }
}