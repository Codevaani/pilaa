"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Building, Calendar, Plus, BarChart3, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/partner",
    icon: LayoutDashboard,
  },
  {
    title: "My Properties",
    href: "/partner/properties",
    icon: Building,
  },
  {
    title: "Add Property",
    href: "/partner/add-property",
    icon: Plus,
  },
  {
    title: "Bookings",
    href: "/partner/bookings",
    icon: Calendar,
  },
  {
    title: "Analytics",
    href: "/partner/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/partner/settings",
    icon: Settings,
  },
]

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <div className="space-y-2">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg text-primary">Partner Panel</h3>
                    <p className="text-sm text-muted-foreground">Property Management</p>
                  </div>
                  
                  {sidebarItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link key={item.href} href={item.href}>
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          className="w-full justify-start"
                        >
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.title}
                        </Button>
                      </Link>
                    )
                  })}
                  
                  <div className="pt-4 border-t">
                    <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {children}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
