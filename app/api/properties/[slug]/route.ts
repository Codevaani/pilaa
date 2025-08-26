import { NextRequest, NextResponse } from 'next/server'
import { sanitizeHtml } from '@/lib/security'
import dbConnect from '@/lib/mongodb'
import Property, { IProperty } from '@/models/Property'
import Room, { IRoom } from '@/models/Room'
import type { ApiResponse, Review } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect()

    const { slug } = await params
    const sanitizedSlug = sanitizeHtml(slug)

    const property: IProperty | null = await Property.findOne({ slug: sanitizedSlug, status: 'active' })
    
    if (!property) {
      return NextResponse.json(
        { message: 'Property not found', success: false },
        { status: 404 }
      )
    }

    const rooms: IRoom[] = await Room.find({ propertyId: property._id })

    const response: ApiResponse<{
      property: IProperty
      rooms: IRoom[]
      reviews: Review[]
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
