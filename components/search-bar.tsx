"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Calendar, Users, Navigation, Loader2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface SearchBarProps {
  variant?: "default" | "hero"
  initialData?: {
    location: string
    checkIn: string
    checkOut: string
    guests: { adults: number; children: number }
  }
}

interface City {
  name: string
  state: string
  country: string
  count?: number
}

export function SearchBar({ variant = "default", initialData }: SearchBarProps) {
  const router = useRouter()
  const [searchData, setSearchData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: { adults: 2, children: 0 }
  })
  
  const [cities, setCities] = useState<City[]>([])
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)
  const [showGuestPicker, setShowGuestPicker] = useState(false)
  const locationRef = useRef<HTMLDivElement>(null)

  // Fetch cities when component mounts
  useEffect(() => {
    fetchCities()
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
    
    setSearchData(prev => ({
      ...prev,
      checkIn: today,
      checkOut: tomorrow
    }))
  }, [])

  // Handle initial data from props
  useEffect(() => {
    if (initialData) {
      setSearchData(initialData)
    }
  }, [initialData])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false)
        setShowGuestPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Fetch cities based on search query
  const fetchCities = async (query = '') => {
    try {
      setLoadingCities(true)
      const response = await fetch(`/api/cities?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setCities(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch cities')
    } finally {
      setLoadingCities(false)
    }
  }

  // Get current location using browser geolocation
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.')
      return
    }

    setLoadingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Use reverse geocoding to get city name
          // For now, we'll use a simple approach with popular cities
          // In production, you would use a geocoding service
          const { latitude, longitude } = position.coords
          
          // Simulate reverse geocoding with major Indian cities
          const nearbyCity = getNearbyCity(latitude, longitude)
          setSearchData(prev => ({ ...prev, location: nearbyCity }))
        } catch (error) {
          console.error('Failed to get location name:', error instanceof Error ? error.message : 'Unknown error')
          setSearchData(prev => ({ ...prev, location: "Current Location" }))
        } finally {
          setLoadingLocation(false)
          setShowLocationDropdown(false)
        }
      },
      (error) => {
        setLoadingLocation(false)
        console.error('Error getting location:', error?.message || 'Unknown error')
        
        // Provide more specific error messages based on error code
        let errorMessage = 'Unable to retrieve your location. Please select manually.'
        
        switch (error?.code) {
          case error?.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions in your browser settings and try again.'
            break
          case error?.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please check your internet connection and try again.'
            break
          case error?.TIMEOUT:
            errorMessage = 'The request to get your location timed out. Please try again.'
            break
          default:
            errorMessage = 'An unknown error occurred while retrieving your location. Please select manually.'
        }
        
        alert(errorMessage)
      },
      {
        enableHighAccuracy: false, // Reduced accuracy for better compatibility
        timeout: 10000, // Increased timeout to 10 seconds
        maximumAge: 300000 // Allow cached position up to 5 minutes old
      }
    )
  }

  // Simple function to determine nearby city (in production, use proper geocoding)
  const getNearbyCity = (lat: number, lng: number): string => {
    try {
      // Major Indian cities with approximate coordinates
      const majorCities = [
        { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
        { name: 'Delhi', lat: 28.7041, lng: 77.1025 },
        { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
        { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
        { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
        { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
        { name: 'Pune', lat: 18.5204, lng: 73.8567 },
      ]

      // Validate input coordinates
      if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
        console.warn('Invalid coordinates provided to getNearbyCity:', { lat, lng })
        return 'Mumbai' // Default fallback
      }

      // Find closest city
      let closestCity = 'Mumbai' // Default fallback
      let minDistance = Infinity

      majorCities.forEach(city => {
        // Validate city coordinates
        if (typeof city.lat !== 'number' || typeof city.lng !== 'number' || isNaN(city.lat) || isNaN(city.lng)) {
          return // Skip invalid city
        }
        
        const distance = Math.sqrt(Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2))
        if (distance < minDistance) {
          minDistance = distance
          closestCity = city.name
        }
      })

      return closestCity
    } catch (error) {
      console.error('Error in getNearbyCity function:', error instanceof Error ? error.message : 'Unknown error')
      return 'Mumbai' // Safe fallback
    }
  }

  const handleLocationSearch = (query: string) => {
    setSearchData(prev => ({ ...prev, location: query }))
    if (query.length > 0) {
      fetchCities(query)
      setShowLocationDropdown(true)
    } else {
      setShowLocationDropdown(false)
    }
  }

  const selectCity = (city: City) => {
    setSearchData(prev => ({ ...prev, location: city.name }))
    setShowLocationDropdown(false)
  }

  const handleSearch = () => {
    if (!searchData.location.trim()) {
      alert('Please select a destination')
      return
    }
    
    const params = new URLSearchParams({
      location: searchData.location,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      adults: searchData.guests.adults.toString(),
      children: searchData.guests.children.toString(),
    })
    router.push(`/search?${params.toString()}`)
  }

  const updateGuests = (type: 'adults' | 'children', operation: 'add' | 'subtract') => {
    setSearchData(prev => {
      const newGuests = { ...prev.guests }
      if (operation === 'add') {
        newGuests[type] += 1
      } else if (operation === 'subtract' && newGuests[type] > 0) {
        newGuests[type] -= 1
      }
      // Ensure at least 1 adult
      if (type === 'adults' && newGuests.adults < 1) {
        newGuests.adults = 1
      }
      return { ...prev, guests: newGuests }
    })
  }

  const isHero = variant === "hero"
  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  return (
    <Card className={`${isHero ? "p-8 shadow-xl w-full" : "p-4"} w-full`}>
      <div className={`flex ${isHero ? "flex-col xl:flex-row gap-6" : "flex-row gap-3"} items-center w-full`} suppressHydrationWarning>
        {/* Location with Dropdown */}
        <div className={`${isHero ? "flex-1" : "flex-1 min-w-0"} relative`} ref={locationRef}>
          <div className="flex items-center relative">
            <MapPin className="absolute left-3 h-4 w-4 text-muted-foreground z-10" />
            <Input
              placeholder="Where are you going?"
              value={searchData.location}
              onChange={(e) => handleLocationSearch(e.target.value)}
              onFocus={() => setShowLocationDropdown(true)}
              className="pl-10 pr-10 border-0 focus-visible:ring-0"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={getCurrentLocation}
              disabled={loadingLocation}
              className="absolute right-1 h-8 w-8 p-0 z-10"
              title="Use current location"
            >
              {loadingLocation ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Navigation className="h-3 w-3" />
              )}
            </Button>
          </div>
          
          {/* Location Dropdown */}
          {showLocationDropdown && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-60 overflow-auto">
              {loadingCities ? (
                <div className="p-4 text-center">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading cities...</p>
                </div>
              ) : cities.length > 0 ? (
                <>
                  {cities.map((city, index) => (
                    <div
                      key={index}
                      onClick={() => selectCity(city)}
                      className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="font-medium">{city.name}</div>
                      <div className="text-sm text-muted-foreground">{city.state}, {city.country}</div>
                      {city.count && (
                        <div className="text-xs text-muted-foreground">{city.count} properties</div>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No cities found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Check-in */}
        <div className={`flex items-center ${isHero ? "flex-1" : "flex-1 min-w-0"} relative`}>
          <Calendar className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            placeholder="Check-in"
            min={today}
            value={searchData.checkIn}
            onChange={(e) => setSearchData(prev => ({ ...prev, checkIn: e.target.value }))}
            className="pl-10 border-0 focus-visible:ring-0"
          />
        </div>

        {/* Check-out */}
        <div className={`flex items-center ${isHero ? "flex-1" : "flex-1 min-w-0"} relative`}>
          <Calendar className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            placeholder="Check-out"
            min={searchData.checkIn || tomorrow}
            value={searchData.checkOut}
            onChange={(e) => setSearchData(prev => ({ ...prev, checkOut: e.target.value }))}
            className="pl-10 border-0 focus-visible:ring-0"
          />
        </div>

        {/* Guests with Simple Dropdown */}
        <div className={`${isHero ? "flex-1" : "flex-1 min-w-0"} relative`}>
          <div className="flex items-center relative">
            <Users className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`${searchData.guests.adults} adults, ${searchData.guests.children} children`}
              readOnly
              onClick={() => setShowGuestPicker(!showGuestPicker)}
              className="pl-10 pr-8 border-0 focus-visible:ring-0 cursor-pointer"
            />
            <ChevronDown className="absolute right-3 h-4 w-4 text-muted-foreground" />
          </div>
          
          {/* Guest Picker Dropdown */}
          {showGuestPicker && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Adults</div>
                    <div className="text-sm text-muted-foreground">Ages 13 or above</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateGuests('adults', 'subtract')}
                      disabled={searchData.guests.adults <= 1}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{searchData.guests.adults}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateGuests('adults', 'add')}
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Children</div>
                    <div className="text-sm text-muted-foreground">Ages 0-12</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateGuests('children', 'subtract')}
                      disabled={searchData.guests.children <= 0}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{searchData.guests.children}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateGuests('children', 'add')}
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setShowGuestPicker(false)}
                  className="w-full"
                  size="sm"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <Button 
          onClick={handleSearch}
          size={isHero ? "lg" : "default"}
          className={`${isHero ? "px-8" : "px-4"} shrink-0`}
          disabled={!searchData.location.trim()}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </Card>
  )
}
