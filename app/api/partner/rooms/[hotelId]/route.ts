import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Property from '@/models/Property'
import Room from '@/models/Room'

export async function GET(
  request: Request,
  { params }: { params: { hotelId: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized', success: false },
        { status: 401 }
      )
    }

    const { hotelId } = params

    if (!hotelId) {
      return NextResponse.json(
        { message: 'Hotel ID is required', success: false },
        { status: 400 }
      )
    }

    await dbConnect()
    
    // Verify that the hotel belongs to the partner
    const property = await Property.findOne({ _id: hotelId, partnerId: userId })
    if (!property) {
      return NextResponse.json(
        { message: 'Hotel not found or access denied', success: false },
        { status: 404 }
      )
    }

    // Get all rooms for this property
    const rooms = await Room.find({ propertyId: hotelId })
    
    // Transform rooms data
    const transformedRooms = rooms.map(room => {
      // Mock room status and guest data - in production, get from bookings
      const statuses = ['available', 'occupied', 'maintenance', 'cleaning']
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      
      let currentGuest = null
      if (randomStatus === 'occupied') {
        currentGuest = {
          name: `Guest ${Math.floor(Math.random() * 1000)}`,
          checkIn: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          checkOut: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toLocaleDateString()
        }
      }

      return {
        id: room._id.toString(),
        roomNumber: `${Math.floor(Math.random() * 500) + 100}`, // Mock room number
        type: room.type,
        status: randomStatus,
        price: room.price,
        capacity: room.capacity?.adults || 2,
        amenities: room.amenities || ['wifi', 'tv', 'bathroom'],
        description: room.description || `A comfortable ${room.type} with modern amenities.`,
        images: room.images || [],
        currentGuest,
        lastCleaned: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        size: Math.floor(Math.random() * 300) + 200, // Mock size in sq ft
        bedType: ['Single', 'Double', 'Queen', 'King'][Math.floor(Math.random() * 4)],
        view: ['City', 'Ocean', 'Garden', 'Pool'][Math.floor(Math.random() * 4)]
      }
    })

    // Calculate room statistics
    const totalRooms = transformedRooms.length
    const availableRooms = transformedRooms.filter(r => r.status === 'available').length
    const occupiedRooms = transformedRooms.filter(r => r.status === 'occupied').length
    const averagePrice = totalRooms > 0 
      ? Math.round(transformedRooms.reduce((sum, room) => sum + room.price, 0) / totalRooms)
      : 0

    // Hotel data
    const hotel = {
      id: property._id.toString(),
      name: property.name,
      location: property.location,
      type: property.type,
      status: property.status,
      totalRooms,
      availableRooms,
      occupiedRooms,
      averagePrice
    }

    return NextResponse.json({
      data: {
        hotel,
        rooms: transformedRooms
      },
      message: 'Hotel rooms fetched successfully',
      success: true
    })
  } catch (error) {
    console.error('Error fetching hotel rooms:', error)
    return NextResponse.json(
      { message: 'Failed to fetch hotel rooms', success: false },
      { status: 500 }
    )
  }
}
