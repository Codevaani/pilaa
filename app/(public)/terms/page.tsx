"use client"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-xl max-w-3xl text-primary-foreground/90">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg mx-auto">
            <p className="text-muted-foreground mb-8">
              Welcome to Motel. These terms of service outline the rules and regulations for the use of Motel's website and services.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              By accessing this website, we assume you accept these terms of service in full. Do not continue to use Motel's website if you do not accept all of the terms of service stated on this page.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">2. Intellectual Property Rights</h2>
            <p className="text-muted-foreground mb-4">
              Other than the content you own, under these terms of service, Motel and/or its licensors own all the intellectual property rights and materials contained in this website.
            </p>
            <p className="text-muted-foreground mb-4">
              You are granted a limited license only for purposes of viewing the material contained on this website.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">3. Restrictions</h2>
            <p className="text-muted-foreground mb-4">
              You are specifically restricted from all of the following:
            </p>
            <ul className="list-disc pl-8 text-muted-foreground mb-6">
              <li className="mb-2">Publishing any website material in any other media</li>
              <li className="mb-2">Selling, sublicensing and/or otherwise commercializing any website material</li>
              <li className="mb-2">Publicly performing and/or showing any website material</li>
              <li className="mb-2">Using this website in any way that is or may be damaging to this website</li>
              <li className="mb-2">Using this website in any way that impacts user access to this website</li>
              <li className="mb-2">Using this website contrary to applicable laws and regulations</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-6">4. Booking Terms</h2>
            <p className="text-muted-foreground mb-4">
              When making a booking through our platform, you agree to:
            </p>
            <ul className="list-disc pl-8 text-muted-foreground mb-6">
              <li className="mb-2">Provide accurate and complete information</li>
              <li className="mb-2">Honor the cancellation and modification policies of the property</li>
              <li className="mb-2">Pay all charges incurred under your account</li>
              <li className="mb-2">Comply with the property's rules and regulations</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-6">5. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              In no event shall Motel, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this website whether such liability is under contract.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">6. Indemnification</h2>
            <p className="text-muted-foreground mb-4">
              You hereby indemnify to the fullest extent Motel from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these terms.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">7. Variation of Terms</h2>
            <p className="text-muted-foreground mb-4">
              Motel is permitted to revise these terms at any time as it sees fit, and by using this website you are expected to review these terms on a regular basis.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">8. Assignment</h2>
            <p className="text-muted-foreground mb-4">
              The Motel is allowed to assign, transfer, and subcontract its rights and/or obligations under these terms without any notification. However, you are not allowed to assign, transfer, or subcontract any of your rights and/or obligations under these terms.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">9. Governing Law & Jurisdiction</h2>
            <p className="text-muted-foreground mb-4">
              These terms will be governed by and interpreted in accordance with the laws of the State of Maharashtra, India, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Maharashtra for the resolution of any disputes.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">10. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <ul className="list-disc pl-8 text-muted-foreground">
              <li className="mb-2">By email: legal@motel.com</li>
              <li className="mb-2">By phone: +91 1800-123-4567</li>
              <li className="mb-2">By mail: Motel Legal Team, Mumbai, Maharashtra, India</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}