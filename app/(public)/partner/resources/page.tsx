"use client"

import { BookOpen, FileText, Download, Video, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PartnerResourcesPage() {
  const resources = [
    {
      title: "Partner Onboarding Guide",
      description: "Complete guide to getting started as a Motel partner",
      type: "PDF",
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: "Property Photography Guidelines",
      description: "Best practices for showcasing your property with high-quality images",
      type: "PDF",
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: "Pricing Strategy Guide",
      description: "Maximize your revenue with our dynamic pricing recommendations",
      type: "PDF",
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: "Guest Communication Templates",
      description: "Professional templates for communicating with guests",
      type: "DOC",
      icon: <FileText className="h-5 w-5" />
    }
  ]

  const trainingVideos = [
    {
      title: "Getting Started with Motel Partner Portal",
      duration: "12:45",
      description: "Learn how to navigate and use all features of the partner dashboard"
    },
    {
      title: "Optimizing Your Property Listing",
      duration: "8:30",
      description: "Tips for creating compelling property descriptions and selecting the right amenities"
    },
    {
      title: "Managing Reservations and Calendar",
      duration: "15:20",
      description: "How to efficiently manage bookings, availability, and pricing"
    },
    {
      title: "Handling Guest Reviews and Feedback",
      duration: "10:15",
      description: "Best practices for responding to reviews and improving guest satisfaction"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Partner Resources</h1>
          <p className="text-xl max-w-3xl mx-auto text-primary-foreground/90">
            Access tools, guides, and training materials to help you succeed as a Motel partner
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Resources Section */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-8">Downloadable Resources</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {resources.map((resource, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {resource.icon}
                        </div>
                        <span className="text-xs font-medium px-2 py-1 bg-muted rounded">
                          {resource.type}
                        </span>
                      </div>
                      <CardTitle className="text-xl mt-4">{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Training Videos */}
              <h2 className="text-3xl font-bold mb-8">Training Videos</h2>
              
              <div className="space-y-4">
                {trainingVideos.map((video, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Video className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{video.title}</CardTitle>
                          <CardDescription>{video.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Duration: {video.duration}
                      </span>
                      <Button variant="outline">
                        <Play className="mr-2 h-4 w-4" />
                        Watch Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="mr-2 h-5 w-5" />
                    Need Help?
                  </CardTitle>
                  <CardDescription>
                    Our partner support team is here to assist you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" asChild>
                    <a href="mailto:partners@motel.com">Email Support</a>
                  </Button>
                  <Button className="w-full" variant="outline" asChild>
                    <a href="tel:+9118001234567">Call Support</a>
                  </Button>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-2">Partner Success Tips</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary mt-0.5 flex-shrink-0" />
                        <span>Keep your calendar updated for better visibility</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary mt-0.5 flex-shrink-0" />
                        <span>Respond to booking requests within 2 hours</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary mt-0.5 flex-shrink-0" />
                        <span>Provide high-quality photos for better bookings</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary mt-0.5 flex-shrink-0" />
                        <span>Encourage guests to leave reviews</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>How do I access the partner portal?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Once your application is approved, you'll receive an email with login credentials. 
                  Visit partner.motel.com and log in with your email and password. If you haven't received 
                  your credentials, please contact partners@motel.com.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>How often are payments processed?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Payments are processed twice a month on the 1st and 15th. You'll receive a detailed 
                  statement via email before each payment is processed. Payments are typically received 
                  within 3-5 business days after processing.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>What support is available for partners?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our dedicated partner support team is available 24/7 via email at partners@motel.com 
                  or by phone at +91 1800-123-4567. We also offer live chat support during business hours 
                  (9 AM - 8 PM IST) through the partner portal.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

// Adding missing components
function Play(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}