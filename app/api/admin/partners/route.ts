import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import PartnerApplication from '@/models/PartnerApplication'

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
    
    const approvedPartners = await PartnerApplication.find({ status: 'approved' })
      .sort({ updatedAt: -1 })

    const partners = approvedPartners.map(partner => ({
      id: partner._id.toString(),
      applicantName: partner.applicantName,
      businessName: partner.businessName,
      email: partner.email,
      phone: partner.phone,
      location: partner.location,
      propertyType: partner.propertyType,
      approvedDate: partner.updatedAt.toISOString().split('T')[0]
    }))

    return NextResponse.json({
      data: partners,
      message: 'Partners fetched successfully',
      success: true
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch partners', success: false },
      { status: 500 }
    )
  }
}