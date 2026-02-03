import Link from 'next/link'
import { getSiteConfig } from '@/lib/site-config'
import { getNicheConfig } from '@/lib/niche-configs'
import { replacePlaceholders } from '@/lib/seo-utils'
import { Facebook, Instagram, Twitter, Linkedin, Phone, Mail, MapPin } from 'lucide-react'

interface FooterProps {
    city?: string
    stateCode?: string
}

export default async function Footer({ city, stateCode }: FooterProps) {
    const currentYear = new Date().getFullYear()
    const siteConfig = await getSiteConfig()
    const niche = await getNicheConfig(siteConfig.nicheSlug)

    const citySlug = city?.toLowerCase().replace(/ /g, '-')
    const stateSlug = stateCode?.toLowerCase()

    const socialLinks = [
        { url: siteConfig.facebookUrl, icon: Facebook, label: 'Facebook' },
        { url: siteConfig.instagramUrl, icon: Instagram, label: 'Instagram' },
        { url: siteConfig.twitterUrl, icon: Twitter, label: 'Twitter' },
        { url: siteConfig.linkedinUrl, icon: Linkedin, label: 'LinkedIn' },
    ].filter(link => link.url)

    // Process contact email to replace placeholders like {{baseurl}}
    const processedEmail = replacePlaceholders(siteConfig.contactEmail, {
        baseurl: siteConfig.domain
    })

    return (
        <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        {siteConfig.logoUrl ? (
                            <img src={siteConfig.logoUrl} alt={siteConfig.siteName} className="h-10 mb-6 brightness-0 invert" />
                        ) : (
                            <h4 className="text-white font-bold text-xl mb-6">{siteConfig.siteName}</h4>
                        )}
                        <p className="text-sm mb-6 leading-relaxed">
                            {siteConfig.footerTagline || `Your trusted ${niche.name.toLowerCase()} partner. Connecting homeowners with local experts nationwide.`}
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((link, i) => (
                                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors text-slate-500">
                                    <link.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <a href={`tel:${siteConfig.contactPhone}`} className="hover:text-blue-500 transition-colors flex items-center gap-3">
                                    <Phone size={16} className="text-blue-500" /> {siteConfig.contactPhone}
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${processedEmail}`} className="hover:text-blue-500 transition-colors flex items-center gap-3">
                                    <Mail size={16} className="text-blue-500" /> {processedEmail}
                                </a>
                            </li>
                            {siteConfig.businessAddress && (
                                <li className="flex gap-3">
                                    <MapPin size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                    <span>
                                        {siteConfig.businessAddress}<br />
                                        {siteConfig.businessCity}, {siteConfig.businessState} {siteConfig.businessZip}
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Services</h4>
                        <ul className="space-y-3 text-sm">
                            {niche.services.slice(0, 5).map((service, i) => {
                                const href = city && stateCode
                                    ? `/${stateSlug}/${citySlug}/${service.slug}`
                                    : '/sitemap'
                                return (
                                    <li key={i}>
                                        <Link href={href} className="hover:text-white transition-colors">
                                            {service.title}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Explore</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link href="/sitemap" className="hover:text-white transition-colors">Site Directory</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
                    <p>&copy; {currentYear} {siteConfig.siteName}. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-slate-400">Privacy</Link>
                        <Link href="/terms" className="hover:text-slate-400">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
