"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface SearchBarProps {
  variant?: "default" | "hero"
}

export function SearchBar({ variant = "default" }: SearchBarProps) {
  const router = useRouter()
  const [searchData, setSearchData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: { adults: 2, children: 0 }
  })

  const handleSearch = () => {
    const params = new URLSearchParams({
      location: searchData.location,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      adults: searchData.guests.adults.toString(),
      children: searchData.guests.children.toString(),
    })
    router.push(`/search?${params.toString()}`)
  }

  const isHero = variant === "hero"

  return (
    <Card className={`${isHero ? "p-6 shadow-xl" : "p-3"} w-full`}>
      <div className={`flex ${isHero ? "flex-col lg:flex-row gap-4" : "flex-row gap-2"} items-center`} suppressHydrationWarning>
        {/* Location */}
        <div className={`flex items-center ${isHero ? "flex-1" : "flex-1 min-w-0"} relative`}>
          <MapPin className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Where are you going?"
            value={searchData.location}
            onChange={(e) => setSearchData(prev => ({ ...prev, location: e.target.value }))}
            className="pl-10 border-0 focus-visible:ring-0"
          />
        </div>

        {/* Check-in */}
        <div className={`flex items-center ${isHero ? "flex-1" : "flex-1 min-w-0"} relative`}>
          <Calendar className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            placeholder="Check-in"
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
            value={searchData.checkOut}
            onChange={(e) => setSearchData(prev => ({ ...prev, checkOut: e.target.value }))}
            className="pl-10 border-0 focus-visible:ring-0"
          />
        </div>

        {/* Guests */}
        <div className={`flex items-center ${isHero ? "flex-1" : "flex-1 min-w-0"} relative`}>
          <Users className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`${searchData.guests.adults} adults, ${searchData.guests.children} children`}
            readOnly
            className="pl-10 border-0 focus-visible:ring-0 cursor-pointer"
          />
        </div>

        {/* Search Button */}
        <Button 
          onClick={handleSearch}
          size={isHero ? "lg" : "default"}
          className={`${isHero ? "px-8" : "px-4"} shrink-0`}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </Card>
  )
}
