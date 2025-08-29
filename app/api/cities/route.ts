import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Property from '@/models/Property'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.toLowerCase()
    
    await dbConnect()
    
    // Popular Indian cities for hotel bookings
    const popularCities = [
      { name: 'Mumbai', state: 'Maharashtra', country: 'India' },
      { name: 'Delhi', state: 'Delhi', country: 'India' },
      { name: 'Bangalore', state: 'Karnataka', country: 'India' },
      { name: 'Hyderabad', state: 'Telangana', country: 'India' },
      { name: 'Chennai', state: 'Tamil Nadu', country: 'India' },
      { name: 'Kolkata', state: 'West Bengal', country: 'India' },
      { name: 'Pune', state: 'Maharashtra', country: 'India' },
      { name: 'Ahmedabad', state: 'Gujarat', country: 'India' },
      { name: 'Jaipur', state: 'Rajasthan', country: 'India' },
      { name: 'Surat', state: 'Gujarat', country: 'India' },
      { name: 'Lucknow', state: 'Uttar Pradesh', country: 'India' },
      { name: 'Kanpur', state: 'Uttar Pradesh', country: 'India' },
      { name: 'Nagpur', state: 'Maharashtra', country: 'India' },
      { name: 'Indore', state: 'Madhya Pradesh', country: 'India' },
      { name: 'Thane', state: 'Maharashtra', country: 'India' },
      { name: 'Bhopal', state: 'Madhya Pradesh', country: 'India' },
      { name: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India' },
      { name: 'Pimpri-Chinchwad', state: 'Maharashtra', country: 'India' },
      { name: 'Patna', state: 'Bihar', country: 'India' },
      { name: 'Vadodara', state: 'Gujarat', country: 'India' },
      { name: 'Goa', state: 'Goa', country: 'India' },
      { name: 'Shimla', state: 'Himachal Pradesh', country: 'India' },
      { name: 'Manali', state: 'Himachal Pradesh', country: 'India' },
      { name: 'Udaipur', state: 'Rajasthan', country: 'India' },
      { name: 'Agra', state: 'Uttar Pradesh', country: 'India' },
      { name: 'Varanasi', state: 'Uttar Pradesh', country: 'India' },
      { name: 'Rishikesh', state: 'Uttarakhand', country: 'India' },
      { name: 'Haridwar', state: 'Uttarakhand', country: 'India' },
      { name: 'Mysore', state: 'Karnataka', country: 'India' },
      { name: 'Coimbatore', state: 'Tamil Nadu', country: 'India' }
    ]
    
    // Get cities from database if they exist
    const dbCities = await Property.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$address.city',
          city: { $first: '$address.city' },
          state: { $first: '$address.state' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ])
    
    // Combine and deduplicate cities
    const allCities = [...dbCities.map(d => ({ 
      name: d.city, 
      state: d.state, 
      country: 'India',
      count: d.count 
    })), ...popularCities]
    
    // Remove duplicates
    const uniqueCities = allCities.reduce((acc, city) => {
      if (!acc.find(c => c.name === city.name)) {
        acc.push(city)
      }
      return acc
    }, [] as any[])
    
    // Filter based on query if provided
    let filteredCities = uniqueCities
    if (query) {
      filteredCities = uniqueCities.filter(city => 
        city.name.toLowerCase().includes(query) ||
        city.state.toLowerCase().includes(query)
      )
    }
    
    // Limit to 10 results
    const limitedCities = filteredCities.slice(0, 10)
    
    return NextResponse.json({
      data: limitedCities,
      message: 'Cities fetched successfully',
      success: true
    })
  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json(
      { message: 'Failed to fetch cities', success: false },
      { status: 500 }
    )
  }
}
