import Link from 'next/link'
import Footer from '@/components/Footer'
import TrustBadges from '@/components/TrustBadges'
import { getSiteConfig } from '@/lib/site-config'
import { getNicheConfig } from '@/lib/niche-configs'
import { replacePlaceholders } from '@/lib/seo-utils'

export async function generateMetadata() {
    const siteConfig = await getSiteConfig()
    return {
        title: `Privacy Policy | ${siteConfig.siteName}`,
        description: `Privacy Policy for ${siteConfig.siteName}. Learn how we collect, use, and protect your personal information.`,
        alternates: {
            canonical: `https://${siteConfig.domain}/privacy`
        }
    }
}

export default async function PrivacyPage() {
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
                        "name": "Privacy Policy",
                        "url": `https://${siteConfig.domain}/privacy`,
                        "description": `Privacy Policy for ${siteConfig.siteName}`,
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
                    <h1>Privacy Policy</h1>
                    <p className="text-slate-500">Last Updated: January 2026</p>

                    <p>At {siteConfig.siteName}, we recognize that privacy is significant. This Privacy Policy applies to the collection, use, and disclosure of personal information by {siteConfig.siteName} and its affiliates when you use our {niche.name.toLowerCase()} services or website.</p>

                    <h2>1. Information We Collect</h2>
                    <p>We collect information you provide directly to us, such as when you:</p>
                    <ul>
                        <li>Request a quote for {niche.name.toLowerCase()} services</li>
                        <li>Fill out a contact form or service request</li>
                        <li>Communicate with us via phone, email, or chat</li>
                        <li>Schedule a service appointment</li>
                    </ul>
                    <p>This may include your name, email address, phone number, property address, and details about your service needs.</p>

                    <h2>2. How We Use Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Provide, maintain, and improve our {niche.name.toLowerCase()} services</li>
                        <li>Process your requests for quotes and connect you with local service providers</li>
                        <li>Send you technical notices, updates, and support messages</li>
                        <li>Respond to your comments, questions, and customer service requests</li>
                        <li>Monitor and analyze trends, usage, and activities</li>
                    </ul>

                    <h2>3. Sharing of Information</h2>
                    <p>We may share your information with:</p>
                    <ul>
                        <li><strong>Service Providers:</strong> Licensed {niche.name.toLowerCase()} contractors in your area to fulfill service requests</li>
                        <li><strong>Business Partners:</strong> Trusted third parties who assist in our operations</li>
                        <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                    </ul>
                    <p>We do not sell your personal information to third parties for marketing purposes.</p>

                    <h2>4. Data Security</h2>
                    <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration, and destruction. This includes:</p>
                    <ul>
                        <li>Encryption of data in transit and at rest</li>
                        <li>Secure server infrastructure</li>
                        <li>Regular security assessments</li>
                        <li>Employee training on data protection</li>
                    </ul>

                    <h2>5. Cookies and Tracking</h2>
                    <p>We use cookies and similar technologies to:</p>
                    <ul>
                        <li>Remember your preferences</li>
                        <li>Analyze website traffic and usage</li>
                        <li>Improve our services and user experience</li>
                    </ul>
                    <p>You can control cookies through your browser settings.</p>

                    <h2>6. Your Rights</h2>
                    <p>Depending on your location, you may have rights to:</p>
                    <ul>
                        <li><strong>Access:</strong> Request a copy of your personal data</li>
                        <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                        <li><strong>Deletion:</strong> Request deletion of your data</li>
                        <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                    </ul>

                    <h2>7. California Privacy Rights (CCPA)</h2>
                    <p>If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):</p>
                    <ul>
                        <li>Right to know what personal information is collected</li>
                        <li>Right to know if personal information is sold or disclosed</li>
                        <li>Right to say no to the sale of personal information</li>
                        <li>Right to equal service and price</li>
                    </ul>
                    <p>To exercise these rights, contact us using the information below.</p>

                    <h2>8. Children&apos;s Privacy</h2>
                    <p>Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.</p>

                    <h2>9. Changes to This Policy</h2>
                    <p>We may update this Privacy Policy from time to time. We will notify you of changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.</p>

                    <h2>10. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
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
