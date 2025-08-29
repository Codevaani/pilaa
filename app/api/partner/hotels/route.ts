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
    
    // Transform properties for hotel selection
    const hotels = properties.map(property => ({
      id: property._id.toString(),
      name: property.name,
      propertyType: property.propertyType || 'hotel',
      city: property.address?.city || '',
      state: property.address?.state || '',
      imageUrl: property.images?.[0] || null,
      description: property.description || ''
    }))

    return NextResponse.json({
      hotels,
      message: 'Hotels fetched successfully',
      success: true
    })
  } catch (error) {
    console.error('Error fetching hotels:', error)
    return NextResponse.json(
      { message: 'Failed to fetch hotels', success: false },
      { status: 500 }
    )
  }
}
