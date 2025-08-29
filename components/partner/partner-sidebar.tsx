'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Building2,
  Plus,
  Calendar,
  BedDouble,
  LogOut
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/partner' as const, icon: LayoutDashboard },
  { name: 'My Properties', href: '/partner/properties' as const, icon: Building2 },
  { name: 'My Rooms', href: '/partner/rooms' as const, icon: BedDouble },
  { name: 'Add Property', href: '/partner/properties/add' as const, icon: Plus },
  { name: 'Bookings', href: '/partner/bookings' as const, icon: Calendar },
]

export function PartnerSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Partner Panel
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Property Management
        </p>
      </div>
      
      <nav className="px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href as any}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
        
        <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-8">
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </nav>
    </div>
  )
}
