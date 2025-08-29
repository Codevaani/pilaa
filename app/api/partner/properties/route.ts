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
    
    const properties = await Property.find({ partnerId: userId })
      .sort({ createdAt: -1 })
    
    // Transform properties to include additional fields for frontend
    const transformedProperties = properties.map(property => ({
      id: property._id.toString(),
      name: property.name,
      slug: property.name.toLowerCase().replace(/\s+/g, '-'),
      location: `${property.address?.city || ''}, ${property.address?.state || ''}`,
      type: property.propertyType || 'hotel',
      images: property.images && property.images.length > 0 
        ? property.images 
        : ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop'],
      status: property.status,
      rating: property.rating || 0,
      reviewCount: 0,
      totalRooms: property.rooms?.length || 0,
      availableRooms: property.rooms?.length || 0,
      occupancyRate: 0,
      averagePrice: property.priceRange?.min || 0,
      totalBookings: 0,
      monthlyRevenue: 0,
      yearlyRevenue: 0,
      createdDate: property.createdAt?.toISOString().split('T')[0] || '',
      lastUpdated: property.updatedAt?.toISOString().split('T')[0] || '',
      amenities: property.amenities || [],
      description: property.description || ''
    }))

    return NextResponse.json({
      data: transformedProperties,
      message: 'Partner properties fetched successfully',
      success: true
    })
  } catch (error) {
    console.error('Error fetching partner properties:', error)
    return NextResponse.json(
      { message: 'Failed to fetch properties', success: false },
      { status: 500 }
    )
  }
}