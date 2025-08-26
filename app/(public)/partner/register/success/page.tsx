"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle, Clock, Mail, Phone, FileText, Home, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock user data (in real app, this would come from the registration form)
const mockUserData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+91 98765 43210",
  applicationId: "MP" + Date.now().toString().slice(-6),
  submittedAt: new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const verificationSteps = [
  {
    step: 1,
    title: "Application Received",
    description: "Your application has been successfully submitted",
    status: "completed",
    icon: CheckCircle
  },
  {
    step: 2,
    title: "Document Verification",
    description: "Our team is verifying your uploaded documents",
    status: "in-progress",
    icon: FileText
  },
  {
    step: 3,
    title: "Background Check",
    description: "Security and background verification in progress",
    status: "pending",
    icon: Clock
  },
  {
    step: 4,
    title: "Account Activation",
    description: "Final approval and account setup",
    status: "pending",
    icon: CheckCircle
  }
]

export default function PartnerRegistrationSuccessPage() {
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Hide confetti effect after 3 seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: i % 3 === 0 ? '#DC2626' : i % 3 === 1 ? '#000' : '#fff'
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-primary">
            Thank You for Signing Up!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your partner application has been successfully submitted. 
            We're excited to have you join the Motel family!
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Application Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 text-primary mr-2" />
                Application Details
              </CardTitle>
              <CardDescription>
                Your application information and reference number
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/5 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Application ID</div>
                  <div className="text-2xl font-bold text-primary">{mockUserData.applicationId}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Keep this ID for future reference
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{mockUserData.firstName} {mockUserData.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{mockUserData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{mockUserData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Submitted:</span>
                  <span className="font-medium">{mockUserData.submittedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    Under Review
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 text-primary mr-2" />
                Verification Process
              </CardTitle>
              <CardDescription>
                Track your application progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {verificationSteps.map((step, index) => (
                  <div key={step.step} className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.status === 'completed' 
                        ? 'bg-primary text-primary-foreground' 
                        : step.status === 'in-progress'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {step.status === 'completed' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : step.status === 'in-progress' ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-medium">{step.step}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        step.status === 'completed' ? 'text-primary' : ''
                      }`}>
                        {step.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What's Next */}
        <Card className="max-w-4xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>What Happens Next?</CardTitle>
            <CardDescription>
              Here's what you can expect during the review process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Email Confirmation</h3>
                <p className="text-sm text-muted-foreground">
                  You'll receive a confirmation email within 24 hours with your application details
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Document Review</h3>
                <p className="text-sm text-muted-foreground">
                  Our team will review your documents within 2-3 business days
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Final Approval</h3>
                <p className="text-sm text-muted-foreground">
                  We'll contact you within 5-7 business days with the final decision
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="max-w-4xl mx-auto mt-8 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary-foreground text-xs font-bold">!</span>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">Important Information</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Keep your application ID safe for future reference</li>
                  <li>• Check your email regularly for updates on your application</li>
                  <li>• Our team may contact you if additional information is needed</li>
                  <li>• The review process typically takes 5-7 business days</li>
                  <li>• You'll receive access to the partner dashboard once approved</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Need help? Contact us at{" "}
            <a href="mailto:partners@motel.com" className="text-primary hover:underline">
              partners@motel.com
            </a>{" "}
            or call{" "}
            <a href="tel:+911800123456" className="text-primary hover:underline">
              +91 1800-123-456
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .confetti-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          animation: confetti-fall 3s linear infinite;
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
