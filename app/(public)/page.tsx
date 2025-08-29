"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, Users, Shield, Award, Clock } from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Destination {
  _id: string;
  city: string;
  image: string;
  count: number;
}

interface Hotel {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  address: {
    city: string;
    state: string;
  };
  rating: number;
  reviewCount: number;
  priceRange: {
    min: number;
    max: number;
  };
}

function HeroSection() {
  return (
    <section className="relative h-[70vh] flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1920&h=1080&fit=crop"
          alt="Luxury hotel"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      <div className="relative z-10 text-center text-white w-full px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Find Your Perfect Stay
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-white/90">
          Discover amazing hotels, resorts, and unique stays around the world
        </p>
        
        <div className="w-full max-w-7xl mx-auto">
          <SearchBar variant="hero" />
        </div>
      </div>
    </section>
  )
}

function PopularDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([])

  useEffect(() => {
    fetch('/api/destinations')
      .then(res => res.json())
      .then(data => setDestinations(data.data || []))
      .catch(() => setDestinations([]))
  }, [])

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Destinations</h2>
          <p className="text-muted-foreground text-lg">Explore the most loved destinations by travelers</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <Link key={destination._id} href={`/search?city=${encodeURIComponent(destination.city)}`}>
              <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative h-48">
                  <Image
                    src={destination.image || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop'}
                    alt={destination.city}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold">{destination.city}</h3>
                    <p className="text-white/80">{destination.count} properties</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([])

  useEffect(() => {
    fetch('/api/properties?limit=3')
      .then(res => res.json())
      .then(data => setHotels(data.data || []))
      .catch(() => setHotels([]))
  }, [])

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Hotels</h2>
          <p className="text-muted-foreground text-lg">Hand-picked hotels with exceptional service</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel) => (
            <Link key={hotel._id} href={`/hotel/${hotel.slug}`}>
              <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative h-48">
                  <Image
                    src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop'}
                    alt={hotel.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{hotel.name}</h3>
                    <div className="flex items-center space-x-1 text-sm">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-medium">{hotel.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {hotel.address?.city}, {hotel.address?.state}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {hotel.reviewCount} reviews
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        ₹{hotel.priceRange?.min?.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">per night</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button asChild size="lg">
            <Link href={"/search" as const}>View All Hotels</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: "Best Price Guarantee",
      description: "We guarantee the best prices. Find a lower price and we&apos;ll match it."
    },
    {
      icon: Award,
      title: "Trusted by Millions",
      description: "Over 2 million happy customers trust us for their travel needs."
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support to help you anytime, anywhere."
    },
    {
      icon: Users,
      title: "Easy Booking",
      description: "Simple and secure booking process with instant confirmation."
    }
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Motel?</h2>
          <p className="text-muted-foreground text-lg">Experience the difference with our premium service</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function PartnerCTA() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <Card className="bg-primary text-primary-foreground p-8 md:p-12 text-center">
          <CardContent>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              List Your Property with Us
            </h2>
            <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of property owners who are earning more by listing their properties on Motel. 
              It&apos;s free to get started!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href={"/partner/register" as const}>Become a Partner</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link href={"/partner/learn-more" as any}>Learn More</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <PopularDestinations />
      <FeaturedHotels />
      <WhyChooseUs />
      <PartnerCTA />
    </div>
  )
}
