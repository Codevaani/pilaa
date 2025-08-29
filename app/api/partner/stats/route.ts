import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Property from '@/models/Property'
import BookingTemp from '@/models/BookingTemp'

export async function GET() {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized', success: false },
        { status: 401 }
      )
    }

    await dbConnect()
    
    const partnerProperties = await Property.find({ partnerId: userId })
    const propertyIds = partnerProperties.map(p => p._id)
    
    const [totalBookings, totalRevenue] = await Promise.all([
      BookingTemp.countDocuments({ propertyId: { $in: propertyIds.map(id => id.toString()) } }),
      BookingTemp.aggregate([
        { $match: { propertyId: { $in: propertyIds.map(id => id.toString()) } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ])

    const stats = {
      totalProperties: partnerProperties.length,
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      occupancyRate: 0, // Would need room availability calculation
      averageRating: partnerProperties.reduce((sum, p) => sum + p.rating, 0) / partnerProperties.length || 0,
      thisMonthBookings: 0 // Would need date filtering
    }

    return NextResponse.json({
      data: stats,
      message: 'Partner stats fetched successfully',
      success: true
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch partner stats', success: false },
      { status: 500 }
    )
  }
}