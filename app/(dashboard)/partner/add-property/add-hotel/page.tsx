"use client"

import { useState } from "react"
import Image from "next/image"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { 
  Upload, 
  X, 
  Wifi, 
  Car, 
  Coffee, 
  Dumbbell,
  Waves,
  Utensils,
  Shield,
  Users,
  ArrowLeft,
  Save
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const amenityOptions = [
  { id: 'wifi', name: 'Free WiFi', icon: Wifi },
  { id: 'parking', name: 'Parking', icon: Car },
  { id: 'restaurant', name: 'Restaurant', icon: Utensils },
  { id: 'gym', name: 'Fitness Center', icon: Dumbbell },
  { id: 'pool', name: 'Swimming Pool', icon: Waves },
  { id: 'spa', name: 'Spa & Wellness', icon: Shield },
  { id: 'room-service', name: 'Room Service', icon: Coffee },
  { id: 'concierge', name: 'Concierge', icon: Users },
]

export default function AddHotelPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    description: "",
    propertyType: "hotel",
    
    // Location
    address: "",
    city: "",
    state: "",
    country: "India",
    zipCode: "",
    latitude: "",
    longitude: "",
    
    // Images
    images: [] as File[],
    
    // Amenities
    amenities: [] as string[],
    
    // Policies
    checkInTime: "14:00",
    checkOutTime: "11:00",
    cancellationPolicy: "flexible",
    petPolicy: false,
    smokingPolicy: false,
    
    // Contact
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  })

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAmenityToggle = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 10) // Max 10 images
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload image')
      }
      
      const data = await response.json()
      return data.url
    })
    
    return Promise.all(uploadPromises)
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name || !formData.description || !formData.city || !formData.state) {
      alert('Please fill in all required fields (Name, Description, City, State)')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Upload images first if any are selected
      let imageUrls: string[] = []
      if (formData.images.length > 0) {
        try {
          imageUrls = await uploadImages(formData.images)
        } catch (error) {
          console.error('Image upload failed:', error)
          alert('Failed to upload images. Please try again.')
          setIsLoading(false)
          return
        }
      }
      
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          images: imageUrls, // Use uploaded image URLs
          rooms: [], // Empty rooms array for hotel-only submission
          type: 'hotel_only' // Indicate this is hotel without rooms
        })
      })
      
      if (response.ok) {
        alert("Hotel submitted successfully! It will be reviewed within 24-48 hours.")
        router.push("/partner/properties")
        router.refresh()
      } else {
        const errorData = await response.json()
        alert(`Failed to submit hotel: ${errorData.message || 'Please try again.'}`)
      }
    } catch (error) {
      console.error('Error submitting hotel:', error)
      alert("Failed to submit hotel. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!user || user.publicMetadata?.role !== 'partner') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Access denied. Partner privileges required.</p>
      </div>
    )
  }

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
            <h1 className="text-3xl font-bold">Add Hotel</h1>
            <p className="text-muted-foreground">
              Add your hotel details and amenities
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Basic Info</span>
            <span>Location</span>
            <span>Images</span>
            <span>Review</span>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hotel Name *</label>
                    <Input
                      placeholder="Enter hotel name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Property Type *</label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => handleInputChange('propertyType', e.target.value)}
                      className="w-full border rounded-md px-3 py-2 bg-background"
                    >
                      <option value="hotel">Hotel</option>
                      <option value="resort">Resort</option>
                      <option value="villa">Villa</option>
                      <option value="apartment">Apartment</option>
                      <option value="hostel">Hostel</option>
                      <option value="guesthouse">Guest House</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description *</label>
                  <Textarea
                    placeholder="Describe your hotel, its unique features, and what makes it special..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Hotel Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {amenityOptions.map((amenity) => (
                      <div
                        key={amenity.id}
                        className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.amenities.includes(amenity.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleAmenityToggle(amenity.id)}
                      >
                        <amenity.icon className="h-4 w-4" />
                        <span className="text-sm">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Location Details</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Street Address *</label>
                    <Input
                      placeholder="Enter complete address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City *</label>
                      <Input
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">State *</label>
                      <Input
                        placeholder="State"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">ZIP Code *</label>
                      <Input
                        placeholder="ZIP Code"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Latitude (Optional)</label>
                      <Input
                        placeholder="e.g., 19.0760"
                        value={formData.latitude}
                        onChange={(e) => handleInputChange('latitude', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Longitude (Optional)</label>
                      <Input
                        placeholder="e.g., 72.8777"
                        value={formData.longitude}
                        onChange={(e) => handleInputChange('longitude', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Images */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Hotel Images</h3>
                <p className="text-muted-foreground mb-4">
                  Upload high-quality images of your hotel. The first image will be used as the main photo.
                </p>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="font-medium mb-2">Click to upload images</p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG up to 10MB each (Max 10 images)
                      </p>
                    </label>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={URL.createObjectURL(image)}
                            alt={`Hotel image ${index + 1}`}
                            width={200}
                            height={128}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          {index === 0 && (
                            <Badge className="absolute bottom-2 left-2">Main Photo</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Review Your Hotel</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Name:</strong> {formData.name}</div>
                    <div><strong>Type:</strong> {formData.propertyType}</div>
                    <div><strong>Description:</strong> {formData.description.substring(0, 100)}...</div>
                    <div><strong>Amenities:</strong> {formData.amenities.length} selected</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Location</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Address:</strong> {formData.address}</div>
                    <div><strong>City:</strong> {formData.city}, {formData.state}</div>
                    <div><strong>ZIP:</strong> {formData.zipCode}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>{formData.images.length} images uploaded</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      After submitting your hotel, you can add room types and pricing through the "Add Room" section.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
            </div>
            <div>
              {currentStep < 4 ? (
                <Button onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? (
                    formData.images.length > 0 ? "Uploading images..." : "Submitting..."
                  ) : "Submit Hotel"}
                  <Save className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
