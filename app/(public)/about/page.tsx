"use client"

import { Hotel, Users, Award, Heart } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Customer First",
      description: "We put our customers at the heart of everything we do, ensuring exceptional experiences."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Quality Assurance",
      description: "We maintain the highest standards for all our properties and services."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Integrity",
      description: "We operate with honesty and transparency in all our business dealings."
    },
    {
      icon: <Hotel className="h-8 w-8" />,
      title: "Innovation",
      description: "We continuously improve our platform to provide the best booking experience."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Motel</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-primary-foreground/90">
            Your trusted partner for premium hotel bookings worldwide
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground text-lg">
              Founded with a vision to revolutionize the hotel booking industry
            </p>
          </div>
          
          <div className="prose prose-lg mx-auto text-muted-foreground">
            <p className="mb-6">
              Motel was born out of a simple idea: booking a hotel should be easy, transparent, and enjoyable. 
              What started as a small team of travel enthusiasts in 2015 has grown into one of the leading 
              hotel booking platforms, connecting millions of travelers with exceptional accommodations worldwide.
            </p>
            
            <p className="mb-6">
              Our journey began when we noticed a gap in the market - travelers were struggling with complex 
              booking processes, hidden fees, and lack of reliable information. We set out to change that by 
              creating a platform that puts the customer first, offers transparent pricing, and provides 
              detailed, accurate property information.
            </p>
            
            <p className="mb-6">
              Today, Motel partners with over 10,000 properties across 50 countries, offering everything 
              from boutique hotels to luxury resorts. Our commitment to innovation, customer service, and 
              quality has earned us the trust of millions of travelers who choose us for their accommodation needs.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg">
              The principles that guide our every decision
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-6">
                To empower travelers worldwide by providing seamless access to the world's best accommodations 
                while supporting property owners in maximizing their success.
              </p>
              <p className="text-muted-foreground">
                We believe that travel should be accessible to everyone, and that every stay should be memorable. 
                By connecting travelers with properties that match their needs and preferences, we're creating 
                experiences that last a lifetime.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="bg-muted rounded-2xl h-80 flex items-center justify-center">
                <div className="text-center">
                  <Hotel className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Our mission in action</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">By The Numbers</h2>
            <p className="text-primary-foreground/90 text-lg">
              Our growth and impact over the years
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10M+</div>
              <div className="text-primary-foreground/90">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-primary-foreground/90">Properties Worldwide</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-primary-foreground/90">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-primary-foreground/90">Customer Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}