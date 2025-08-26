import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="relative z-10 flex flex-col justify-center items-center text-primary-foreground p-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-8">
              <div className="h-12 w-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-2xl">M</span>
              </div>
              <span className="text-3xl font-bold">Motel</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Welcome to Motel
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-md">
              Your trusted partner for premium hotel bookings worldwide. 
              Discover amazing places to stay with the best prices guaranteed.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="flex items-center justify-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold">Motel</span>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
