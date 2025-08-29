"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Shield, 
  Clock, 
  Star,
  CheckCircle,
  ArrowRight,
  Headphones
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const benefits = [
  {
    icon: DollarSign,
    title: "Maximize Your Earnings",
    description: "Earn up to 25% more revenue compared to other platforms with our competitive commission structure.",
    highlight: "Up to 25% more revenue"
  },
  {
    icon: TrendingUp,
    title: "Boost Your Occupancy",
    description: "Access millions of travelers worldwide and increase your property's booking rate significantly.",
    highlight: "Millions of travelers"
  },
  {
    icon: Users,
    title: "Dedicated Support Team",
    description: "Get 24/7 support from our dedicated partner success team to help you succeed.",
    highlight: "24/7 dedicated support"
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Your payments are guaranteed and processed securely with our trusted payment system.",
    highlight: "Guaranteed payments"
  },
  {
    icon: Clock,
    title: "Quick Setup",
    description: "Get your property listed and start receiving bookings within 24 hours of approval.",
    highlight: "Live in 24 hours"
  },
  {
    icon: Star,
    title: "Marketing Support",
    description: "Benefit from our marketing campaigns and promotional activities to increase visibility.",
    highlight: "Free marketing"
  }
]

const stats = [
  { number: "50,000+", label: "Active Partners" },
  { number: "₹500Cr+", label: "Partner Earnings" },
  { number: "95%", label: "Partner Satisfaction" },
  { number: "24hrs", label: "Average Setup Time" }
]

const testimonials = [
  {
    name: "Rajesh Kumar",
    property: "Beach Resort, Goa",
    rating: 5,
    comment: "Motel helped me increase my bookings by 40% in just 3 months. The support team is amazing!"
  },
  {
    name: "Priya Sharma",
    property: "City Hotel, Mumbai",
    rating: 5,
    comment: "Best decision I made for my business. The platform is easy to use and payments are always on time."
  },
  {
    name: "Amit Patel",
    property: "Mountain Lodge, Shimla",
    rating: 5,
    comment: "From zero online presence to 80% occupancy rate. Motel transformed my business completely."
  }
]

export default function PartnerBenefitsPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [hasApplication, setHasApplication] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkExistingApplication = async () => {
      if (isLoaded && user) {
        try {
          const response = await fetch('/api/partner/check-application')
          if (response.ok) {
            const data = await response.json()
            if (data.hasApplication) {
              setHasApplication(true)
            }
          }
        } catch (error) {
          console.error('Error checking application:', error)
        }
      }
      setLoading(false)
    }

    checkExistingApplication()
  }, [user, isLoaded])

  const handleContinue = () => {
    if (hasApplication) {
      alert('You have already submitted a partner application. Please wait for admin approval.')
      return
    }
    router.push("/partner/register/form" as const)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Checking your application status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Become a Motel Partner
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto">
            Join thousands of successful property owners who are earning more with Motel. 
            Start your journey to increased revenue and global reach today.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={handleContinue}
            className="text-lg px-8 py-4 h-auto"
          >
            Continue to Registration
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Motel as Your Partner?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We provide everything you need to succeed in the hospitality business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                  <p className="text-muted-foreground mb-4">{benefit.description}</p>
                  <div className="inline-flex items-center text-primary font-medium">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {benefit.highlight}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Get started in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Sign Up & Verify</h3>
              <p className="text-muted-foreground">
                Complete our simple registration form and verify your documents
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">List Your Property</h3>
              <p className="text-muted-foreground">
                Add your property details, photos, and set your pricing
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Start Earning</h3>
              <p className="text-muted-foreground">
                Go live and start receiving bookings from millions of travelers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Partners Say
            </h2>
            <p className="text-muted-foreground text-lg">
              Real stories from successful Motel partners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">
                    &quot;{testimonial.comment}&quot;
                  </p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.property}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Success Story?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands of partners who are already earning more with Motel. 
            Your journey to success starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={handleContinue}
              className="text-lg px-8 py-4 h-auto"
            >
              Continue to Registration
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-4 h-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <Link href={"/contact" as any}>
                Have Questions? Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Headphones className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Need Help Getting Started?</h3>
                <p className="text-muted-foreground">Our partner success team is here to help</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" asChild>
                <a href="tel:+911800123456">Call: +91 1800-123-456</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:partners@motel.com">Email: partners@motel.com</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
