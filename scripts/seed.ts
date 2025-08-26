import { MongoClient } from 'mongodb'

const uri = 'mongodb://localhost:27017'
const dbName = 'motel'

const sampleProperties = [
  {
    name: 'The Grand Palace Hotel',
    slug: 'grand-palace-hotel-mumbai',
    description: 'Experience luxury at its finest with our premium accommodations and world-class amenities.',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
    ],
    address: {
      street: '123 Marine Drive',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      zipCode: '400001',
      coordinates: { lat: 18.9220, lng: 72.8347 }
    },
    amenities: ['wifi', 'parking', 'restaurant', 'gym', 'spa', 'pool'],
    propertyType: 'hotel',
    rating: 4.8,
    reviewCount: 1250,
    priceRange: { min: 6500, max: 15000 },
    partnerId: 'partner-1',
    status: 'active'
  },
  {
    name: 'Seaside Resort & Spa',
    slug: 'seaside-resort-spa-goa',
    description: 'Beachfront luxury resort with stunning ocean views and premium spa services.',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop'
    ],
    address: {
      street: 'Calangute Beach Road',
      city: 'Goa',
      state: 'Goa',
      country: 'India',
      zipCode: '403516',
      coordinates: { lat: 15.5444, lng: 73.7554 }
    },
    amenities: ['wifi', 'pool', 'restaurant', 'spa', 'beach', 'bar'],
    propertyType: 'resort',
    rating: 4.9,
    reviewCount: 890,
    priceRange: { min: 4500, max: 12000 },
    partnerId: 'partner-2',
    status: 'active'
  }
]

async function seed() {
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    const db = client.db(dbName)
    
    await db.collection('properties').deleteMany({})
    await db.collection('properties').insertMany(sampleProperties)
    
    console.log('Database seeded successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await client.close()
  }
}

seed()