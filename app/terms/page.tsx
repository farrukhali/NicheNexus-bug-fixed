import Link from 'next/link'
import Footer from '@/components/Footer'
import TrustBadges from '@/components/TrustBadges'
import { getSiteConfig } from '@/lib/site-config'
import { getNicheConfig } from '@/lib/niche-configs'
import { replacePlaceholders } from '@/lib/seo-utils'

export async function generateMetadata() {
    const siteConfig = await getSiteConfig()
    return {
        title: `Terms & Conditions | ${siteConfig.siteName}`,
        description: `Terms of Service for ${siteConfig.siteName}. Read our terms and conditions for using our services.`,
        alternates: {
            canonical: `https://${siteConfig.domain}/terms`
        }
    }
}

export default async function TermsPage() {
    const siteConfig = await getSiteConfig()
    const niche = await getNicheConfig(siteConfig.nicheSlug)

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Terms & Conditions",
                        "url": `https://${siteConfig.domain}/terms`,
                        "description": `Terms of Service for ${siteConfig.siteName}`,
                        "publisher": {
                            "@type": "Organization",
                            "name": siteConfig.siteName
                        }
                    })
                }}
            />

            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-500">
                        {siteConfig.siteName}
                    </Link>
                    <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600">
                        Back to Home
                    </Link>
                </div>
            </nav>

            <main className="pt-32 pb-24 px-6">
                <div className="max-w-3xl mx-auto prose prose-slate prose-headings:text-slate-900">
                    <h1>Terms & Conditions</h1>
                    <p className="text-slate-500">Last Updated: January 2026</p>

                    <p>Welcome to {siteConfig.siteName}. By accessing or using our website and services, you agree to be bound by these Terms and Conditions. Please read them carefully.</p>

                    <h2>1. Acceptance of Terms</h2>
                    <p>By using our {niche.name.toLowerCase()} services or website, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, please do not use our services.</p>

                    <h2>2. Services Description</h2>
                    <p>{siteConfig.siteName} provides {niche.name.toLowerCase()} services including but not limited to:</p>
                    <ul>
                        {niche.services.slice(0, 5).map((service, i) => (
                            <li key={i}>{service.title}</li>
                        ))}
                    </ul>
                    <p>All services are provided by licensed, insured professionals in your local area.</p>

                    <h2>3. Service Estimates & Pricing</h2>
                    <p>All estimates provided are non-binding unless otherwise stated in writing. Final pricing may vary based on:</p>
                    <ul>
                        <li>Actual scope of work discovered during service</li>
                        <li>Material costs and availability</li>
                        <li>Local permit requirements</li>
                        <li>Site conditions and accessibility</li>
                    </ul>

                    <h2>4. Warranties & Guarantees</h2>
                    <p>Our workmanship is backed by industry-standard warranties. Specific warranty terms will be provided in writing upon service completion. Manufacturer warranties on materials are separate and provided directly by manufacturers.</p>

                    <h2>5. Limitation of Liability</h2>
                    <p>{siteConfig.siteName} shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services. Our total liability shall not exceed the amount paid for the specific service in question.</p>

                    <h2>6. User Responsibilities</h2>
                    <p>You agree to:</p>
                    <ul>
                        <li>Provide accurate information when requesting services</li>
                        <li>Ensure safe access to the service location</li>
                        <li>Notify us of any known hazards or special conditions</li>
                        <li>Make timely payments as agreed</li>
                    </ul>

                    <h2>7. Cancellation Policy</h2>
                    <p>Appointments may be cancelled or rescheduled with at least 24 hours notice without penalty. Same-day cancellations may be subject to a service call fee.</p>

                    <h2>8. Intellectual Property</h2>
                    <p>All content on this website, including text, graphics, logos, and images, is the property of {siteConfig.siteName} and is protected by copyright laws.</p>

                    <h2>9. Privacy</h2>
                    <p>Your use of our services is also governed by our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>, which is incorporated into these Terms by reference.</p>

                    <h2>10. Governing Law</h2>
                    <p>These Terms shall be governed by and construed in accordance with the laws of the United States. Any disputes shall be resolved in the appropriate courts.</p>

                    <h2>11. Changes to Terms</h2>
                    <p>We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated revision date. Continued use of our services constitutes acceptance of modified Terms.</p>

                    <h2>12. Contact Information</h2>
                    <p>For questions about these Terms, please contact us:</p>
                    <address className="not-italic">
                        <strong>{siteConfig.siteName}</strong><br />
                        Phone: <a href={`tel:${siteConfig.contactPhone}`} className="text-blue-600 font-medium hover:underline">{siteConfig.contactPhone}</a><br />
                        Email: <a href={`mailto:${replacePlaceholders(siteConfig.contactEmail, { baseurl: siteConfig.domain })}`} className="text-blue-600 font-medium hover:underline">{replacePlaceholders(siteConfig.contactEmail, { baseurl: siteConfig.domain })}</a>
                    </address>
                </div>
            </main>

            <TrustBadges />
            <Footer />
        </div>
    )
}
