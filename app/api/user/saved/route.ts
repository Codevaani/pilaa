import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import { IProperty } from '@/models/Property';

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
    
    // For now, return empty array - implement saved properties logic later
    const savedProperties: IProperty[] = []

    return NextResponse.json({
      data: savedProperties,
      message: 'Saved properties fetched successfully',
      success: true
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch saved properties', success: false },
      { status: 500 }
    )
  }
}