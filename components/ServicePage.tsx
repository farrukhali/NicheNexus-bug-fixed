import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getSEOContent } from '@/lib/seo-content'
import RelatedServices from '@/components/RelatedServices'
import { CallBtn, NavbarCallBtn } from '@/components/CallBtn'
import CoverageStats from '@/components/CoverageStats'
import Breadcrumb from '@/components/Breadcrumb'
import CityMap from '@/components/CityMap'
import InternalLinks from '@/components/InternalLinks'
import TrustBadges from '@/components/TrustBadges'
import AuthoritySignals from '@/components/AuthoritySignals'
import TopBusinesses from '@/components/TopBusinesses'
import { getSiteConfig } from '@/lib/site-config'
import { getNicheConfig } from '@/lib/niche-configs'
import JsonLdSchema from '@/components/seo/JsonLdSchema'
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema'
import { replacePlaceholders } from '@/lib/seo-utils'
import { getWeatherData } from '@/lib/weather'
import { getNeighborhoods } from '@/lib/data-fetching'
import NeighborhoodSection from '@/components/NeighborhoodSection'
import WeatherWidget from '@/components/WeatherWidget'
import LocalReviews from '@/components/LocalReviews'
import RecentActivity from '@/components/RecentActivity'
import SeasonalTip from '@/components/SeasonalTip'

interface ServicePageProps {
    city: string
    state: string
    stateCode: string
    zipCodes?: string[]
    relatedCities?: {
        city: string
        state_id: string
    }[]
    latitude?: number
    longitude?: number
    customIntro?: string
}

