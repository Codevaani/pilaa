import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import PartnerApplication from '@/models/PartnerApplication'

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
    
    await dbConnect()
    
    const applicationData = {
      applicantName: body.applicantName,
      businessName: body.businessName,
      email: body.email,
      phone: body.phone,
      location: body.location,
      propertyType: body.propertyType,
      documents: body.documents || {},
      userId: userId,
      status: 'pending'
    }
    
    const application = new PartnerApplication(applicationData)
    await application.save()

    return NextResponse.json({
      message: 'Partner application submitted successfully',
      success: true,
      data: application
    })
  } catch (error) {
    console.error('Error creating partner application:', error)
    return NextResponse.json(
      { message: 'Failed to submit application', success: false },
      { status: 500 }
    )
  }
}