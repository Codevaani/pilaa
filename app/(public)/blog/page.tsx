"use client"

import { Calendar, User, Tag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "10 Tips for Finding the Perfect Hotel for Your Next Vacation",
      excerpt: "Discover expert advice on how to choose the ideal accommodation for your travel needs, from location to amenities.",
      author: "Sarah Johnson",
      date: "2023-06-15",
      tags: ["Travel Tips", "Hotel Selection"],
      image: "/placeholder-blog-1.jpg"
    },
    {
      id: 2,
      title: "The Rise of Sustainable Hotels: What Travelers Need to Know",
      excerpt: "Explore the growing trend of eco-friendly accommodations and how to identify truly sustainable hotels.",
      author: "Michael Chen",
      date: "2023-05-28",
      tags: ["Sustainability", "Eco Travel"],
      image: "/placeholder-blog-2.jpg"
    },
    {
      id: 3,
      title: "Maximizing Your Hotel Loyalty Program Benefits",
      excerpt: "Learn how to make the most of hotel loyalty programs to save money and enjoy premium experiences.",
      author: "Priya Sharma",
      date: "2023-05-12",
      tags: ["Loyalty Programs", "Travel Hacks"],
      image: "/placeholder-blog-3.jpg"
    },
    {
      id: 4,
      title: "Understanding Hotel Cancellation Policies: A Complete Guide",
      excerpt: "Navigate the complex world of hotel cancellation policies and avoid costly mistakes when changing plans.",
      author: "David Wilson",
      date: "2023-04-30",
      tags: ["Booking Tips", "Policies"],
      image: "/placeholder-blog-4.jpg"
    },
    {
      id: 5,
      title: "Top 5 Hotel Amenities You Shouldn't Overlook",
      excerpt: "Discover hidden gems among hotel amenities that can significantly enhance your travel experience.",
      author: "Emma Rodriguez",
      date: "2023-04-18",
      tags: ["Amenities", "Comfort"],
      image: "/placeholder-blog-5.jpg"
    },
    {
      id: 6,
      title: "How to Negotiate Better Hotel Rates: Insider Secrets",
      excerpt: "Professional travel planners share their strategies for securing the best hotel deals and room upgrades.",
      author: "James Kumar",
      date: "2023-04-05",
      tags: ["Deals", "Negotiation"],
      image: "/placeholder-blog-6.jpg"
    }
  ]

  const categories = [
    "Travel Tips",
    "Hotel Reviews",
    "Destination Guides",
    "Sustainability",
    "Technology",
    "Industry News"
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Motel Blog</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-primary-foreground/90">
            Travel insights, tips, and stories to inspire your next adventure
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Post</h2>
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 bg-muted h-64 md:h-auto">
                  <div className="w-full h-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="bg-muted-foreground/10 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                      <p className="text-muted-foreground">Featured Blog Image</p>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <CardHeader>
                    <CardTitle className="text-2xl">The Future of Hotel Booking: Trends to Watch in 2023</CardTitle>
                    <CardDescription>
                      Explore the latest innovations transforming the hospitality industry and how they impact travelers.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <User className="h-4 w-4 mr-2" />
                      <span>Alex Morgan</span>
                      <Calendar className="h-4 w-4 ml-4 mr-2" />
                      <span>2023-07-01</span>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      From AI-powered personalization to contactless experiences, discover how technology is reshaping 
                      the way we book and experience hotels. We explore the trends that will define travel in the coming year.
                    </p>
                    <Button>
                      Read Full Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Latest Articles</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">Sort by:</span>
                  <select className="border rounded px-3 py-1 text-sm">
                    <option>Newest First</option>
                    <option>Oldest First</option>
                    <option>Most Popular</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="flex flex-col">
                    <div className="bg-muted h-48">
                      <div className="w-full h-full bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center">
                        <div className="text-center">
                          <div className="bg-muted-foreground/10 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-2" />
                          <p className="text-muted-foreground text-sm">Blog Image</p>
                        </div>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <User className="h-4 w-4 mr-2" />
                        <span>{post.author}</span>
                        <Calendar className="h-4 w-4 ml-4 mr-2" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Button variant="outline" size="sm">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Pagination */}
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  <Button variant="outline" disabled>Previous</Button>
                  <Button variant="outline" className="bg-primary text-primary-foreground">1</Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">Next</Button>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3">
              <div className="sticky top-24 space-y-8">
                {/* About Blog */}
                <Card>
                  <CardHeader>
                    <CardTitle>About Our Blog</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      The Motel Blog is your source for travel inspiration, hotel insights, and industry trends. 
                      Our team of travel experts and hospitality professionals share tips to enhance your travel experiences.
                    </p>
                    <Button variant="outline" className="w-full">
                      Subscribe to Newsletter
                    </Button>
                  </CardContent>
                </Card>
                
                {/* Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle>Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {categories.map((category, index) => (
                        <Button key={index} variant="ghost" className="w-full justify-between">
                          {category}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Popular Posts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Popular Posts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {blogPosts.slice(0, 3).map((post) => (
                        <div key={post.id} className="flex items-start space-x-3">
                          <div className="bg-muted w-16 h-16 flex-shrink-0">
                            <div className="w-full h-full bg-gradient-to-r from-primary/5 to-secondary/5 flex items-center justify-center">
                              <div className="bg-muted-foreground/10 border border-dashed rounded w-6 h-6" />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium line-clamp-2 text-sm">{post.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(post.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter for the latest travel tips, hotel reviews, and exclusive deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-2 border rounded-md"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}