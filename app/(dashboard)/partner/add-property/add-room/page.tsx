"use client"

import { useState, useEffect, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft,
  Building2,
  Plus,
  X,
  Users,
  IndianRupee,
  Bed,
  Save,
  Camera,
  Upload,
  Trash2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"

interface Hotel {
  id: string
  name: string
  propertyType: string
  city: string
  state: string
  imageUrl?: string
  description: string
}

interface Room {
  id: number
  type: string
  name: string
  description: string
  capacity: { adults: number; children: number }
  price: number
  totalRooms: number
  bedType: string
  bathrooms: number
  photos: File[]
  photoPreviewUrls: string[]
}

const roomTypes = [
  { id: 'standard', name: 'Standard Room', description: 'Basic comfortable room' },
  { id: 'deluxe', name: 'Deluxe Room', description: 'Enhanced room with better amenities' },
  { id: 'suite', name: 'Suite', description: 'Spacious room with separate living area' },
  { id: 'family', name: 'Family Room', description: 'Large room suitable for families' },
  { id: 'presidential', name: 'Presidential Suite', description: 'Luxury suite with premium amenities' },
]

export default function AddRoomPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: Date.now(),
      type: 'standard',
      name: '',
      description: '',
      capacity: { adults: 2, children: 0 },
      price: 0,
      totalRooms: 1,
      bedType: 'double',
      bathrooms: 1,
      photos: [],
      photoPreviewUrls: [],
    }
  ])

  // Fetch partner's hotels
  const fetchHotels = useCallback(async () => {
    if (!user) return
    
    try {
      const response = await fetch('/api/partner/hotels')
      if (response.ok) {
        const data = await response.json()
        setHotels(data.hotels || [])
      } else {
        console.error('Failed to fetch hotels')
      }
    } catch (error) {
      console.error('Error fetching hotels:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchHotels()
    } else {
      setLoading(false)
    }
  }, [user, fetchHotels])

  const addRoom = () => {
    setRooms(prev => [...prev, {
      id: Date.now(),
      type: 'standard',
      name: '',
      description: '',
      capacity: { adults: 2, children: 0 },
      price: 0,
      totalRooms: 1,
      bedType: 'double',
      bathrooms: 1,
      photos: [],
      photoPreviewUrls: [],
    }])
  }

  const removeRoom = (roomId: number) => {
    setRooms(prev => prev.filter(room => room.id !== roomId))
  }

  const updateRoom = (roomId: number, field: string, value: string | number | object) => {
    setRooms(prev => 
      prev.map(room => 
        room.id === roomId ? { ...room, [field]: value } : room
      )
    )
  }

  const handlePhotoUpload = (roomId: number, files: FileList | null) => {
    if (!files) return
    
    const newFiles = Array.from(files)
    const room = rooms.find(r => r.id === roomId)
    if (!room) return
    
    // Check file size limit (1MB = 1024 * 1024 bytes)
    const maxSize = 1024 * 1024 // 1MB in bytes
    const oversizedFiles = newFiles.filter(file => file.size > maxSize)
    
    if (oversizedFiles.length > 0) {
      alert(`Some files are too large. Each image must be 1MB or smaller. Please compress your images and try again.`)
      return
    }
    
    // Limit to 5 photos per room
    const totalPhotos = room.photos.length + newFiles.length
    if (totalPhotos > 5) {
      alert('You can upload maximum 5 photos per room')
      return
    }
    
    // Create preview URLs
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file))
    
    setRooms(prev => 
      prev.map(room => 
        room.id === roomId ? {
          ...room,
          photos: [...room.photos, ...newFiles],
          photoPreviewUrls: [...room.photoPreviewUrls, ...newPreviewUrls]
        } : room
      )
    )
  }
  
  const removePhoto = (roomId: number, photoIndex: number) => {
    setRooms(prev => 
      prev.map(room => {
        if (room.id === roomId) {
          // Revoke the URL to prevent memory leaks
          URL.revokeObjectURL(room.photoPreviewUrls[photoIndex])
          
          const newPhotos = room.photos.filter((_, index) => index !== photoIndex)
          const newPreviewUrls = room.photoPreviewUrls.filter((_, index) => index !== photoIndex)
          
          return {
            ...room,
            photos: newPhotos,
            photoPreviewUrls: newPreviewUrls
          }
        }
        return room
      })
    )
  }

  const handleSubmit = async () => {
    if (!selectedHotel) {
      alert('Please select a hotel first')
      return
    }

    // Validate rooms
    const invalidRoom = rooms.find(room => !room.name || !room.price || !room.totalRooms)
    if (invalidRoom) {
      alert('Please fill in all required room fields (Name, Price, Total Rooms)')
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/partner/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hotelId: selectedHotel.id,
          rooms: rooms
        })
      })
      
      if (response.ok) {
        alert("Rooms added successfully! They will be available for booking after review.")
        router.push("/partner/properties")
        router.refresh()
      } else {
        alert("Failed to add rooms. Please try again.")
      }
    } catch (error) {
      console.error('Error adding rooms:', error)
      alert("Failed to add rooms. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )
  }

  if (!user || user.publicMetadata?.role !== 'partner') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Access denied. Partner privileges required.</p>
      </div>
    )
  }

  // Step 1: Select Hotel
  if (!selectedHotel) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/partner/add-property">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Add Rooms</h1>
              <p className="text-muted-foreground">
                Select a hotel to add room types and pricing
              </p>
            </div>
          </div>
        </div>

        {hotels.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Hotels Found</h3>
              <p className="text-muted-foreground mb-4">
                You need to add a hotel first before you can create rooms.
              </p>
              <Button asChild>
                <Link href="/partner/add-property/add-hotel">
                  Add Your First Hotel
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <h2 className="text-xl font-semibold">Select a Hotel</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <Card 
                  key={hotel.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
                  onClick={() => setSelectedHotel(hotel)}
                >
                  <CardContent className="p-0">
                    {hotel.imageUrl ? (
                      <div className="relative w-full h-48">
                        <Image
                          src={hotel.imageUrl}
                          alt={hotel.name}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-muted flex items-center justify-center rounded-t-lg">
                        <Building2 className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{hotel.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {hotel.propertyType} • {hotel.city}, {hotel.state}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {hotel.description}
                      </p>
                      <Button className="w-full mt-4">
                        Select This Hotel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  // Step 2: Add Rooms
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => setSelectedHotel(null)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add Rooms</h1>
            <p className="text-muted-foreground">
              Adding rooms to <span className="font-medium">{selectedHotel.name}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Selected Hotel Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{selectedHotel.name}</h3>
              <p className="text-muted-foreground">
                {selectedHotel.propertyType} • {selectedHotel.city}, {selectedHotel.state}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Room Types</CardTitle>
            <Button onClick={addRoom} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Room Type
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {rooms.map((room, index) => (
            <Card key={room.id} className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Room Type {index + 1}</CardTitle>
                  {rooms.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeRoom(room.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Room Type *</label>
                    <select
                      value={room.type}
                      onChange={(e) => updateRoom(room.id, 'type', e.target.value)}
                      className="w-full border rounded-md px-3 py-2 bg-background"
                    >
                      {roomTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Room Name *</label>
                    <Input
                      placeholder="e.g., Deluxe Ocean View"
                      value={room.name}
                      onChange={(e) => updateRoom(room.id, 'name', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe this room type..."
                    value={room.description}
                    onChange={(e) => updateRoom(room.id, 'description', e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Adults *</label>
                    <Input
                      type="number"
                      min="1"
                      value={room.capacity.adults}
                      onChange={(e) => updateRoom(room.id, 'capacity', {
                        ...room.capacity,
                        adults: parseInt(e.target.value) || 1
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Children</label>
                    <Input
                      type="number"
                      min="0"
                      value={room.capacity.children}
                      onChange={(e) => updateRoom(room.id, 'capacity', {
                        ...room.capacity,
                        children: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price (₹/night) *</label>
                    <Input
                      type="number"
                      min="0"
                      value={room.price}
                      onChange={(e) => updateRoom(room.id, 'price', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Total Rooms *</label>
                    <Input
                      type="number"
                      min="1"
                      value={room.totalRooms}
                      onChange={(e) => updateRoom(room.id, 'totalRooms', parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bed Type</label>
                    <select
                      value={room.bedType}
                      onChange={(e) => updateRoom(room.id, 'bedType', e.target.value)}
                      className="w-full border rounded-md px-3 py-2 bg-background"
                    >
                      <option value="single">Single Bed</option>
                      <option value="double">Double Bed</option>
                      <option value="queen">Queen Bed</option>
                      <option value="king">King Bed</option>
                      <option value="twin">Twin Beds</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bathrooms</label>
                    <Input
                      type="number"
                      min="1"
                      value={room.bathrooms}
                      onChange={(e) => updateRoom(room.id, 'bathrooms', parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>

                {/* Photo Upload Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center">
                      <Camera className="h-4 w-4 mr-2" />
                      Room Photos (Max 5, 1MB each)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handlePhotoUpload(room.id, e.target.files)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        id={`photo-upload-${room.id}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="relative"
                        disabled={room.photos.length >= 5}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photos
                      </Button>
                    </div>
                  </div>
                  
                  {room.photoPreviewUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {room.photoPreviewUrls.map((url, photoIndex) => (
                        <div key={photoIndex} className="relative group">
                          <div className="relative w-full h-24 bg-muted rounded-lg overflow-hidden">
                            <img
                              src={url}
                              alt={`Room photo ${photoIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => removePhoto(room.id, photoIndex)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {room.photos.length === 0 && (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No photos uploaded yet</p>
                      <p className="text-sm text-muted-foreground">Upload photos to showcase this room type</p>
                      <p className="text-xs text-muted-foreground mt-2">Max 5 photos • 1MB per image</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t">
            <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
              {isSubmitting ? "Adding Rooms..." : "Add Rooms"}
              <Save className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
