"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Camera, User, Mail, Phone, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PartnerRegistrationFormPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showDataConsent, setShowDataConsent] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    selfie: null as File | null,
    aadharFront: null as File | null,
    aadharBack: null as File | null,
    selfieData: "",
    aadharFrontData: "",
    aadharBackData: "",
    documentsConsent: false,
    dataConsent: false,
  })

  const selfieRef = useRef<HTMLInputElement>(null)
  const aadharFrontRef = useRef<HTMLInputElement>(null)
  const aadharBackRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    const data = await response.json()
    if (data.error) throw new Error(data.error)
    return data.url
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const imageUrl = await uploadToCloudinary(file)
        setFormData(prev => ({
          ...prev,
          [field]: file,
          [`${field}Data`]: imageUrl
        }))
      } catch (error) {
        console.error('Upload failed:', error)
        alert('Failed to upload image. Please try again.')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (currentStep === 1) {
      // Validate basic info
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        alert("Please fill all required fields")
        return
      }
      setCurrentStep(2)
      return
    }

    if (currentStep === 2) {
      // Validate documents
      if (!formData.selfie || !formData.aadharFront || !formData.aadharBack) {
        alert("Please upload all required documents")
        return
      }
      setCurrentStep(3)
      return
    }

    if (currentStep === 3) {
      // Check documents consent
      if (!formData.documentsConsent) {
        alert("Please accept to share your documents")
        return
      }
      setShowDataConsent(true)
      return
    }

    if (currentStep === 4) {
      // Check data consent and submit
      if (!formData.dataConsent) {
        alert("Please accept to share your data")
        return
      }

      setIsLoading(true)
      
      try {
        const applicationData = {
          applicantName: `${formData.firstName} ${formData.lastName}`,
          businessName: 'To be provided later',
          email: formData.email,
          phone: formData.phone,
          location: 'To be provided later',
          propertyType: 'To be provided later',
          documents: {
            selfie: formData.selfieData,
            aadharFront: formData.aadharFrontData,
            aadharBack: formData.aadharBackData
          }
        }
        
        const response = await fetch('/api/partner/apply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(applicationData)
        })
        
        if (response.ok) {
          router.push("/partner/register/success")
        } else {
          alert('Failed to submit application. Please try again.')
        }
      } catch (error) {
        console.error('Error submitting application:', error)
        alert('Failed to submit application. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const triggerFileInput = (ref: React.RefObject<HTMLInputElement | null>) => {
    ref.current?.click()
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Partner Registration</h1>
          <p className="text-muted-foreground text-lg">
            Complete your registration to become a Motel partner
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
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
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Personal Information"}
              {currentStep === 2 && "Document Upload"}
              {currentStep === 3 && "Document Consent"}
              {currentStep === 4 && "Data Sharing Consent"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Please provide your basic information"}
              {currentStep === 2 && "Upload required documents for verification"}
              {currentStep === 3 && "Consent to share your documents"}
              {currentStep === 4 && "Final consent for data sharing"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium">
                        First Name <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="Enter your first name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium">
                        Last Name <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Enter your last name"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Document Upload */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Selfie Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Real-time Selfie <span className="text-primary">*</span>
                    </label>
                    <div 
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => triggerFileInput(selfieRef)}
                    >
                      <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      {formData.selfie ? (
                        <div className="text-primary font-medium">
                          <CheckCircle className="h-5 w-5 inline mr-2" />
                          Selfie uploaded: {formData.selfie.name}
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium mb-2">Take a real-time selfie</p>
                          <p className="text-sm text-muted-foreground">
                            Click to capture or upload your photo
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={selfieRef}
                      type="file"
                      accept="image/*"
                      capture="user"
                      onChange={(e) => handleFileChange(e, 'selfie')}
                      className="hidden"
                    />
                  </div>

                  {/* Aadhar Front */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Aadhar Card (Front) <span className="text-primary">*</span>
                    </label>
                    <div 
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => triggerFileInput(aadharFrontRef)}
                    >
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      {formData.aadharFront ? (
                        <div className="text-primary font-medium">
                          <CheckCircle className="h-5 w-5 inline mr-2" />
                          Front uploaded: {formData.aadharFront.name}
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium mb-2">Upload Aadhar Card Front</p>
                          <p className="text-sm text-muted-foreground">
                            Click to upload front side of your Aadhar card
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={aadharFrontRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'aadharFront')}
                      className="hidden"
                    />
                  </div>

                  {/* Aadhar Back */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Aadhar Card (Back) <span className="text-primary">*</span>
                    </label>
                    <div 
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => triggerFileInput(aadharBackRef)}
                    >
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      {formData.aadharBack ? (
                        <div className="text-primary font-medium">
                          <CheckCircle className="h-5 w-5 inline mr-2" />
                          Back uploaded: {formData.aadharBack.name}
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium mb-2">Upload Aadhar Card Back</p>
                          <p className="text-sm text-muted-foreground">
                            Click to upload back side of your Aadhar card
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={aadharBackRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'aadharBack')}
                      className="hidden"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Document Consent */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-2">Document Sharing Consent</h3>
                        <p className="text-muted-foreground mb-4">
                          To verify your identity and ensure the security of our platform, we need to share your uploaded documents with our verification partners. Your documents will be used solely for identity verification purposes.
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                          <li>• Documents will be encrypted and stored securely</li>
                          <li>• Used only for identity verification</li>
                          <li>• Shared with authorized verification partners only</li>
                          <li>• Will not be used for any other purpose</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="documentsConsent"
                      name="documentsConsent"
                      checked={formData.documentsConsent}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 mt-1"
                      required
                    />
                    <label htmlFor="documentsConsent" className="text-sm">
                      <span className="font-medium">I accept to share my documents</span> with Motel and its authorized verification partners for identity verification purposes. I understand that my documents will be handled securely and used only for verification.
                    </label>
                  </div>
                </div>
              )}

              {/* Step 4: Data Consent (Popup-like) */}
              {showDataConsent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <Card className="max-w-md w-full">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-primary mr-2" />
                        Data Sharing Consent
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        We need your consent to process and share your personal data with our business partners to provide you with the best service experience. Your data will be handled according to our privacy policy.
                      </p>
                      
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="dataConsent"
                          name="dataConsent"
                          checked={formData.dataConsent}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 mt-1"
                          required
                        />
                        <label htmlFor="dataConsent" className="text-sm">
                          <span className="font-medium">I accept to share my data</span> with Motel and agree to the processing of my personal information as described in the privacy policy.
                        </label>
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowDataConsent(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="button" 
                          onClick={() => {
                            setShowDataConsent(false)
                            setCurrentStep(4)
                          }}
                          className="flex-1"
                          disabled={!formData.dataConsent}
                        >
                          Continue
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <div>
                  {currentStep > 1 && !showDataConsent && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setCurrentStep(prev => prev - 1)}
                    >
                      Previous
                    </Button>
                  )}
                </div>
                <div>
                  {currentStep === 4 ? (
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Submitting..." : "Submit Application"}
                    </Button>
                  ) : (
                    <Button type="submit">
                      Continue
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
