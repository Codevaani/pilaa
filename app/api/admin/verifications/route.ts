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
    
    // Get all partner applications for verification
    const applications = await PartnerApplication.find({})
      .sort({ createdAt: -1 })

    // Transform applications to verification format
    const verifications = applications.map(app => ({
      id: app._id.toString(),
      type: 'partner',
      applicantName: app.applicantName,
      businessName: app.businessName,
      email: app.email,
      phone: app.phone,
      location: app.location,
      propertyType: app.propertyType,
      submittedDate: app.createdAt.toISOString().split('T')[0],
      status: app.status,
      documents: app.documents,
      notes: app.notes
    }))

    // Calculate stats
    const stats = {
      total: verifications.length,
      pending: verifications.filter(v => v.status === 'pending').length,
      underReview: verifications.filter(v => v.status === 'under_review').length,
      approved: verifications.filter(v => v.status === 'approved').length,
      rejected: verifications.filter(v => v.status === 'rejected').length
    }

    return NextResponse.json({
      data: verifications,
      stats,
      message: 'Verifications fetched successfully',
      success: true
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch verifications', success: false },
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

    const { id, status, notes } = await request.json()

    if (!id || !status) {
      return NextResponse.json(
        { message: 'ID and status are required', success: false },
        { status: 400 }
      )
    }

    await dbConnect()
    
    const updateData: { status: string; notes?: string } = { status }
    if (notes) {
      updateData.notes = notes
    }

    const application = await PartnerApplication.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )

    if (!application) {
      return NextResponse.json(
        { message: 'Application not found', success: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: `Application ${status} successfully`,
      success: true
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update verification', success: false },
      { status: 500 }
    )
  }
}