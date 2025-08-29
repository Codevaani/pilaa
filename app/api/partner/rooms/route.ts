import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Property from '@/models/Property'
import Room from '@/models/Room'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized', success: false },
        { status: 401 }
      )
    }

    await dbConnect()
    
    // Get all properties (hotels) for this partner
    const properties = await Property.find({ partnerId: userId })
    
    // Transform properties into hotel format with room statistics
    const hotels = await Promise.all(properties.map(async property => {
      // Get actual rooms for this property
      const rooms = await Room.find({ propertyId: property._id })
      const totalRooms = rooms.length
      
      // Mock occupancy data - in production, you'd get this from bookings
      const occupiedRooms = Math.floor(totalRooms * (Math.random() * 0.7 + 0.1)) // 10-80% occupancy
      const availableRooms = Math.max(0, totalRooms - occupiedRooms)
      
      return {
        id: property._id.toString(),
        name: property.name,
        location: property.location,
        type: property.type,
        status: property.status,
        totalRooms,
        availableRooms,
        occupiedRooms,
        averagePrice: property.priceRange?.min || property.pricePerNight || Math.floor(Math.random() * 5000) + 1000,
        amenities: property.amenities || ['wifi', 'parking', 'restaurant'],
        images: property.images || [],
        slug: property.slug || property.name.toLowerCase().replace(/\s+/g, '-')
      }
    }))
    
    // Calculate overall stats
    const stats = {
      totalHotels: hotels.length,
      totalRooms: hotels.reduce((sum, hotel) => sum + hotel.totalRooms, 0),
      availableRooms: hotels.reduce((sum, hotel) => sum + hotel.availableRooms, 0),
      occupiedRooms: hotels.reduce((sum, hotel) => sum + hotel.occupiedRooms, 0)
    }

    return NextResponse.json({
      hotels,
      stats,
      message: 'Hotels and rooms data fetched successfully',
      success: true
    })
  } catch (error) {
    console.error('Error fetching hotels and rooms:', error)
    return NextResponse.json(
      { message: 'Failed to fetch hotels and rooms data', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized', success: false },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { hotelId, rooms } = body
    
    if (!hotelId || !rooms || !Array.isArray(rooms) || rooms.length === 0) {
      return NextResponse.json(
        { message: 'Hotel ID and rooms array are required', success: false },
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

    // Create room objects
    const roomsToCreate = rooms.map(room => ({
      propertyId: hotelId,
      name: room.name,
      description: room.description || '',
      type: room.type,
      capacity: {
        adults: room.capacity?.adults || 2,
        children: room.capacity?.children || 0
      },
      price: room.price,
      totalRooms: room.totalRooms || 1,
      availableRooms: room.totalRooms || 1,
      availability: true,
      images: [], // Will be added later when image upload is implemented
      amenities: room.amenities || []
    }))

    // Insert all rooms
    const createdRooms = await Room.insertMany(roomsToCreate)

    // Update property price range
    const allPropertyRooms = await Room.find({ propertyId: hotelId })
    const prices = allPropertyRooms.map(room => room.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

    await Property.findByIdAndUpdate(hotelId, {
      'priceRange.min': minPrice,
      'priceRange.max': maxPrice
    })

    return NextResponse.json({
      message: 'Rooms added successfully',
      success: true,
      data: createdRooms
    })
  } catch (error) {
    console.error('Error adding rooms:', error)
    return NextResponse.json(
      { message: 'Failed to add rooms', success: false },
      { status: 500 }
    )
  }
}
