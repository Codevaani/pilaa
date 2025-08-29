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
    
    const existingApplication = await PartnerApplication.findOne({ userId })
    
    return NextResponse.json({
      hasApplication: !!existingApplication,
      status: existingApplication?.status || null,
      success: true
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to check application', success: false },
      { status: 500 }
    )
  }
}