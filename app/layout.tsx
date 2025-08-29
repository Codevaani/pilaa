import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Motel - Premium Hotel Booking Platform',
  description: 'Book premium hotels, resorts, and accommodations worldwide with Motel. Best prices guaranteed.',
  keywords: 'hotel booking, accommodation, travel, resort, vacation rental',
  authors: [{ name: 'Motel Team' }],
  creator: 'Motel',
  publisher: 'Motel',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://motel.com'),
  openGraph: {
    title: 'Motel - Premium Hotel Booking Platform',
    description: 'Book premium hotels, resorts, and accommodations worldwide with Motel. Best prices guaranteed.',
    url: 'https://motel.com',
    siteName: 'Motel',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Motel - Premium Hotel Booking Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Motel - Premium Hotel Booking Platform',
    description: 'Book premium hotels, resorts, and accommodations worldwide with Motel. Best prices guaranteed.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#DC2626',
          colorBackground: '#000000',
          colorInputBackground: '#1A1A1A',
          colorInputText: '#FFFFFF',
          colorText: '#FFFFFF',
          colorTextSecondary: '#A3A3A3',
          colorSuccess: '#DC2626',
          colorDanger: '#DC2626',
          colorWarning: '#DC2626',
          borderRadius: '0.75rem',
        },
        elements: {
          formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
          card: 'bg-card border border-border',
          headerTitle: 'text-foreground',
          headerSubtitle: 'text-muted-foreground',
          socialButtonsBlockButton: 'border border-border hover:bg-accent',
          formFieldInput: 'bg-background border border-border text-foreground',
          footerActionLink: 'text-primary hover:text-primary/80',
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              {children}
              <Toaster richColors position="top-right" />
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
