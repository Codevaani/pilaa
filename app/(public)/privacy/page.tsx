"use client"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl max-w-3xl text-primary-foreground/90">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg mx-auto">
            <p className="text-muted-foreground mb-8">
              At Motel, we respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you 
              visit our website and tell you about your privacy rights.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">1. Important Information and Who We Are</h2>
            <p className="text-muted-foreground mb-4">
              Motel is the controller of your personal data for the purposes of the General Data Protection 
              Regulation (GDPR) and other applicable data protection laws.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">2. The Data We Collect About You</h2>
            <p className="text-muted-foreground mb-4">
              We collect several types of data when you interact with our website:
            </p>
            <ul className="list-disc pl-8 text-muted-foreground mb-6">
              <li className="mb-2"><strong>Identity Data</strong> including your name, username, email address, and password</li>
              <li className="mb-2"><strong>Contact Data</strong> including your billing address, delivery address, email address, and telephone numbers</li>
              <li className="mb-2"><strong>Financial Data</strong> including bank account and payment card details</li>
              <li className="mb-2"><strong>Transaction Data</strong> including details about payments and other details of products and services you have purchased from us</li>
              <li className="mb-2"><strong>Technical Data</strong> including internet protocol (IP) address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform</li>
              <li className="mb-2"><strong>Usage Data</strong> including information about how you use our website, products and services</li>
              <li className="mb-2"><strong>Marketing and Communications Data</strong> including your preferences in receiving marketing from us and your communication preferences</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-6">3. How We Use Your Personal Data</h2>
            <p className="text-muted-foreground mb-4">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-8 text-muted-foreground mb-6">
              <li className="mb-2">To provide and maintain our service</li>
              <li className="mb-2">To notify you about changes to our service</li>
              <li className="mb-2">To allow you to participate in interactive features of our service</li>
              <li className="mb-2">To provide customer care and support</li>
              <li className="mb-2">To provide analysis or valuable information so that we can improve the service</li>
              <li className="mb-2">To monitor the usage of the service</li>
              <li className="mb-2">To detect, prevent and address technical issues</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-6">4. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We have put in place appropriate security measures to prevent your personal data from being 
              accidentally lost, used or accessed in an unauthorised way, altered or disclosed.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">5. Data Retention</h2>
            <p className="text-muted-foreground mb-4">
              We will only retain your personal data for as long as necessary to fulfil the purposes we 
              collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">6. Your Legal Rights</h2>
            <p className="text-muted-foreground mb-4">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data:
            </p>
            <ul className="list-disc pl-8 text-muted-foreground mb-6">
              <li className="mb-2">Request access to your personal data</li>
              <li className="mb-2">Request correction of your personal data</li>
              <li className="mb-2">Request erasure of your personal data</li>
              <li className="mb-2">Object to processing of your personal data</li>
              <li className="mb-2">Request restriction of processing your personal data</li>
              <li className="mb-2">Request transfer of your personal data</li>
              <li className="mb-2">Right to withdraw consent</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-6">7. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-disc pl-8 text-muted-foreground">
              <li className="mb-2">By email: privacy@motel.com</li>
              <li className="mb-2">By phone: +91 1800-123-4567</li>
              <li className="mb-2">By mail: Motel Privacy Team, Mumbai, Maharashtra, India</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}