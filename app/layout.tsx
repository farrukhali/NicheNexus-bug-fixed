import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnalyticsScripts from "@/components/analytics/AnalyticsScripts";
import { getSiteConfig } from "@/lib/site-config";
import JsonLdSchema from "@/components/seo/JsonLdSchema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  const domain = siteConfig.domain;
  const protocol = domain.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${domain}`;

  return {
    metadataBase: new URL(baseUrl),
    title: siteConfig.siteName,
    description: siteConfig.footerTagline,
    verification: {
      google: siteConfig.gscId,
    },
    alternates: {
      canonical: '/',
    },
    openGraph: {
      images: siteConfig.seoSettings?.og_image_url ? [siteConfig.seoSettings.og_image_url] : [],
    },
    icons: {
      icon: siteConfig.seoSettings?.favicon_url || '/favicon.ico',
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfig = await getSiteConfig();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <AnalyticsScripts />

        <JsonLdSchema type="Organization" data={{
          name: siteConfig.siteName,
          url: siteConfig.domain,
          logo: siteConfig.logoUrl || `${siteConfig.domain}/logo.png`,
          contactPoint: {
            telephone: siteConfig.contactPhone,
            contactType: "customer service"
          }
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

