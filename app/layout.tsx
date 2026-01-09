import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FloatingCallBtn } from "@/components/CallBtn";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Better for Core Web Vitals
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://usgutterinstallation.com'),
  title: {
    default: "Gutter Installation Near Me | US Gutter Installation",
    template: "%s"
  },
  description: "Find gutter installation near me in 31,000+ cities. America's #1 rated gutter contractors. Seamless gutters, gutter guards, cleaning & repair. Free quotes!",
  keywords: "gutter installation near me, gutter repair near me, gutter guards near me, seamless gutters near me, gutter cleaning near me, gutter companies near me, soffit repair near me, fascia repair near me",
  authors: [{ name: 'US Gutter Installation' }],
  creator: 'US Gutter Installation',
  publisher: 'US Gutter Installation',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://usgutterinstallation.com',
    languages: {
      'en-US': 'https://usgutterinstallation.com',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'US Gutter Installation',
    title: 'Find Gutter Installation Near Me | America\'s #1 Directory',
    description: 'Connect with licensed gutter contractors near you. Seamless gutters, guards, cleaning & repair. Free quotes in 24 hours!',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'US Gutter Installation - Find Gutter Contractors Near Me',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gutter Installation Near Me | US Gutter Installation',
    description: 'Find licensed gutter contractors in your area. Seamless gutters, guards, cleaning & repair.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: "k2L90XxpR-_CGNrjycPWVoRqgU8j0bhMr2VGg8enMy0"
  },
  category: 'Home Improvement',
};

// Organization Schema for Site-wide SEO
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "US Gutter Installation",
  "url": "https://usgutterinstallation.com",
  "logo": "https://usgutterinstallation.com/logo.png",
  "description": "America's #1 gutter installation directory connecting homeowners with licensed local gutter contractors.",
  "areaServed": {
    "@type": "Country",
    "name": "United States"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-858-898-5338",
    "contactType": "customer service",
    "availableLanguage": "English"
  },
  "sameAs": []
};

// WebSite Schema for Sitelinks Search Box
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "US Gutter Installation",
  "url": "https://usgutterinstallation.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://usgutterinstallation.com/{search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external resources for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch for analytics/tracking if any */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6SFTTD69YW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-6SFTTD69YW');
          `}
        </Script>
        {children}
        <FloatingCallBtn />
      </body>
    </html>
  );
}

