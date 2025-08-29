import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Property from '@/models/Property'

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
    console.log('Received form data:', body)
    
    // Validate required fields
    if (!body.name || !body.description || !body.city || !body.state) {
      return NextResponse.json(
        { message: 'Name, description, city, and state are required', success: false },
        { status: 400 }
      )
    }
    
    await dbConnect()
    
    // Create property object
    const propertyData = {
      name: body.name,
      slug: body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: body.description,
      propertyType: body.propertyType,
      address: {
        street: body.address,
        city: body.city,
        state: body.state,
        country: body.country,
        zipCode: body.zipCode
      },
      partnerId: userId,
      amenities: body.amenities,
      images: body.images && body.images.length > 0 
        ? body.images 
        : ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop'],
      priceRange: {
        min: (body.rooms && body.rooms.length > 0) ? body.rooms[0].price : 0,
        max: (body.rooms && body.rooms.length > 0) ? body.rooms[0].price : 0
      },
      status: 'active',
      rating: 0,
      reviewCount: 0
    }
    
    const property = new Property(propertyData)
    await property.save()

    return NextResponse.json({
      message: 'Property created successfully',
      success: true,
      data: property
    })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { message: 'Failed to create property', success: false },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const rating = searchParams.get('rating')
    
    interface Query {
      status: string;
      'address.city'?: { $regex: string; $options: string };
      'priceRange.min'?: { $gte?: number; $lte?: number };
      rating?: { $gte?: number };
      [key: string]: string | number | object | undefined;
    }

    const query: Query = { status: 'active' }
    
    if (city) {
      query['address.city'] = { $regex: city, $options: 'i' }
    }
    
    if (minPrice || maxPrice) {
      query['priceRange.min'] = {}
      if (minPrice) query['priceRange.min'].$gte = parseInt(minPrice)
      if (maxPrice) query['priceRange.min'].$lte = parseInt(maxPrice)
    }
    
    if (rating) {
      query.rating = { $gte: parseFloat(rating) }
    }
    
    const properties = await Property.find(query)
      .limit(limit)
      .sort({ createdAt: -1 })
    
    const total = await Property.countDocuments(query)
    
    return NextResponse.json({
      data: properties,
      pagination: {
        total,
        limit,
        page: 1
      },
      success: true
    })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { message: 'Failed to fetch properties', success: false },
      { status: 500 }
    )
  }
}