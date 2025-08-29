import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Property from '@/models/Property'

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
    
    const properties = await Property.find({}).sort({ createdAt: -1 })
    
    // Transform properties for admin panel
    const transformedProperties = properties.map(property => ({
      id: property._id.toString(),
      name: property.name,
      location: `${property.address?.city || ''}, ${property.address?.state || ''}`,
      type: property.propertyType || 'hotel',
      status: property.status,
      partner: property.partnerId || 'Unknown Partner',
      rooms: 0, // Would calculate from rooms collection
      bookings: 0, // Would calculate from bookings
      revenue: 0, // Would calculate from bookings
      rating: property.rating || 0,
      reviews: property.reviewCount || 0,
      createdDate: property.createdAt?.toISOString().split('T')[0] || '',
      image: property.images?.[0] || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop'
    }))

    const stats = {
      total: properties.length,
      active: properties.filter(p => p.status === 'active').length,
      pending: properties.filter(p => p.status === 'pending').length,
      suspended: properties.filter(p => p.status === 'suspended').length,
      hotels: properties.filter(p => p.propertyType === 'hotel').length,
      resorts: properties.filter(p => p.propertyType === 'resort').length,
      villas: properties.filter(p => p.propertyType === 'villa').length,
    }

    return NextResponse.json({
      data: transformedProperties,
      stats,
      message: 'Properties fetched successfully',
      success: true
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch properties', success: false },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized', success: false },
        { status: 401 }
      )
    }

    const { id, action } = await request.json()

    if (!id || !action) {
      return NextResponse.json(
        { message: 'ID and action are required', success: false },
        { status: 400 }
      )
    }

    await dbConnect()
    
    let status
    switch (action) {
      case 'approve':
        status = 'active'
        break
      case 'suspend':
        status = 'suspended'
        break
      case 'activate':
        status = 'active'
        break
      default:
        return NextResponse.json(
          { message: 'Invalid action', success: false },
          { status: 400 }
        )
    }

    const property = await Property.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )

    if (!property) {
      return NextResponse.json(
        { message: 'Property not found', success: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: `Property ${action}d successfully`,
      success: true
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update property', success: false },
      { status: 500 }
    )
  }
}