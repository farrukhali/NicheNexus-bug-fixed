import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import TrustBadges from '@/components/TrustBadges'
import { NavbarCallBtn } from '@/components/CallBtn'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import RelatedServices from '@/components/RelatedServices'
import { getSiteConfig } from '@/lib/site-config'
import { getNicheConfig } from '@/lib/niche-configs'
import { replacePlaceholders } from '@/lib/seo-utils'
import { getSEOContent } from '@/lib/seo-content'

export const revalidate = 60 // Refresh content every minute

interface StatePageProps {
    params: Promise<{
        state: string
    }>
}

// Fetch cities for a state
async function getStateData(stateCode: string) {
    const { data, error } = await supabase
        .from('usa city name')
        .select('city, state_name, state_id, zips') // REQUEST ZIPS
        .ilike('state_id', stateCode)
        .order('city', { ascending: true })

    if (error) {
        console.error('Error fetching state cities:', error)
        return null
    }
    return data
}

export async function generateMetadata(props: StatePageProps): Promise<Metadata> {
    const params = await props.params
    const stateCode = params.state.toUpperCase()
    const siteConfig = await getSiteConfig()
    // const niche = await getNicheConfig(siteConfig.nicheSlug) // Removed unused

    // Fetch state name optimization (limit 1)
    const { data: cityData } = await supabase
        .from('usa city name')
        .select('state_name')
        .ilike('state_id', stateCode)
        .limit(1)
        .single()

    const stateName = cityData?.state_name || stateCode

    const seo = await getSEOContent({
        city: '',
        state: stateName,
        stateCode: stateCode,
        pageType: 'state'
    })

    return {
        title: seo.metaTitle,
        description: seo.metaDescription,
        keywords: `${(seo.metaKeywords || []).join(', ')}, ${stateName}, ${stateCode}`,
        alternates: {
            canonical: `https://${siteConfig.domain}/${params.state.toLowerCase()}`
        },
        openGraph: {
            title: seo.metaTitle,
            description: seo.metaDescription,
            url: `https://${siteConfig.domain}/${params.state.toLowerCase()}`,
            type: 'website',
            images: siteConfig.seoSettings?.og_image_url ? [siteConfig.seoSettings.og_image_url] : [],
        }
    }
}

// Pre-generate all state pages at build time (SSG)
export async function generateStaticParams() {
    const { data } = await supabase
        .from('usa city name')
        .select('state_id')
        .limit(100)

    if (!data) return []

    // Deduplicate states
    const uniqueStates = Array.from(
        new Set(data.map(item => item.state_id.toLowerCase()))
    )

    return uniqueStates.map(state => ({
        state: state
    }))
}

export default async function StatePage(props: StatePageProps) {
    const params = await props.params
    const stateCode = params.state

    // Fetch data
    const cities = await getStateData(stateCode)

    if (!cities || cities.length === 0) {
        return notFound()
    }

    const stateName = cities[0].state_name
    const siteConfig = await getSiteConfig()
    const niche = await getNicheConfig(siteConfig.nicheSlug)
    const seo = await getSEOContent({
        city: '',
        state: stateName,
        stateCode: stateCode,
        pageType: 'state'
    })

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white flex flex-col">
            {/* Header / Hero */}
            <header className="relative py-24 px-6 overflow-hidden bg-slate-900">
                <Navbar siteConfig={siteConfig} />

                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900 via-slate-900 to-black opacity-95"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-48 -left-24 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center text-white">
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-blue-400/30 bg-blue-500/10 backdrop-blur-sm text-blue-300 text-sm font-semibold uppercase tracking-wider">
                        Serving All of {stateName}
                    </div>
                    <h1 className="text-5xl md:text-[4rem] font-extrabold mb-6 tracking-tight">
                        {seo.h1Title}
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                        Find your local expert. We provide professional {niche.name.toLowerCase()} and related services across {cities.length} cities in {stateCode.toUpperCase()}.
                    </p>

                    <div className="mt-8 flex justify-center gap-4">
                        <Link href="/" className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-sm font-medium">
                            &larr; View All States
                        </Link>
                    </div>
                </div>
            </header>

            <Breadcrumb items={[
                { label: stateName, href: `/${params.state.toLowerCase()}` }
            ]} />

            <RelatedServices state={stateName} />

            <main className="max-w-7xl mx-auto py-16 px-6 relative z-20 -mt-10 mb-auto">
                <section id="cities">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Select Your City</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Find top-rated {niche.name.toLowerCase()} pros in {cities.length} {stateName} locations.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {cities.map((city, index) => {
                            const citySlug = city.city.trim().toLowerCase().replace(/\s+/g, '-')
                            const primaryZip = city.zips ? city.zips.split(' ')[0] : ''

                            return (
                                <Link
                                    key={index}
                                    href={`/${city.state_id.toLowerCase()}/${citySlug}`}
                                    className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{primaryZip}</span>
                                        <span className="font-semibold text-slate-700 group-hover:text-slate-900 text-sm md:text-base line-clamp-1" title={city.city}>
                                            {city.city}
                                        </span>
                                    </div>
                                    <div className="text-slate-300 group-hover:text-blue-500 transition-colors">
                                        &rarr;
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="mt-20 text-center max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12">Why Choose {siteConfig.siteName} in {stateName}?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <div className="text-4xl mb-4">🛡️</div>
                            <h3 className="font-bold text-lg mb-2">Local Experts</h3>
                            <p className="text-slate-600 text-sm">Our teams are based right here in {stateName}, understanding local {niche.name.toLowerCase()} and service needs.</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <div className="text-4xl mb-4">⚡</div>
                            <h3 className="font-bold text-lg mb-2">Fast Response</h3>
                            <p className="text-slate-600 text-sm">Same-day estimates available for most {stateName} zip codes.</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <div className="text-4xl mb-4">⭐</div>
                            <h3 className="font-bold text-lg mb-2">Top Rated</h3>
                            <p className="text-slate-600 text-sm">Consistently rated 5-stars by homeowners across the state.</p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="mt-20 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Common Questions in {stateName}</h2>
                    <div className="space-y-4">
                        {(niche.state_faqs && niche.state_faqs.length > 0 ? niche.state_faqs : niche.faqs).map((faq, i) => (
                            <details key={i} className="group bg-white p-6 rounded-2xl border border-slate-200 open:border-blue-200 open:ring-1 open:ring-blue-200 transition-all">
                                <summary className="flex justify-between items-center font-semibold cursor-pointer list-none text-slate-800">
                                    <span>{replacePlaceholders(faq.question, { state: stateName, stateCode, service: niche.primaryService })}</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <p className="text-slate-600 mt-4 leading-relaxed group-open:animate-fadeIn">
                                    {replacePlaceholders(faq.answer, { state: stateName, stateCode, service: niche.primaryService })}
                                </p>
                            </details>
                        ))}
                    </div>
                </section>
            </main>

            <div className="max-w-3xl mx-auto mt-20 text-center text-slate-500 text-sm">
                <p className="mb-4">
                    Listing {cities.length} cities in {cities[0].state_name}
                </p>
            </div>


            <TrustBadges />
            <Footer stateCode={stateCode} />
        </div >
    )
}