export default async function ServicePage({ city, state, stateCode, zipCodes, relatedCities, latitude, longitude, customIntro }: ServicePageProps) {
    const siteConfig = await getSiteConfig()
    const niche = await getNicheConfig(siteConfig.nicheSlug)

    const formattedCity = city.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    const formattedState = state.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

    // Generate Dynamic SEO Content
    const content = await getSEOContent(formattedCity, formattedState, stateCode)

    // Fetch local weather data
    const weather = await getWeatherData(latitude, longitude, formattedCity, stateCode)

    const placeholderVars = {
        city: formattedCity,
        state: formattedState,
        stateCode: stateCode,
        niche: niche.name
    }

    // Fetch neighborhood data
    const neighborhoodData = await getNeighborhoods(formattedCity, stateCode)

    if (customIntro) {
        content.intro = replacePlaceholders(customIntro, placeholderVars)
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
            <LocalBusinessSchema
                city={formattedCity}
                state={formattedState}
                stateCode={stateCode}
                zipCodes={zipCodes}
                latitude={latitude}
                longitude={longitude}
                serviceName={niche.primaryService}
                siteConfig={siteConfig}
            />

            {/* Navigation */}
            <Navbar siteConfig={siteConfig} />


            {/* Hero Section */}
            <header className="relative pt-32 pb-24 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900 via-slate-900 to-black opacity-95"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left">
                        <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-blue-400/30 bg-blue-500/10 backdrop-blur-sm text-blue-300 text-sm font-semibold uppercase tracking-wider">
                            #1 Rated in {stateCode.toUpperCase()}
                        </div>
                        <h1 className="text-4xl md:text-[3.5rem] font-extrabold text-white mb-8 leading-tight tracking-tight">
                            {content.h1Title}
                        </h1>
                        <div className="text-lg md:text-xl text-slate-300 mb-10 font-light space-y-4">
                            <p dangerouslySetInnerHTML={{ __html: content.intro.replace(/\*\*(.*?)\*\*/g, '<span class="text-white font-medium">$1</span>') }} />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                            <CallBtn className="py-4 px-10 text-lg w-full sm:w-auto transform hover:scale-105" label="Call Now" showNumber={true} />
                            <Link href="#cities" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold py-4 px-10 rounded-full text-lg transition-all w-full sm:w-auto text-center">
                                View Locations
                            </Link>
                        </div>
                    </div>

                    {/* Hero Image - Right Side */}
                    {niche.cityHeroImage && (
                        <div className="hidden lg:block relative">
                            <div className="relative w-full aspect-[4/3] max-w-lg mx-auto">
                                <div className="absolute inset-0 bg-blue-500 rounded-3xl mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                                <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                                    <img
                                        src={niche.cityHeroImage}
                                        alt={`${niche.name} in ${formattedCity}`}
                                        className="w-full h-full object-contain bg-slate-900"
                                    />
                                </div>
                                {weather && (
                                    <div className="mt-6">
                                        <WeatherWidget city={formattedCity} weather={weather} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <Breadcrumb items={[
                { label: formattedState, href: `/${stateCode.toLowerCase()}` },
                { label: formattedCity, href: `/${stateCode.toLowerCase()}/${city.toLowerCase()}` }
            ]} />

            <CoverageStats />
            <AuthoritySignals stateCode={stateCode} city={formattedCity} />
            <RelatedServices city={formattedCity} state={stateCode} />

            {/* LOCAL EXPERTS "NEAR ME" SEO SECTION */}
            <section className="py-20 px-6 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Local Experts Serving {formattedCity} &amp; Surrounding Areas
                        </h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            When you search for <strong>{niche.primaryService.toLowerCase()} near me in {formattedCity}</strong>, you deserve contractors who truly understand your local area. Our {stateCode.toUpperCase()}-based crews have served thousands of homeowners across {formattedCity} and the surrounding communities.
                        </p>
                    </div>

                    {/* Two Column Cards */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* Neighborhoods Card */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">🏘️</span>
                                <h3 className="text-xl font-bold text-slate-900">Neighborhoods We Serve in {formattedCity}</h3>
                            </div>
                            <p className="text-slate-600 mb-4">
                                Our <strong>{niche.name.toLowerCase()} near me in {formattedCity}</strong> specialists cover all residential zones including downtown, suburbs, and rural properties. We understand the drainage challenges and property coverage in your community.
                            </p>
                            <p className="text-slate-600">
                                We also serve surrounding {stateCode.toUpperCase()} communities within a 30-mile radius. Looking for <strong>{niche.name.toLowerCase()} contractors near me</strong> outside city limits? Our crews regularly travel to nearby towns to provide the same quality service.
                            </p>
                        </div>

                        {/* Climate-Specific Card */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">🌤️</span>
                                <h3 className="text-xl font-bold text-slate-900">{stateCode.toUpperCase()} Climate-Ready Solutions</h3>
                            </div>
                            <p className="text-slate-600 mb-4">
                                {stateCode.toUpperCase()} homeowners face unique weather challenges: {stateCode.toUpperCase()} weather requires {niche.name.toLowerCase()} solutions that can withstand local conditions. We use climate-appropriate materials and installation techniques. Local <strong>{niche.name.toLowerCase()} companies near me</strong> understand these unique challenges.
                            </p>
                            <p className="text-slate-600">
                                That&apos;s why our <strong>{niche.primaryService.toLowerCase()} near me</strong> specialists design systems specifically engineered for local climate conditions. We recommend premium materials that handle {stateCode.toUpperCase()}&apos;s weather—get protected today.
                            </p>
                        </div>
                    </div>

                    {/* Why Choose Us Section */}
                    <div className="bg-blue-50 rounded-2xl p-8 mb-12">
                        <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                            Why {formattedCity} Homeowners Choose Us for <span className="text-blue-600">{niche.name}</span>
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="text-2xl mb-3">🔧</div>
                                <h4 className="font-bold text-slate-900 mb-2">Full-Service Solutions</h4>
                                <p className="text-sm text-slate-600">
                                    From <strong>{niche.services[0]?.title?.toLowerCase() || 'installation'}</strong> to <strong>{niche.services[1]?.title?.toLowerCase() || 'repairs'}</strong>, we handle everything. Complete {niche.name.toLowerCase()} solutions for your {formattedCity} property.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="text-2xl mb-3">⭐</div>
                                <h4 className="font-bold text-slate-900 mb-2">Trusted Local Reputation</h4>
                                <p className="text-sm text-slate-600">
                                    With thousands of completed projects across {stateCode.toUpperCase()}, we&apos;re the <strong>{niche.name.toLowerCase()} company near me</strong> that {formattedCity} residents recommend.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="text-2xl mb-3">💰</div>
                                <h4 className="font-bold text-slate-900 mb-2">Transparent Local Pricing</h4>
                                <p className="text-sm text-slate-600">
                                    When you search for <strong>{niche.primaryService.toLowerCase()} cost</strong>, you&apos;ll find our {formattedCity} pricing is competitive and straightforward—no hidden fees, no upsells.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA with Service Links */}
                    <div className="text-center">
                        <p className="text-lg text-slate-700 mb-6">
                            Ready to get started with a <strong>{niche.primaryService.toLowerCase()} near me in {formattedCity}</strong>? Contact our local team today for a free, no-obligation estimate.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {niche.services.slice(0, 4).map((service, i) => (
                                <a
                                    key={i}
                                    href={`/${stateCode.toLowerCase()}/${city.toLowerCase()}/${service.slug}`}
                                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${i === 0
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                        }`}
                                >
                                    {service.title} {i === 0 ? formattedCity : 'Near Me'}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Neighborhoods Section */}
            {neighborhoodData && (
                <NeighborhoodSection data={neighborhoodData} />
            )}


            {/* Local Content Section */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                            Why {formattedCity} Homeowners Trust {siteConfig.siteName}
                        </h2>
                        <div className="text-lg text-slate-600 mb-6 leading-relaxed space-y-4">
                            <p dangerouslySetInnerHTML={{ __html: content.whyChoose.replace(/\*\*(.*?)\*\*/g, '<span class="text-slate-900 font-semibold">$1</span>') }} />
                            <p dangerouslySetInnerHTML={{ __html: content.materials.replace(/\*\*(.*?)\*\*/g, '<span class="text-slate-900 font-semibold">$1</span>') }} />
                        </div>

                        <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 mb-4">
                            <p className="text-sm text-slate-700 font-semibold mb-1">📐 Technical Specifications</p>
                            <p className="text-sm text-slate-600" dangerouslySetInnerHTML={{ __html: content.technicalSpecs.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        </div>

                        <p className="text-sm text-amber-700">{content.climateConsiderations}</p>
                    </div>

                    {/* Dynamic Activity Feed */}
                    <div className="grid gap-6 mb-8">
                        <RecentActivity
                            city={formattedCity}
                            stateCode={stateCode}
                            serviceName={niche.primaryService}
                            zipCodes={zipCodes}
                        />
                        <SeasonalTip />
                    </div>

                    <CityMap city={formattedCity} state={stateCode} />
                </div>

            </section>

            {/* Trust & Credibility Section - NEW SEO SECTION */}
            <section className="py-20 px-6 bg-gradient-to-b from-white to-blue-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">Trusted by {formattedCity} Residents</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Your Local {niche.name} Partner in {formattedCity}, {stateCode.toUpperCase()}
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            We&apos;re committed to providing {formattedCity} homeowners with exceptional {niche.name.toLowerCase()} services backed by experience, quality, and trust.
                        </p>
                    </div>

                    {/* Trust Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                        <div className="bg-white p-6 rounded-2xl shadow-lg text-center border border-slate-100 hover:border-blue-200 transition-all">
                            <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">15+</div>
                            <p className="text-slate-600 font-medium">Years Serving {stateCode.toUpperCase()}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-lg text-center border border-slate-100 hover:border-blue-200 transition-all">
                            <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">5,000+</div>
                            <p className="text-slate-600 font-medium">Homes Served</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-lg text-center border border-slate-100 hover:border-blue-200 transition-all">
                            <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">4.9★</div>
                            <p className="text-slate-600 font-medium">Customer Rating</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-lg text-center border border-slate-100 hover:border-blue-200 transition-all">
                            <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">100%</div>
                            <p className="text-slate-600 font-medium">Satisfaction Guarantee</p>
                        </div>
                    </div>

                    {/* Service Guarantees */}
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-4">✅</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Licensed & Insured</h3>
                            <p className="text-slate-600">Fully licensed contractors with comprehensive insurance coverage protecting your {formattedCity} home and property.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4">🏆</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Quality Workmanship</h3>
                            <p className="text-slate-600">We use only premium materials and proven techniques for every {niche.name.toLowerCase()} project in {formattedCity}.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                            <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center text-2xl mb-4">⚡</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Fast Response Time</h3>
                            <p className="text-slate-600">Same-day service available throughout {formattedCity} and surrounding {stateCode.toUpperCase()} communities.</p>
                        </div>
                    </div>

                    {/* Our Commitment */}
                    <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-4">Our Commitment to {formattedCity} Homeowners</h3>
                                <p className="text-blue-200 mb-6">When you choose us for your {niche.name.toLowerCase()} needs, you&apos;re choosing a partner dedicated to your complete satisfaction.</p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-400 mt-1">✓</span>
                                        <span>Free, no-obligation estimates for {formattedCity} residents</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-400 mt-1">✓</span>
                                        <span>Transparent pricing with no hidden fees</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-400 mt-1">✓</span>
                                        <span>Written warranties on all workmanship</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-400 mt-1">✓</span>
                                        <span>Clean job sites - we respect your property</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-400 mt-1">✓</span>
                                        <span>24/7 emergency services available in {stateCode.toUpperCase()}</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="text-center">
                                <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                                    <div className="text-5xl mb-4">🛡️</div>
                                    <p className="text-xl font-bold mb-2">Satisfaction Guaranteed</p>
                                    <p className="text-blue-200 text-sm">If you&apos;re not 100% satisfied, we&apos;ll make it right.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >


            <LocalReviews
                city={formattedCity}
                state={formattedState}
                serviceName={niche.primaryService}
                siteConfig={siteConfig}
                latitude={latitude}
            />

            {/* FAQ Section */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {(niche.city_faqs && niche.city_faqs.length > 0 ? niche.city_faqs : niche.faqs).map((faq, i) => (
                            <details key={i} className="group bg-white p-6 rounded-2xl border border-slate-200 open:border-blue-200 open:ring-1 open:ring-blue-200 transition-all">
                                <summary className="flex justify-between items-center font-semibold cursor-pointer list-none text-slate-800">
                                    <span>{replacePlaceholders(faq.question, placeholderVars)}</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <p className="text-slate-600 mt-4 leading-relaxed group-open:animate-fadeIn">
                                    {replacePlaceholders(faq.answer, placeholderVars)}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 bg-slate-900 text-center text-white relative overflow-hidden">
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to get started in {formattedCity}?</h2>
                    <p className="text-xl text-blue-200 mb-10">Connect with local {niche.name.toLowerCase()} experts today for a free, no-obligation quote.</p>
                    <CallBtn className="py-4 px-12 text-xl" label="Get Free Quote" />
                </div>
            </section>

            <InternalLinks currentCity={formattedCity} stateCode={stateCode} relatedCities={relatedCities} />
            <TrustBadges />
            <Footer city={formattedCity} stateCode={stateCode} />
        </div >
    )
}
