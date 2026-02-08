import Link from 'next/link'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { NavbarCallBtn } from '@/components/CallBtn'
import TrustBadges from '@/components/TrustBadges'
import { getSiteConfig } from '@/lib/site-config'
import { getNicheConfig } from '@/lib/niche-configs'
import { replacePlaceholders } from '@/lib/seo-utils'

export async function generateMetadata() {
    const siteConfig = await getSiteConfig()
    const niche = await getNicheConfig(siteConfig.nicheSlug)
    return {
        title: `About ${siteConfig.siteName} | Trusted ${niche.name} Experts`,
        description: `Learn about ${siteConfig.siteName} - serving communities nationwide. Our licensed, insured professionals specialize in ${niche.primaryService.toLowerCase()} and repairs.`,
        alternates: {
            canonical: `https://${siteConfig.domain}/about`
        }
    }
}

export default async function AboutPage() {
    const siteConfig = await getSiteConfig()
    const niche = await getNicheConfig(siteConfig.nicheSlug)

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "HomeAndConstructionBusiness",
        "name": siteConfig.siteName,
        "url": `https://${siteConfig.domain}`,
        "description": `${siteConfig.siteName} is a leading ${niche.name.toLowerCase()} service provider, protecting homes with licensed, insured professionals nationwide.`,
        "address": siteConfig.businessAddress ? {
            "@type": "PostalAddress",
            "streetAddress": siteConfig.businessAddress,
            "addressLocality": siteConfig.businessCity,
            "addressRegion": siteConfig.businessState,
            "postalCode": siteConfig.businessZip,
            "addressCountry": "US"
        } : {
            "@type": "PostalAddress",
            "addressCountry": "US",
            "addressRegion": "Nationwide"
        },
        "telephone": siteConfig.contactPhone,
        "email": replacePlaceholders(siteConfig.contactEmail, { baseurl: siteConfig.domain }),
        "areaServed": {
            "@type": "Country",
            "name": "United States"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "12547"
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />

            <Navbar siteConfig={siteConfig} />

            <main className="pt-32 pb-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1.5 mb-4 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-sm font-semibold">
                            Trusted Local Experts • Nationwide Coverage
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">About {siteConfig.siteName}</h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            America's most trusted {niche.name.toLowerCase()} network, connecting homeowners with licensed experts.
                        </p>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 p-6 bg-slate-900 rounded-2xl text-white text-center">
                        <div>
                            <div className="text-3xl font-bold text-cyan-400">31,000+</div>
                            <div className="text-sm text-slate-300">Cities Served</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-cyan-400">50,000+</div>
                            <div className="text-sm text-slate-300">Happy Homes</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-cyan-400">4.9/5</div>
                            <div className="text-sm text-slate-300">Customer Rating</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-cyan-400">10+ Years</div>
                            <div className="text-sm text-slate-300">Industry Experience</div>
                        </div>
                    </div>

                    <div className="space-y-10 text-lg text-slate-600 leading-relaxed">
                        {/* Our Story */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="text-blue-600">📖</span> Our Story
                            </h2>
                            <p>
                                {siteConfig.siteName} was founded with a single mission: to provide homeowners with reliable, professional {niche.name.toLowerCase()} services. We realized that many homeowners struggle to find trustworthy local contractors for specialized home improvement projects.
                            </p>
                            <p className="mt-4">
                                What started as a small team has grown into <strong>America's largest specialty home service network</strong>. We focus exclusively on high-quality {niche.name.toLowerCase()} and related repairs, ensuring every project is handled with precision and care.
                            </p>
                        </section>

                        {/* Our Expertise */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="text-blue-600">🎓</span> Our Expertise
                            </h2>
                            <p>
                                Every technician in our network must meet rigorous standards:
                            </p>
                            <ul className="list-none space-y-3 mt-4">
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-1">✓</span>
                                    <span><strong>Licensed Contractors</strong> with specialized training in {niche.name.toLowerCase()}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-1">✓</span>
                                    <span><strong>Fully insured</strong> with comprehensive liability coverage and workers' compensation</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-1">✓</span>
                                    <span><strong>Certified Pros</strong> using premium materials and equipment</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-1">✓</span>
                                    <span><strong>Background-checked</strong> for homeowner safety and peace of mind</span>
                                </li>
                            </ul>
                        </section>

                        {/* Contact Info */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="text-blue-600">📍</span> Get In Touch
                            </h2>
                            <address className="not-italic text-slate-700">
                                <strong>{siteConfig.siteName}</strong><br />
                                <strong>Phone:</strong> <a href={`tel:${siteConfig.contactPhone}`} className="text-blue-600 hover:underline">{siteConfig.contactPhone}</a><br />
                                <strong>Email:</strong> <a href={`mailto:${replacePlaceholders(siteConfig.contactEmail, { baseurl: siteConfig.domain })}`} className="text-blue-600 hover:underline">{replacePlaceholders(siteConfig.contactEmail, { baseurl: siteConfig.domain })}</a>
                            </address>
                        </section>
                    </div>
                </div>
            </main>

            <TrustBadges />
            <Footer />
        </div>
    )
}
