"use client"

import { Building2, Users, Award, Heart, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CareersPage() {
  const positions = [
    {
      title: "Frontend Developer",
      department: "Engineering",
      location: "Mumbai, India (Remote Available)",
      type: "Full-time",
      description: "We're looking for a skilled frontend developer to help us build exceptional user experiences for our hotel booking platform."
    },
    {
      title: "Backend Developer",
      department: "Engineering",
      location: "Mumbai, India (Remote Available)",
      type: "Full-time",
      description: "Join our backend team to build scalable systems that power our platform and handle millions of bookings."
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "Mumbai, India (Remote Available)",
      type: "Full-time",
      description: "Create beautiful and intuitive user interfaces for our customers and partners."
    },
    {
      title: "Customer Support Specialist",
      department: "Support",
      location: "Mumbai, India (Remote Available)",
      type: "Full-time",
      description: "Provide exceptional support to our customers and help them with their travel needs."
    }
  ]

  const benefits = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Professional Growth",
      description: "Learning budget and mentorship programs"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Culture",
      description: "Collaborative environment with regular team events"
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      title: "Work Flexibility",
      description: "Remote work options and flexible schedules"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Join Our Team</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-primary-foreground/90">
            Help us revolutionize the travel industry and create memorable experiences for millions of travelers
          </p>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Culture</h2>
            <p className="text-muted-foreground text-lg">
              We believe in creating a workplace where innovation thrives and people grow
            </p>
          </div>
          
          <div className="prose prose-lg mx-auto text-muted-foreground mb-12">
            <p className="mb-6">
              At Motel, we're passionate about travel and technology. Our team is dedicated to making the hotel booking experience seamless and enjoyable for travelers worldwide. We value innovation, collaboration, and a customer-first approach in everything we do.
            </p>
            
            <p className="mb-6">
              We foster an environment where every team member can contribute ideas, take ownership of their work, and grow professionally. Our culture is built on transparency, respect, and a shared commitment to excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
            <p className="text-muted-foreground text-lg">
              Join us in building the future of travel
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {positions.map((position, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{position.title}</CardTitle>
                  <CardDescription>
                    {position.department} • {position.location} • {position.type}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{position.description}</p>
                  <Button>Apply Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Life at Motel */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Life at Motel</h2>
            <p className="text-muted-foreground text-lg">
              What our team members say about working here
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-muted p-6 rounded-lg">
              <div className="text-primary text-5xl mb-4">"</div>
              <p className="text-muted-foreground mb-4">
                The collaborative environment at Motel has helped me grow both technically and professionally. 
                I love working on products that impact millions of travelers.
              </p>
              <p className="font-semibold">- Priya Sharma, Senior Developer</p>
            </div>
            
            <div className="bg-muted p-6 rounded-lg">
              <div className="text-primary text-5xl mb-4">"</div>
              <p className="text-muted-foreground mb-4">
                The leadership team truly cares about employee wellbeing and career development. 
                The flexibility to work remotely has been a game-changer for my work-life balance.
              </p>
              <p className="font-semibold">- Raj Patel, UX Designer</p>
            </div>
            
            <div className="bg-muted p-6 rounded-lg">
              <div className="text-primary text-5xl mb-4">"</div>
              <p className="text-muted-foreground mb-4">
                Motel's mission to make travel accessible resonates with me deeply. 
                It's rewarding to work for a company that makes a positive impact on people's lives.
              </p>
              <p className="font-semibold">- Anika Desai, Customer Success</p>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6">Ready to Join Us?</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <a href="mailto:careers@motel.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Send Your Resume
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="tel:+9118001234567">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Don't See the Right Role?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            We're always looking for talented individuals to join our team. Send us your resume and we'll be in touch.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href="mailto:careers@motel.com">Contact Our HR Team</a>
          </Button>
        </div>
      </section>
    </div>
  )
}