"use client"

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Cookie Policy</h1>
          <p className="text-xl max-w-3xl text-primary-foreground/90">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg mx-auto">
            <p className="text-muted-foreground mb-8">
              This Cookie Policy explains how Motel ("we", "us", or "our") uses cookies and similar technologies 
              to recognize you when you visit our website at motel.com ("Website"). It explains what these technologies 
              are and why we use them, as well as your rights to control our use of them.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">1. What are cookies?</h2>
            <p className="text-muted-foreground mb-4">
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
              Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, 
              as well as to provide reporting information.
            </p>
            <p className="text-muted-foreground mb-4">
              Cookies set by the website owner (in this case, Motel) are called "first-party cookies". Cookies set by 
              parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party 
              features or functionality to be provided on or through the website (e.g., advertising, interactive content, 
              and analytics). The parties that set these third-party cookies can recognize your computer both when it 
              visits the website in question and also when it visits certain other websites.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">2. Why do we use cookies?</h2>
            <p className="text-muted-foreground mb-4">
              We use first-party and third-party cookies for several reasons. Some cookies are required for technical 
              reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. 
              Other cookies also enable us to track and target the interests of our users to enhance the experience on our Website. 
              Third parties serve cookies through our Website for advertising, analytics, and other purposes. This is described in more detail below.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">3. How can I control cookies?</h2>
            <p className="text-muted-foreground mb-4">
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights in the following ways:
            </p>
            <ul className="list-disc pl-8 text-muted-foreground mb-6">
              <li className="mb-2"><strong>Cookie Consent Tool:</strong> When you visit our Website, a cookie consent banner will appear. You can choose which types of cookies to accept or reject.</li>
              <li className="mb-2"><strong>Browser Settings:</strong> You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our Website though your access to some functionality and areas may be restricted.</li>
              <li className="mb-2"><strong>Specific Cookie Management:</strong> Certain third-party cookies can be controlled through specific opt-out mechanisms provided by the third parties.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-6">4. Types of cookies we use</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Essential Website Cookies</h3>
            <p className="text-muted-foreground mb-4">
              These cookies are strictly necessary to provide you with services available through our Website and to use some of its features.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Performance and Functionality Cookies</h3>
            <p className="text-muted-foreground mb-4">
              These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use. 
              However, without these cookies, certain functionality may become unavailable.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Analytics and Customization Cookies</h3>
            <p className="text-muted-foreground mb-4">
              These cookies collect information that is used either in aggregate form to help us understand how our Website is being used 
              or how effective our marketing campaigns are, or to help us customize our Website for you.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Advertising Cookies</h3>
            <p className="text-muted-foreground mb-4">
              These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad 
              from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements 
              that are based on your interests.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">5. Third-party cookies</h2>
            <p className="text-muted-foreground mb-4">
              In some special cases, we also use cookies provided by trusted third parties. The following section details which third-party 
              cookies you might encounter through our Website:
            </p>
            <ul className="list-disc pl-8 text-muted-foreground mb-6">
              <li className="mb-2"><strong>Google Analytics:</strong> We use Google Analytics to track and analyze website traffic. You can prevent Google Analytics from using your information by opting out through Google's Ads Settings.</li>
              <li className="mb-2"><strong>Social Media Platforms:</strong> Our Website may include social media features, such as the Facebook Like button and widgets. These features may collect your IP address, which page you are visiting on our site, and may set a cookie to enable the feature to function properly.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-6">6. How often will you update this Cookie Policy?</h2>
            <p className="text-muted-foreground mb-4">
              We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other 
              operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
            </p>
            <p className="text-muted-foreground mb-4">
              The date at the top of this Cookie Policy indicates when it was last updated.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">7. Where can I get further information?</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about our use of cookies or other technologies, please contact us at:
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