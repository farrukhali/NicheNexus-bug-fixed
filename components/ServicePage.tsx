import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'
import { getSEOContent } from '@/lib/seo-content'
import RelatedServices from '@/components/RelatedServices'
import TrustBadges from '@/components/TrustBadges'
import { CallBtn, FloatingCallBtn, NavbarCallBtn } from '@/components/CallBtn'
import CoverageStats from '@/components/CoverageStats'
import Breadcrumb from '@/components/Breadcrumb'
import CityMap from '@/components/CityMap'
import InternalLinks from '@/components/InternalLinks'

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
}

export default function ServicePage({ city, state, stateCode, zipCodes, relatedCities, latitude, longitude }: ServicePageProps) {
    const formattedCity = city.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    const formattedState = state.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

    // Generate Dynamic SEO Content with state code for climate-specific messaging
    const content = getSEOContent(formattedCity, formattedState, stateCode)

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-500 selection:text-white">

            {/* Navigation (Transparent Glass) */}
            <nav className="fixed w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-500">
                        US Gutter Installation
                    </Link>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
                            <Link href="/" className="hover:text-blue-600 transition-colors">Locations</Link>
                            <Link href="/about" className="hover:text-blue-600 transition-colors">About</Link>
                            <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
                        </div>
                        <NavbarCallBtn />
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-24 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900 via-slate-900 to-black opacity-95"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-48 -left-24 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text */}
                    <div className="text-center lg:text-left">
                        <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-blue-400/30 bg-blue-500/10 backdrop-blur-sm text-blue-300 text-sm font-semibold uppercase tracking-wider">
                            #1 Rated in {stateCode.toUpperCase()}
                        </div>
                        <h1 className="text-5xl md:text-[4rem] font-extrabold text-white mb-8 leading-tight tracking-tight">
                            Gutter Installation, Cleaning & Repair in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{formattedCity}, {stateCode.toUpperCase()} Near Me</span>
                        </h1>
                        <div className="text-xl md:text-2xl text-slate-300 mb-10 font-light space-y-4">
                            <p dangerouslySetInnerHTML={{ __html: content.intro.replace(/\*\*(.*?)\*\*/g, '<span class="text-white font-medium">$1</span>') }} />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                            <CallBtn className="py-4 px-10 text-lg w-full sm:w-auto transform hover:scale-105" label="Call Now" showNumber={true} />
                            <Link href="#cities" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold py-4 px-10 rounded-full text-lg transition-all w-full sm:w-auto text-center">
                                View Locations
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Image */}
                    <div className="relative hidden lg:block">
                        <div className="relative w-full aspect-square max-w-lg mx-auto">
                            {/* Decorative blob behind image */}
                            <div className="absolute inset-0 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>

                            <Image
                                src="/gutter-installation-hero.png"
                                alt="Premium Gutter Installation"
                                width={600}
                                height={600}
                                className="relative z-10 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </header>

            <Breadcrumb items={[
                { label: state, href: `/${stateCode}` },
                { label: formattedCity, href: `/${stateCode}/${city}` }
            ]} />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "HomeAndConstructionBusiness",
                        "name": `US Gutter Installation ${formattedCity}`,
                        "image": "https://usgutterinstallation.com/og-image.jpg",
                        "url": `https://usgutterinstallation.com/${stateCode}/${city}`,
                        "telephone": "+18588985338",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": formattedCity,
                            "addressRegion": stateCode,
                            "addressCountry": "US"
                        },
                        "geo": {
                            "@type": "GeoCircle",
                            "geoMidpoint": {
                                "@type": "GeoCoordinates",
                                "latitude": latitude || "37.0902",
                                "longitude": longitude || "-95.7129"
                            },
                            "geoRadius": "50000"
                        },
                        "priceRange": "$$",
                        "openingHoursSpecification": [
                            {
                                "@type": "OpeningHoursSpecification",
                                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                                "opens": "07:00",
                                "closes": "20:00"
                            }
                        ]
                    })
                }}
            />

            <CoverageStats />

            <RelatedServices city={formattedCity} state={stateCode} />

            {/* Features Grid */}
            <section className="py-24 px-6 bg-white relative z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8 -mt-32">
                        {[
                            { title: "Seamless Technology", desc: "Custom-fit on-site to eliminate leaks and improve aesthetics.", icon: "🔧" },
                            { title: "Gutter Guards", desc: "Advanced micro-mesh protection to keep leaves and debris out forever.", icon: "🛡️" },
                            { title: "Lifetime Warranty", desc: "We stand behind our materials and craftsmanship 100%.", icon: "✅" }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-blue-100 transition-all hover:-translate-y-1">
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-3 text-slate-800">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Local Content Section */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                            Why {formattedCity} Homeowners Trust Us
                        </h2>
                        <div className="text-lg text-slate-600 mb-6 leading-relaxed space-y-4">
                            <p dangerouslySetInnerHTML={{ __html: content.whyChoose.replace(/\*\*(.*?)\*\*/g, '<span class="text-slate-900 font-semibold">$1</span>') }} />
                            <p dangerouslySetInnerHTML={{ __html: content.materials.replace(/\*\*(.*?)\*\*/g, '<span class="text-slate-900 font-semibold">$1</span>') }} />
                        </div>

                        {/* Technical Specs Box */}
                        <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 mb-4">
                            <p className="text-sm text-slate-700 font-semibold mb-1">📐 Technical Specifications</p>
                            <p className="text-sm text-slate-600" dangerouslySetInnerHTML={{ __html: content.technicalSpecs.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        </div>

                        {/* Climate Considerations */}
                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 mb-6">
                            <p className="text-sm text-amber-800 font-semibold mb-1">🌤️ {stateCode.toUpperCase()} Climate Considerations</p>
                            <p className="text-sm text-amber-700">{content.climateConsiderations}</p>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {['Licensed & Insured in ' + stateCode.toUpperCase(), '5-Star Google Rated', 'Same-Day Quotes Available'].map((item, i) => (
                                <li key={i} className="flex items-center text-slate-700 font-medium">
                                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 text-sm">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        {/* Dynamic Map Placeholder */}
                        <CityMap city={formattedCity} state={stateCode} />
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-4">
                            <p className="text-sm text-blue-800 font-semibold mb-1">Service Area Coverage</p>
                            <div className="text-blue-600">
                                We cover all neighborhoods in <span className="underline">{formattedCity}</span> and surrounding {stateCode.toUpperCase()} counties.
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-3xl transform rotate-3 opacity-20"></div>
                        <div className="relative bg-white p-2 rounded-3xl shadow-2xl">
                            <div className="aspect-[4/3] bg-slate-200 rounded-2xl flex items-center justify-center overflow-hidden relative">
                                <Image
                                    src="/gutter-crew-local.jpeg"
                                    alt={`Gutter installation in ${formattedCity}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                                    <p className="font-medium text-lg">Local Project: {formattedCity}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Zip Codes Section */}
            {zipCodes && zipCodes.length > 0 && (
                <section className="py-16 px-6 bg-white border-y border-slate-100">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                            Popular Zip Codes in {formattedCity}
                        </h2>
                        <div className="flex flex-wrap justify-center gap-3">
                            {zipCodes.map((zip, i) => (
                                <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:border-blue-300 hover:text-blue-600 transition-colors cursor-default">
                                    {zip}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Nearby Cities Section */}
            {relatedCities && relatedCities.length > 0 && (
                <section className="py-16 px-6 bg-slate-50 border-b border-slate-200">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">
                            Gutter Installation Near Me in Other {stateCode.toUpperCase()} Cities
                        </h2>
                        <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">
                            Looking for <strong>gutter contractors near me</strong> outside {formattedCity}? We serve these nearby {stateCode.toUpperCase()} communities with the same quality service.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {relatedCities.map((cityData, i) => (
                                <Link
                                    key={i}
                                    href={`/${cityData.state_id.toLowerCase()}/${cityData.city.toLowerCase().replace(/ /g, '-')}`}
                                    className="block p-3 bg-white rounded-lg shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all text-center text-slate-700 font-medium hover:text-blue-600"
                                    title={`Gutter Installation in ${cityData.city}, ${cityData.state_id}`}
                                >
                                    <span className="block text-xs text-slate-400 mb-1">Gutter Services</span>
                                    {cityData.city}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Services Detailed Section */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                            Complete Gutter Solutions in {formattedCity}
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            {content.serviceDesc.replace(/\*\*(.*?)\*\*/g, '$1')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                title: "Seamless Gutter Installation",
                                desc: "Custom-fabricated on-site to fit your home perfectly. No seams means no leaks. Available in aluminum, copper, and steal.",
                                bg: "bg-blue-50", text: "text-blue-600"
                            },
                            {
                                title: "Gutter Guards & Protection",
                                desc: "Stop cleaning your gutters forever. We install premium micro-mesh guards that block pine needles, leaves, and roof grit.",
                                bg: "bg-green-50", text: "text-green-600"
                            },
                            {
                                title: "Gutter Repair & Realignment",
                                desc: "Fixing sagging, leaking, or detached gutters. We replace hangers, reseal corners, and adjust pitch for proper flow.",
                                bg: "bg-orange-50", text: "text-orange-600"
                            },
                            {
                                title: "Downspout Extensions",
                                desc: "Protect your foundation by moving water away from your home. We install buried drains and strategic extensions.",
                                bg: "bg-purple-50", text: "text-purple-600"
                            }
                        ].map((service, i) => (
                            <div key={i} className="flex gap-6 p-8 rounded-2xl bg-white border border-slate-100 hover:shadow-xl transition-shadow group">
                                <div className={`w-16 h-16 rounded-xl ${service.bg} ${service.text} flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform`}>
                                    {['🏠', '🛡️', '🔧', '💧'][i]}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{service.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Process Section */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                            How It Works
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            {content.processIntro}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 hidden md:block"></div>

                        {[
                            { step: "01", title: "Request Quote", desc: "Fill out our simple form. We'll contact you within 24 hours to schedule a quick measurement." },
                            { step: "02", title: "Custom Fabrication", desc: "We arrive with our rolling gutter machine and craft your gutters right in your driveway." },
                            { step: "03", title: "Professional Install", desc: "Most jobs are completed in just one day. We clean up thoroughly and haul away old materials." }
                        ].map((step, i) => (
                            <div key={i} className="bg-white p-8 pt-0 text-center">
                                <div className="w-20 h-20 mx-auto bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-200 mb-8 relative z-10">
                                    {step.step}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
                                <p className="text-slate-600">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Local Expertise Section - Added for SEO */}
            <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Local Gutter Experts Serving {formattedCity} & Surrounding Areas
                        </h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            When you search for <strong>gutter installation near me in {formattedCity}</strong>, you deserve contractors who truly understand your local area. Our {stateCode.toUpperCase()}-based crews have served thousands of homeowners across {formattedCity} and the surrounding communities.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* Local Service Area */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">
                                🏠 Neighborhoods We Serve in {formattedCity}
                            </h3>
                            <p className="text-slate-600 mb-4">
                                Our <strong>gutter contractors near me in {formattedCity}</strong> cover all residential and commercial areas including downtown {formattedCity}, historic districts, new developments, and rural properties. Whether you live in an established neighborhood or a newly built subdivision, we bring our mobile gutter fabrication equipment directly to your driveway.
                            </p>
                            <p className="text-slate-600">
                                We also serve surrounding {stateCode.toUpperCase()} communities within a 30-mile radius. Looking for <strong>seamless gutters near me</strong> outside city limits? Our crews regularly travel to nearby towns to provide the same quality service at competitive rates.
                            </p>
                        </div>

                        {/* Climate Expertise */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">
                                🌤️ {stateCode.toUpperCase()} Climate-Ready Gutter Systems
                            </h3>
                            <p className="text-slate-600 mb-4">
                                {stateCode.toUpperCase()} homeowners face unique weather challenges: {content.climateConsiderations}. That's why our <strong>gutter installation near me</strong> specialists design systems specifically engineered for local conditions—not generic one-size-fits-all solutions.
                            </p>
                            <p className="text-slate-600">
                                We recommend <strong>gutter guards near me</strong> installations that handle {stateCode.toUpperCase()}'s debris types, from leaves and pine needles to roof shingle grit. Our micro-mesh systems prevent clogs year-round, eliminating the need for dangerous ladder cleaning.
                            </p>
                        </div>
                    </div>

                    {/* Additional Local Content */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 mb-8">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">
                            Why {formattedCity} Homeowners Choose Us for <span className="text-blue-600">Gutter Services Near Me</span>
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <h4 className="font-bold text-slate-800 mb-2">🔧 Full-Service Solutions</h4>
                                <p className="text-slate-600 text-sm">
                                    From <strong>seamless gutter installation near me</strong> to <strong>gutter repair near me</strong>, we handle everything: gutter guards, downspout extensions, soffit and fascia repair, and emergency storm damage restoration.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 mb-2">⭐ Trusted Local Reputation</h4>
                                <p className="text-slate-600 text-sm">
                                    With thousands of completed projects across {stateCode.toUpperCase()}, we're the <strong>gutter company near me</strong> that {formattedCity} residents recommend to neighbors and friends. Check our verified 5-star reviews online.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 mb-2">💰 Transparent Local Pricing</h4>
                                <p className="text-slate-600 text-sm">
                                    When you search for <strong>gutter installation near me cost</strong>, you'll find our {formattedCity} pricing is competitive and straightforward—no hidden fees, no upsells, just honest quotes with lifetime warranties included.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Service Links with Strong Anchor Text */}
                    <div className="text-center">
                        <p className="text-slate-600 mb-4">
                            Ready to get started with a <strong>gutter installation near me in {formattedCity}</strong>? Contact our local team today for a free, no-obligation estimate on any of our services.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <Link href={`/${stateCode.toLowerCase()}/${city}/seamless-gutter-installation`} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
                                Seamless Gutters in {formattedCity}
                            </Link>
                            <Link href={`/${stateCode.toLowerCase()}/${city}/gutter-guards-leaf-protection`} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
                                Gutter Guards Near Me
                            </Link>
                            <Link href={`/${stateCode.toLowerCase()}/${city}/soffit-fascia-repair`} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
                                Soffit & Fascia Repair
                            </Link>
                            <Link href={`/${stateCode.toLowerCase()}/${city}/emergency-gutter-repair`} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
                                Emergency Repairs
                            </Link>
                            {/* Structured Data: FAQ + LocalBusiness + Breadcrumb */}
                            <script
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{
                                    __html: JSON.stringify([
                                        {
                                            "@context": "https://schema.org",
                                            "@type": "FAQPage",
                                            "mainEntity": content.faqAnswers ? [
                                                {
                                                    "@type": "Question",
                                                    "name": `How much does gutter installation cost in ${formattedCity}?`,
                                                    "acceptedAnswer": { "@type": "Answer", "text": content.faqAnswers.cost }
                                                },
                                                {
                                                    "@type": "Question",
                                                    "name": `What are the best gutter guards for ${stateCode} weather?`,
                                                    "acceptedAnswer": { "@type": "Answer", "text": content.faqAnswers.bestGuard }
                                                },
                                                {
                                                    "@type": "Question",
                                                    "name": `How long does gutter installation take in ${formattedCity}?`,
                                                    "acceptedAnswer": { "@type": "Answer", "text": content.faqAnswers.timeline }
                                                },
                                                {
                                                    "@type": "Question",
                                                    "name": `How often should I clean my gutters in ${formattedCity}?`,
                                                    "acceptedAnswer": { "@type": "Answer", "text": content.faqAnswers.cleaningFrequency }
                                                },
                                                {
                                                    "@type": "Question",
                                                    "name": `Do you offer emergency gutter repair in ${formattedCity}?`,
                                                    "acceptedAnswer": { "@type": "Answer", "text": content.faqAnswers.emergency }
                                                },
                                                {
                                                    "@type": "Question",
                                                    "name": `Do you repair soffit and fascia boards?`,
                                                    "acceptedAnswer": { "@type": "Answer", "text": content.faqAnswers.soffitFascia }
                                                },
                                                {
                                                    "@type": "Question",
                                                    "name": `Do you offer warranties on gutter installation?`,
                                                    "acceptedAnswer": { "@type": "Answer", "text": content.faqAnswers.warranty }
                                                }
                                            ] : []
                                        },
                                        {
                                            "@context": "https://schema.org",
                                            "@type": "HomeAndConstructionBusiness",
                                            "name": `US Gutter Installation ${formattedCity}`,
                                            "image": "https://usgutterinstallation.com/og-image.jpg",
                                            "url": `https://usgutterinstallation.com/${stateCode.toLowerCase()}/${city.toLowerCase().replace(/ /g, '-')}`,
                                            "telephone": "+18588985338",
                                            "address": {
                                                "@type": "PostalAddress",
                                                "addressLocality": formattedCity,
                                                "addressRegion": stateCode,
                                                "addressCountry": "US"
                                            },
                                            "areaServed": {
                                                "@type": "City",
                                                "name": formattedCity
                                            },
                                            "priceRange": "$$"
                                        },
                                        {
                                            "@context": "https://schema.org",
                                            "@type": "BreadcrumbList",
                                            "itemListElement": [
                                                {
                                                    "@type": "ListItem",
                                                    "position": 1,
                                                    "name": "Home",
                                                    "item": "https://usgutterinstallation.com"
                                                },
                                                {
                                                    "@type": "ListItem",
                                                    "position": 2,
                                                    "name": state,
                                                    "item": `https://usgutterinstallation.com/${stateCode.toLowerCase()}`
                                                },
                                                {
                                                    "@type": "ListItem",
                                                    "position": 3,
                                                    "name": formattedCity,
                                                    "item": `https://usgutterinstallation.com/${stateCode.toLowerCase()}/${city.toLowerCase().replace(/ /g, '-')}`
                                                }
                                            ]
                                        }
                                    ])
                                }}
                            />
                            <section className="py-24 px-6 bg-slate-50">
                                <div className="max-w-4xl mx-auto">
                                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Frequently Asked Questions in {formattedCity}</h2>

                                    <div className="space-y-4">
                                        {[
                                            { q: `How much does gutter installation cost in ${formattedCity}?`, a: content.faqAnswers.cost },
                                            { q: `What's the best gutter guard for ${stateCode.toUpperCase()} weather?`, a: content.faqAnswers.bestGuard },
                                            { q: `Do you offer emergency gutter repair in ${formattedCity}?`, a: content.faqAnswers.emergency },
                                            { q: `How often should gutters be cleaned in ${stateCode.toUpperCase()}?`, a: content.faqAnswers.cleaningFrequency },
                                            { q: `Do you repair soffit and fascia near me in ${formattedCity}?`, a: content.faqAnswers.soffitFascia },
                                            { q: "Do you offer warranties?", a: content.faqAnswers.warranty },
                                            { q: "Can you install gutters on any roof type?", a: "Absolutely. We have experience with asphalt shingles, metal roofs, slate, tile, and flat roofs." },
                                            { q: "How quickly can you get the job done?", a: content.faqAnswers.timeline }
                                        ].map((faq, i) => (
                                            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                                <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.q}</h3>
                                                <p className="text-slate-600">{faq.a}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Testimonials Section (Social Proof) */}
                            <section className="py-24 px-6 bg-slate-50 border-t border-slate-200">
                                <div className="max-w-7xl mx-auto">
                                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-12 text-center">
                                        What Neighbors in {formattedCity} Are Saying
                                    </h2>
                                    <div className="grid md:grid-cols-3 gap-8">
                                        {[
                                            { name: "Michael R.", role: "Homeowner", text: "They came out the next day for a quote and installed everything on Saturday. Super clean work.", stars: 5 },
                                            { name: "Sarah J.", role: "Local Resident", text: "I was worried about the cost, but their quote was significantly lower than the other two I got. Highly recommend.", stars: 5 },
                                            { name: "David K.", role: "Business Owner", text: "Professional from start to finish. The seamless gutters look amazing on my Victorian home.", stars: 5 }
                                        ].map((review, i) => (
                                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                                <div className="flex text-yellow-400 mb-4">
                                                    {[...Array(review.stars)].map((_, i) => <span key={i}>★</span>)}
                                                </div>
                                                <p className="text-slate-600 mb-6 italic">"{review.text}"</p>
                                                <div>
                                                    <div className="font-bold text-slate-900">{review.name}</div>
                                                    <div className="text-sm text-slate-500">{review.role}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* CTA Section */}
                            <section className="py-24 px-6 bg-slate-900 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                                <div className="max-w-4xl mx-auto text-center relative z-10">
                                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                                        Ready to upgrade your home in {formattedCity}?
                                    </h2>
                                    <p className="text-blue-200 text-xl mb-10 max-w-2xl mx-auto">
                                        Get a comprehensive quote in minutes. No obligation, just honest expert advice.
                                    </p>
                                    <CallBtn className="py-4 px-12 text-xl" label={`Call Now in ${formattedCity}`} />
                                </div>
                            </section>

                            {/* Internal Links for Crawlability */}
                            <InternalLinks
                                currentCity={formattedCity}
                                stateCode={stateCode}
                                relatedCities={relatedCities}
                            />

                            <TrustBadges />
                            <Footer />
                        </div>
}
