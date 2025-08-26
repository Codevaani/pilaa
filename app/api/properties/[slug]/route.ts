import { NextRequest, NextResponse } from 'next/server'
import { sanitizeHtml } from '@/lib/security'
import dbConnect from '@/lib/mongodb'
import Property from '@/models/Property'
import Room from '@/models/Room'
import type { ApiResponse } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect()

    const { slug } = await params
    const sanitizedSlug = sanitizeHtml(slug)

    const property = await Property.findOne({ slug: sanitizedSlug, status: 'active' })
    
    if (!property) {
      return NextResponse.json(
        { message: 'Property not found', success: false },
        { status: 404 }
      )
    }

    const rooms = await Room.find({ propertyId: property._id })

    const response: ApiResponse<{
      property: any
      rooms: any[]
      reviews: any[]
    }> = {
      data: {
        property,
        rooms,
        reviews: [], // Reviews will be implemented later
      },
      message: 'Property details fetched successfully',
      success: true,
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch property details', success: false },
      { status: 500 }
    )
  }
}
