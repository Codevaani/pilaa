"use client"

import { Mail, Phone, MessageCircle, Clock, User, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function PartnerSupportPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Partner Support</h1>
          <p className="text-xl max-w-3xl mx-auto text-primary-foreground/90">
            Get help with your Motel partner account, property management, or technical issues
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How Can We Help You?</h2>
              <p className="text-muted-foreground text-lg">
                Our dedicated partner support team is available to assist you with any questions or issues
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Email Support</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    For non-urgent inquiries and detailed questions
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <a href="mailto:partners@motel.com">partners@motel.com</a>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    For immediate assistance with urgent issues
                  </p>
                  <Button asChild variant="outline" className="w-full">
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
                  <p className="text-muted-foreground mb-4 text-sm">
                    Real-time support through our partner portal
                  </p>
                  <Button variant="outline" className="w-full" disabled>
                    Login Required
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Support Hours */}
            <Card className="mb-16">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Support Hours
                </CardTitle>
                <CardDescription>
                  Our support team is available to assist you with any partner-related questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Phone & Email Support</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span>9:00 AM - 8:00 PM IST</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Saturday - Sunday</span>
                        <span>10:00 AM - 6:00 PM IST</span>
                      </li>
                      <li className="flex justify-between font-medium text-primary">
                        <span>Emergency Support</span>
                        <span>24/7</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Live Chat</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span>9:00 AM - 8:00 PM IST</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Saturday - Sunday</span>
                        <span>10:00 AM - 6:00 PM IST</span>
                      </li>
                    </ul>
                    <p className="mt-4 text-sm text-muted-foreground">
                      * Live chat is available through the partner portal after login
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Send Us a Message
                </CardTitle>
                <CardDescription>
                  Fill out this form for non-urgent inquiries and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                      <Input id="name" placeholder="Enter your full name" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                      <Input id="email" type="email" placeholder="Enter your email address" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="property" className="text-sm font-medium">Property Name</label>
                    <Input id="property" placeholder="Enter your property name (if applicable)" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                    <Input id="subject" placeholder="What is this regarding?" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <Textarea 
                      id="message" 
                      placeholder="Please provide as much detail as possible about your inquiry" 
                      rows={5}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground text-lg">
                Find answers to common partner questions
              </p>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>How do I update my property information?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Log in to your partner portal and navigate to the "Property Management" section. 
                    From there, you can update your property details, amenities, pricing, and availability. 
                    Changes typically appear on the website within 24 hours.
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
                  <CardTitle>What should I do if I'm having technical issues?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    If you're experiencing technical issues with the partner portal, please try the following:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground mt-2 space-y-1">
                    <li>Clear your browser cache and cookies</li>
                    <li>Try a different browser or device</li>
                    <li>Ensure you're using the latest version of your browser</li>
                    <li>Check your internet connection</li>
                  </ul>
                  <p className="text-muted-foreground mt-2">
                    If the issue persists, contact our technical support team at tech-support@motel.com 
                    with details about the problem, including screenshots if possible.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>How can I improve my property's visibility?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    To improve your property's visibility on Motel:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground mt-2 space-y-1">
                    <li>Keep your calendar updated with accurate availability</li>
                    <li>Provide high-quality photos from multiple angles</li>
                    <li>Write detailed, compelling property descriptions</li>
                    <li>Respond to booking inquiries promptly (within 2 hours)</li>
                    <li>Encourage satisfied guests to leave positive reviews</li>
                    <li>Offer competitive pricing based on market analysis</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}