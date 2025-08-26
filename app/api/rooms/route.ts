import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Room from '@/models/Room'

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
    
    const roomData = {
      ...body,
      partnerId: userId,
      status: 'active' // Direct active status for partners
    }
    
    const room = new Room(roomData)
    await room.save()

    return NextResponse.json({
      message: 'Room added successfully',
      success: true,
      data: room
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to add room', success: false },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized', success: false },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('id')
    
    if (!roomId) {
      return NextResponse.json(
        { message: 'Room ID required', success: false },
        { status: 400 }
      )
    }

    await dbConnect()
    
    const room = await Room.findOneAndDelete({ 
      _id: roomId, 
      partnerId: userId 
    })

    if (!room) {
      return NextResponse.json(
        { message: 'Room not found or unauthorized', success: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Room removed successfully',
      success: true
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to remove room', success: false },
      { status: 500 }
    )
  }
}