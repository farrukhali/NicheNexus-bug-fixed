import Link from 'next/link'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { NavbarCallBtn, CallBtn } from '@/components/CallBtn'
import TrustBadges from '@/components/TrustBadges'
import { getSiteConfig } from '@/lib/site-config'
import { getNicheConfig } from '@/lib/niche-configs'
import { replacePlaceholders } from '@/lib/seo-utils'

export async function generateMetadata() {
    const siteConfig = await getSiteConfig()
    const niche = await getNicheConfig(siteConfig.nicheSlug)
    return {
        title: `Contact ${siteConfig.siteName} | Get a Free ${niche.name} Quote`,
        description: `Contact ${siteConfig.siteName} for ${niche.name.toLowerCase()} services. Get a free estimate, schedule service, or speak with our team today.`,
        alternates: {
            canonical: `https://${siteConfig.domain}/contact`
        }
    }
}

export default async function ContactPage() {
    const siteConfig = await getSiteConfig()
    const niche = await getNicheConfig(siteConfig.nicheSlug)

    // Dynamic address from siteConfig
    const businessAddress = siteConfig.businessAddress || 'Corporate Headquarters'
    const businessLocation = siteConfig.businessCity && siteConfig.businessState
        ? `${siteConfig.businessCity}, ${siteConfig.businessState}`
        : 'United States'

    // ContactPage Schema for SEO
    const contactSchema = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": `Contact ${siteConfig.siteName}`,
        "url": `https://${siteConfig.domain}/contact`,
        "description": `Get in touch with ${siteConfig.siteName} for ${niche.name.toLowerCase()} services`,
        "mainEntity": {
            "@type": "Organization",
            "name": siteConfig.siteName,
            "telephone": siteConfig.contactPhone,
            "email": replacePlaceholders(siteConfig.contactEmail, { baseurl: siteConfig.domain }),
            "address": siteConfig.businessAddress ? {
                "@type": "PostalAddress",
                "streetAddress": siteConfig.businessAddress,
                "addressLocality": siteConfig.businessCity,
                "addressRegion": siteConfig.businessState,
                "postalCode": siteConfig.businessZip,
                "addressCountry": "US"
            } : undefined
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
            />

            <Navbar siteConfig={siteConfig} />

            <main className="pt-32 pb-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 text-center">Contact Us</h1>
                    <p className="text-xl text-slate-600 text-center mb-16 max-w-2xl mx-auto">
                        We&apos;re here to help with all your {niche.name.toLowerCase()} needs. Reach out for quotes, support, or general inquiries.
                    </p>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                            <h2 className="text-2xl font-bold mb-6">Fastest Way to Reach Us</h2>
                            <p className="text-slate-600 mb-8">
                                For immediate {niche.name.toLowerCase()} quotes and scheduling, please call our 24/7 hotline. We have agents ready to connect you with a local pro.
                            </p>
                            <CallBtn className="w-full py-4 text-lg" label={`Call Now: ${siteConfig.contactPhone}`} />

                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <h3 className="font-bold mb-2">Hours of Operation</h3>
                                <p className="text-slate-500">Monday - Sunday: 24 Hours</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold mb-2">Email Support</h3>
                                <p className="text-slate-600 mb-1">For non-urgent inquiries:</p>
                                <a href={`mailto:${replacePlaceholders(siteConfig.contactEmail, { baseurl: siteConfig.domain })}`} className="text-blue-600 font-semibold hover:underline">{replacePlaceholders(siteConfig.contactEmail, { baseurl: siteConfig.domain })}</a>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold mb-2">Corporate Office</h3>
                                <p className="text-slate-600">
                                    {businessAddress}<br />
                                    {businessLocation}<br />
                                    United States
                                </p>
                            </div>

                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                <h3 className="font-bold text-blue-900 mb-2">Need a {niche.name} Estimate?</h3>
                                <p className="text-blue-700 text-sm mb-4">
                                    The fastest way to get a price is to find your city page and call the local number or use the main hotline.
                                </p>
                                <Link href="/" className="text-blue-600 font-bold hover:underline text-sm">
                                    Find Your City &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <TrustBadges />
            <Footer />
        </div>
    )
}
