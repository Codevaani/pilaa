import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Property from '@/models/Property'

export async function GET() {
  try {
    await dbConnect()
    
    const destinations = await Property.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$address.city',
          city: { $first: '$address.city' },
          count: { $sum: 1 },
          image: { $first: { $arrayElemAt: ['$images', 0] } }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 4 }
    ])

    return NextResponse.json({
      data: destinations,
      message: 'Destinations fetched successfully',
      success: true
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch destinations', success: false },
      { status: 500 }
    )
  }
}