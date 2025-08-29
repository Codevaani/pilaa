import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import BookingTemp from '@/models/BookingTemp'
import Property from '@/models/Property'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized', success: false },
        { status: 401 }
      )
    }

    const { action } = await request.json()
    const bookingId = params.id

    // Map actions to status
    const statusMap: Record<string, string> = {
      confirm: 'confirmed',
      reject: 'cancelled',
      complete: 'completed'
    }

    const newStatus = statusMap[action]
    if (!newStatus) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    await dbConnect()

    // Find the booking and verify it belongs to the partner's property
    const booking = await BookingTemp.findById(bookingId)
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Verify that the booking belongs to a property owned by this partner
    const property = await Property.findOne({ _id: booking.propertyId, partnerId: userId })
    if (!property) {
      return NextResponse.json({ error: 'Unauthorized to update this booking' }, { status: 403 })
    }

    // Update the booking status
    booking.status = newStatus
    await booking.save()

    return NextResponse.json({ 
      success: true, 
      bookingId, 
      newStatus,
      message: 'Booking status updated successfully'
    })

  } catch (error) {
    console.error('Error updating booking status:', error)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}
