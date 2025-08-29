"use client"

import { useState, useEffect } from "react"
import { 
  Search, 
  HelpCircle, 
  User, 
  CreditCard, 
  Hotel, 
  Calendar, 
  Shield, 
  Mail, 
  Phone, 
  MessageCircle, 
  ChevronDown, 
  ChevronRight,
  BookOpen,
  Star,
  Clock,
  MapPin,
  Wifi,
  Car,
  Coffee,
  Waves,
  Dumbbell,
  Sparkles,
  Filter,
  SortAsc
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [filteredArticles, setFilteredArticles] = useState<any[]>([])
  const [sortBy, setSortBy] = useState("relevance")
  const [showAllArticles, setShowAllArticles] = useState(false)

  // Help categories and articles
  const helpCategories = [
    {
      id: "booking",
      title: "Booking & Reservations",
      icon: <Calendar className="h-5 w-5" />,
      articles: [
        {
          id: "how-to-book",
          title: "How do I book a hotel?",
          content: "To book a hotel on Motel, follow these steps:\n1. Use the search bar on our homepage to enter your destination, check-in/out dates, and number of guests.\n2. Browse through the available properties and select one that suits your needs.\n3. Choose a room type and click 'Select Room'.\n4. Fill in your personal details and payment information.\n5. Review your booking and click 'Confirm Booking'.\n\nYou'll receive a confirmation email with all the details of your reservation.",
          tags: ["booking", "reservation", "hotel"]
        },
        {
          id: "modify-booking",
          title: "How can I modify my booking?",
          content: "You can modify your booking by:\n1. Logging into your account and going to 'My Bookings'.\n2. Find the reservation you want to modify and click 'Modify'.\n3. Make the necessary changes (dates, room type, guest information).\n4. Confirm the changes and pay any additional fees if applicable.\n\nNote: Modifications are subject to the hotel's cancellation policy and availability.",
          tags: ["modify", "change", "update", "booking"]
        },
        {
          id: "cancel-booking",
          title: "How do I cancel my booking?",
          content: "To cancel a booking:\n1. Log into your account and navigate to 'My Bookings'.\n2. Find the reservation and click 'Cancel Booking'.\n3. Review the cancellation policy and any applicable fees.\n4. Confirm the cancellation.\n\nRefunds will be processed according to the hotel's cancellation policy and may take 5-10 business days to appear in your account.",
          tags: ["cancel", "refund", "booking"]
        },
        {
          id: "instant-booking",
          title: "What is Instant Booking?",
          content: "Instant Booking allows you to reserve a room immediately without waiting for hotel confirmation. When you see the 'Instant Booking' badge:\n1. You can book immediately without waiting\n2. Your reservation is confirmed instantly\n3. You'll receive confirmation details right away\n\nThis feature is available for select properties that offer immediate confirmation.",
          tags: ["instant", "confirmation", "booking"]
        }
      ]
    },
    {
      id: "account",
      title: "Account Management",
      icon: <User className="h-5 w-5" />,
      articles: [
        {
          id: "create-account",
          title: "How do I create an account?",
          content: "To create an account on Motel:\n1. Click on 'Sign Up' in the top right corner of our homepage.\n2. Enter your email address and create a password.\n3. Verify your email by clicking the link sent to your inbox.\n4. Complete your profile with personal information.\n\nHaving an account allows you to manage bookings, save favorite properties, and receive personalized recommendations.",
          tags: ["account", "sign up", "register"]
        },
        {
          id: "reset-password",
          title: "How do I reset my password?",
          content: "If you've forgotten your password:\n1. Click on 'Sign In' and then 'Forgot Password'.\n2. Enter your registered email address.\n3. Check your inbox for a password reset email.\n4. Click the reset link and create a new password.\n\nIf you don't receive the email within a few minutes, check your spam folder.",
          tags: ["password", "reset", "forgot"]
        },
        {
          id: "update-profile",
          title: "How do I update my profile information?",
          content: "To update your profile:\n1. Sign in to your account.\n2. Go to 'Account Settings' from your profile menu.\n3. Edit your personal information, contact details, or preferences.\n4. Click 'Save Changes' to update your profile.\n\nKeeping your information current ensures you receive important booking notifications.",
          tags: ["profile", "update", "information"]
        },
        {
          id: "delete-account",
          title: "How do I delete my account?",
          content: "To delete your account:\n1. Go to 'Account Settings' in your profile\n2. Scroll to the bottom and click 'Delete Account'\n3. Confirm your decision by entering your password\n4. Click 'Permanently Delete Account'\n\nNote: This action is irreversible and will remove all your data including booking history. We recommend downloading any important information before proceeding.",
          tags: ["delete", "remove", "account"]
        }
      ]
    },
    {
      id: "payment",
      title: "Payment & Pricing",
      icon: <CreditCard className="h-5 w-5" />,
      articles: [
        {
          id: "payment-methods",
          title: "What payment methods do you accept?",
          content: "We accept the following payment methods:\n• Credit and debit cards (Visa, MasterCard, American Express)\n• Digital wallets (PayPal, Apple Pay, Google Pay)\n• Bank transfers (for select properties)\n\nAll payments are processed securely using industry-standard encryption. Your payment information is never stored on our servers.",
          tags: ["payment", "credit card", "debit card"]
        },
        {
          id: "price-guarantee",
          title: "Do you offer a price guarantee?",
          content: "Yes, Motel offers a Best Price Guarantee. If you find the same room at a lower price on another website within 24 hours of booking with us, we'll match that price.\n\nTo request a price match:\n1. Contact our customer support team\n2. Provide the booking confirmation and proof of the lower price\n3. Our team will verify and process the adjustment\n\nThis guarantee applies to identical room types, dates, and booking conditions.",
          tags: ["price", "guarantee", "match"]
        },
        {
          id: "hidden-fees",
          title: "Are there any hidden fees?",
          content: "No, we believe in transparent pricing. The price you see is the price you pay, including taxes and service fees. However, some hotels may charge additional fees at check-in for:\n• Resort fees\n• Parking\n• Wi-Fi\n• Extra guests\n\nThese potential charges are disclosed in the room description before you book. Any mandatory fees will be clearly indicated during the booking process.",
          tags: ["fees", "hidden", "charges"]
        },
        {
          id: "currency",
          title: "In what currency will I be charged?",
          content: "All prices on our website are displayed in Indian Rupees (INR). If you're booking from another country, your bank may convert the amount to your local currency. The conversion rate will be determined by your bank.\n\nFor international travelers, we recommend checking with your bank about foreign transaction fees that may apply to your purchase.",
          tags: ["currency", "inr", "international"]
        }
      ]
    },
    {
      id: "property",
      title: "Properties & Amenities",
      icon: <Hotel className="h-5 w-5" />,
      articles: [
        {
          id: "property-verification",
          title: "How do you verify properties?",
          content: "All properties on Motel go through a rigorous verification process:\n1. Document verification (business license, ownership proof)\n2. Physical inspection (photos, amenities, facilities)\n3. Quality assessment (cleanliness, service standards)\n4. Ongoing monitoring (guest reviews, compliance checks)\n\nWe regularly audit our properties to ensure they maintain our quality standards. Verified properties display a 'Verified' badge on their listing.",
          tags: ["verification", "property", "quality"]
        },
        {
          id: "amenities",
          title: "How accurate are the amenities listed?",
          content: "We strive to provide accurate information about all properties. However, amenities may occasionally change. We recommend:\n1. Checking the property description carefully before booking\n2. Contacting the property directly if you have specific requirements\n3. Reviewing recent guest reviews for current information\n\nIf a promised amenity is missing, please contact our support team immediately. We'll work with the property to resolve the issue or offer alternative solutions.",
          tags: ["amenities", "facilities", "accuracy"]
        },
        {
          id: "room-types",
          title: "What are the different room types?",
          content: "Our properties offer various room types to suit different needs:\n• Standard Room: Basic accommodations with essential amenities\n• Deluxe Room: Spacious rooms with upgraded furnishings\n• Suite: Separate living area with premium amenities\n• Family Room: Larger rooms suitable for families\n• Accessible Room: Designed for guests with mobility needs\n\nRoom descriptions include details about size, view, and specific features to help you choose the perfect accommodation.",
          tags: ["room", "suite", "types"]
        }
      ]
    },
    {
      id: "security",
      title: "Security & Privacy",
      icon: <Shield className="h-5 w-5" />,
      articles: [
        {
          id: "data-protection",
          title: "How do you protect my personal data?",
          content: "We take your privacy seriously and implement multiple security measures:\n• End-to-end encryption for all data transmission\n• Secure servers with regular security audits\n• Strict access controls for employee data access\n• Compliance with data protection regulations (GDPR, CCPA)\n\nWe never sell your personal information to third parties. For more details, please review our Privacy Policy.",
          tags: ["privacy", "security", "data"]
        },
        {
          id: "secure-payment",
          title: "Is my payment information secure?",
          content: "Yes, your payment information is highly secure:\n• We use PCI-compliant payment processors\n• Credit card information is encrypted and tokenized\n• We do not store full credit card numbers\n• All transactions use SSL encryption\n\nFor added security, we recommend using digital wallets like PayPal or Apple Pay, which provide an additional layer of protection by not sharing your card details directly with us.",
          tags: ["payment", "security", "credit card"]
        }
      ]
    }
  ]

  // Popular articles for quick access
  const popularArticles = [
    { id: "how-to-book", title: "How do I book a hotel?", category: "Booking" },
    { id: "cancel-booking", title: "How do I cancel my booking?", category: "Booking" },
    { id: "payment-methods", title: "What payment methods do you accept?", category: "Payment" },
    { id: "reset-password", title: "How do I reset my password?", category: "Account" },
    { id: "property-verification", title: "How do you verify properties?", category: "Property" }
  ]

  // Filter categories and articles based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredArticles([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results: any[] = []

    helpCategories.forEach(category => {
      category.articles.forEach(article => {
        if (
          article.title.toLowerCase().includes(query) || 
          article.content.toLowerCase().includes(query) ||
          article.tags.some(tag => tag.includes(query))
        ) {
          results.push({
            ...article,
            category: category.title
          })
        }
      })
    })

    // Sort by relevance (title match gets higher priority)
    results.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(query) ? 1 : 0
      const bTitleMatch = b.title.toLowerCase().includes(query) ? 1 : 0
      return bTitleMatch - aTitleMatch
    })

    setFilteredArticles(results)
  }, [searchQuery])

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
  }

  // Get all articles for "View All" functionality
  const getAllArticles = () => {
    const allArticles: any[] = []
    helpCategories.forEach(category => {
      category.articles.forEach(article => {
        allArticles.push({
          ...article,
          category: category.title,
          categoryId: category.id
        })
      })
    })
    return allArticles
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <HelpCircle className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Help Center</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            Find answers to your questions and get the help you need to make the most of your Motel experience.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg rounded-full bg-primary-foreground text-primary"
              />
            </div>
            <p className="mt-4 text-primary-foreground/80">
              Popular topics: Booking, Payment, Account, Cancellation
            </p>
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      {!searchQuery && (
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                Popular Help Topics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularArticles.map((article) => (
                  <Card 
                    key={article.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      // Find the category and expand it
                      const category = helpCategories.find(cat => 
                        cat.articles.some(a => a.id === article.id)
                      )
                      if (category) {
                        setExpandedCategory(category.id)
                        // Scroll to the category
                        setTimeout(() => {
                          const element = document.getElementById(`category-${category.id}`)
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' })
                          }
                        }, 100)
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-medium">{article.title}</h3>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {article.category}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search Results */}
      {searchQuery && filteredArticles.length > 0 && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  Search Results <span className="text-muted-foreground text-lg">({filteredArticles.length} found)</span>
                </h2>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="relevance">Sort by Relevance</option>
                    <option value="title">Sort by Title</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardHeader 
                      className="cursor-pointer flex flex-row items-center justify-between"
                      onClick={() => {
                        // Find and expand the category
                        const category = helpCategories.find(cat => 
                          cat.id === article.categoryId
                        )
                        if (category) {
                          setExpandedCategory(category.id)
                          setSearchQuery("")
                          // Scroll to the category
                          setTimeout(() => {
                            const element = document.getElementById(`category-${category.id}`)
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' })
                            }
                          }, 100)
                        }
                      }}
                    >
                      <div>
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                        <CardDescription>{article.category}</CardDescription>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* No Search Results */}
      {searchQuery && filteredArticles.length === 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4">No results found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find any help articles matching "{searchQuery}". Try different keywords or browse our categories below.
              </p>
              <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
            </div>
          </div>
        </section>
      )}

      {/* Help Categories */}
      {!searchQuery && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Browse Help Topics</h2>
                <p className="text-muted-foreground">
                  Find answers to your questions by category
                </p>
              </div>
              
              <div className="grid gap-6">
                {helpCategories.map((category) => (
                  <Card 
                    key={category.id} 
                    className="overflow-hidden"
                    id={`category-${category.id}`}
                  >
                    <CardHeader 
                      className="cursor-pointer flex flex-row items-center justify-between bg-muted/50 hover:bg-muted/80 transition-colors"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {category.icon}
                        </div>
                        <CardTitle className="text-xl">{category.title}</CardTitle>
                      </div>
                      {expandedCategory === category.id ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </CardHeader>
                    {expandedCategory === category.id && (
                      <CardContent className="pt-0">
                        <div className="space-y-4 mt-4">
                          {category.articles.map((article) => (
                            <div 
                              key={article.id} 
                              className="border-b border-border pb-4 last:border-0 last:pb-0 cursor-pointer hover:bg-muted/30 p-2 rounded"
                              onClick={() => {
                                // Could implement article detail view here
                              }}
                            >
                              <h4 className="font-semibold text-lg mb-2">{article.title}</h4>
                              <p className="text-muted-foreground whitespace-pre-line line-clamp-3">
                                {article.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Support */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground text-lg">
              Our support team is here to assist you 24/7
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Email Support</h3>
                <p className="text-muted-foreground mb-4">
                  Get detailed help via email
                </p>
                <Button variant="outline" asChild>
                  <a href="mailto:support@motel.com">support@motel.com</a>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
                <p className="text-muted-foreground mb-4">
                  Speak directly with our agents
                </p>
                <Button variant="outline" asChild>
                  <a href="tel:+9118001234567">+91 1800-123-4567</a>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
                <p className="text-muted-foreground mb-4">
                  Instant help via live chat
                </p>
                <Button variant="outline">Start Chat</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <Card>
                <CardHeader className="cursor-pointer" onClick={() => toggleCategory("faq1")}>
                  <CardTitle className="flex items-center justify-between">
                    <span>How do I know my booking is confirmed?</span>
                    {expandedCategory === "faq1" ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </CardTitle>
                </CardHeader>
                {expandedCategory === "faq1" && (
                  <CardContent>
                    <p className="text-muted-foreground">
                      Once you complete your booking, you'll receive a confirmation email with your booking details, 
                      confirmation number, and hotel contact information. You can also view and manage your booking 
                      in the 'My Bookings' section of your account.
                    </p>
                  </CardContent>
                )}
              </Card>
              
              <Card>
                <CardHeader className="cursor-pointer" onClick={() => toggleCategory("faq2")}>
                  <CardTitle className="flex items-center justify-between">
                    <span>Can I make special requests for my stay?</span>
                    {expandedCategory === "faq2" ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </CardTitle>
                </CardHeader>
                {expandedCategory === "faq2" && (
                  <CardContent>
                    <p className="text-muted-foreground">
                      Yes, you can add special requests during the booking process or by contacting the hotel directly. 
                      Common requests include early check-in, late check-out, specific room types, dietary restrictions, 
                      and accessibility needs. While we'll do our best to accommodate your requests, they are not guaranteed 
                      and depend on availability.
                    </p>
                  </CardContent>
                )}
              </Card>
              
              <Card>
                <CardHeader className="cursor-pointer" onClick={() => toggleCategory("faq3")}>
                  <CardTitle className="flex items-center justify-between">
                    <span>What should I do if I don't receive a confirmation email?</span>
                    {expandedCategory === "faq3" ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </CardTitle>
                </CardHeader>
                {expandedCategory === "faq3" && (
                  <CardContent>
                    <p className="text-muted-foreground">
                      First, check your spam or junk folder. If you still can't find the email, log into your account 
                      and check the 'My Bookings' section. If you're unable to access your account, contact our support 
                      team with your name, email, and approximate booking date, and we'll help locate your reservation.
                    </p>
                  </CardContent>
                )}
              </Card>
              
              <Card>
                <CardHeader className="cursor-pointer" onClick={() => toggleCategory("faq4")}>
                  <CardTitle className="flex items-center justify-between">
                    <span>How far in advance can I book?</span>
                    {expandedCategory === "faq4" ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </CardTitle>
                </CardHeader>
                {expandedCategory === "faq4" && (
                  <CardContent>
                    <p className="text-muted-foreground">
                      You can typically book up to 12 months in advance, though this may vary by property. 
                      Some hotels may allow bookings further in advance, while others may have shorter windows. 
                      If you need to book outside the standard window, please contact our support team for assistance.
                    </p>
                  </CardContent>
                )}
              </Card>
              
              <Card>
                <CardHeader className="cursor-pointer" onClick={() => toggleCategory("faq5")}>
                  <CardTitle className="flex items-center justify-between">
                    <span>Do you offer group booking discounts?</span>
                    {expandedCategory === "faq5" ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </CardTitle>
                </CardHeader>
                {expandedCategory === "faq5" && (
                  <CardContent>
                    <p className="text-muted-foreground">
                      Yes, we offer special rates for group bookings of 10 or more rooms. For group bookings, 
                      please contact our dedicated group sales team at groups@motel.com or call +91 1800-123-4567. 
                      They will provide personalized assistance and the best available rates for your group.
                    </p>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}