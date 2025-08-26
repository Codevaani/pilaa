export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'user' | 'partner' | 'admin'
  phone?: string
  createdAt: Date
  updatedAt: Date
}

export interface Property {
  id: string
  name: string
  slug: string
  description: string
  images: string[]
  address: {
    street: string
    city: string
    state: string
    country: string
    zipCode: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  amenities: string[]
  propertyType: 'hotel' | 'resort' | 'apartment' | 'villa' | 'hostel'
  rating: number
  reviewCount: number
  priceRange: {
    min: number
    max: number
  }
  partnerId: string
  status: 'active' | 'inactive' | 'pending' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

export interface Room {
  id: string
  propertyId: string
  name: string
  description: string
  images: string[]
  type: 'single' | 'double' | 'suite' | 'deluxe' | 'family'
  capacity: {
    adults: number
    children: number
  }
  amenities: string[]
  price: number
  availability: boolean
  totalRooms: number
  availableRooms: number
}

export interface Booking {
  id: string
  userId: string
  propertyId: string
  roomId: string
  checkIn: Date
  checkOut: Date
  guests: {
    adults: number
    children: number
  }
  totalAmount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  guestDetails: {
    name: string
    email: string
    phone: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  userId: string
  propertyId: string
  bookingId: string
  rating: number
  comment: string
  createdAt: Date
}

export interface SearchFilters {
  location?: string
  checkIn?: Date
  checkOut?: Date
  guests?: {
    adults: number
    children: number
  }
  priceRange?: {
    min: number
    max: number
  }
  rating?: number
  amenities?: string[]
  propertyType?: string[]
  sortBy?: 'price' | 'rating' | 'distance' | 'popularity'
  sortOrder?: 'asc' | 'desc'
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface DashboardStats {
  totalBookings: number
  totalRevenue: number
  occupancyRate: number
  averageRating: number
  recentBookings: Booking[]
  monthlyRevenue: Array<{
    month: string
    revenue: number
  }>
}
