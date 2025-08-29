"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, BookOpen } from "lucide-react"
import { useUser, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isSignedIn, user, isLoaded } = useUser()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // Don't render role-based links until user data is loaded
  const userRole = isLoaded ? user?.publicMetadata?.role : null

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold">Motel</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation Links */}
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/search" className="text-sm font-medium hover:text-primary transition-colors">
                Rooms
              </Link>
              {(!isSignedIn || (userRole !== 'partner' && userRole !== 'admin')) && (
                <Link href="/partner/register" className="text-sm font-medium hover:text-primary transition-colors">
                  Become A Partner
                </Link>
              )}
              {isLoaded && isSignedIn && userRole === 'admin' && (
                <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                  Admin Panel
                </Link>
              )}
              {isLoaded && isSignedIn && userRole === 'partner' && (
                <Link href="/partner" className="text-sm font-medium hover:text-primary transition-colors">
                  Partner Panel
                </Link>
              )}
            </nav>

            {!isLoaded ? (
              // Loading state
              <div className="flex items-center space-x-2">
                <div className="w-16 h-8 bg-muted animate-pulse rounded"></div>
                <div className="w-16 h-8 bg-muted animate-pulse rounded"></div>
              </div>
            ) : isSignedIn ? (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/account">
                    <BookOpen className="h-4 w-4 mr-2" />
                    My Bookings
                  </Link>
                </Button>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                />
                <ThemeToggle />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </SignUpButton>
                <ThemeToggle />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="h-9 w-9"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Navigation Links */}
              <Link
                href="/"
                className="block px-3 py-2 text-base font-medium hover:bg-accent rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/search"
                className="block px-3 py-2 text-base font-medium hover:bg-accent rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Rooms
              </Link>
              {(!isSignedIn || (userRole !== 'partner' && userRole !== 'admin')) && (
                <Link
                  href="/partner/register"
                  className="block px-3 py-2 text-base font-medium hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Become A Partner
                </Link>
              )}
              {isLoaded && isSignedIn && userRole === 'admin' && (
                <Link
                  href="/admin"
                  className="block px-3 py-2 text-base font-medium hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              {isLoaded && isSignedIn && userRole === 'partner' && (
                <Link
                  href="/partner"
                  className="block px-3 py-2 text-base font-medium hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Partner Panel
                </Link>
              )}
              
              {/* Divider */}
              <div className="border-t my-2"></div>
              
              {!isLoaded ? (
                // Loading state
                <div className="px-3 py-2">
                  <div className="w-full h-8 bg-muted animate-pulse rounded"></div>
                </div>
              ) : isSignedIn ? (
                <>
                  <Link
                    href="/account"
                    className="block px-3 py-2 text-base font-medium hover:bg-accent rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link
                    href="/account/bookings"
                    className="block px-3 py-2 text-base font-medium hover:bg-accent rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <div className="px-3 py-2">
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8",
                        },
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="px-3 py-2">
                    <SignInButton mode="modal">
                      <Button variant="ghost" className="w-full justify-start">
                        Sign In
                      </Button>
                    </SignInButton>
                  </div>
                  <div className="px-3 py-2">
                    <SignUpButton mode="modal">
                      <Button className="w-full">
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
