import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getSiteConfig } from '@/lib/site-config'
import { getNicheConfig } from '@/lib/niche-configs'
import { replacePlaceholders } from '@/lib/seo-utils'
import { getSEOContent } from '@/lib/seo-content'
import { Metadata } from 'next'
import HomepageSchema from '@/components/seo/HomepageSchema'

export const revalidate = 60 // Refresh content every minute

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOContent({ city: 'United States', state: 'USA', pageType: 'home' })
  const siteConfig = await getSiteConfig()

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: {
      canonical: `https://${siteConfig.domain}`
    },
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      url: `https://${siteConfig.domain}`,
      type: 'website',
      images: siteConfig.seoSettings?.og_image_url ? [siteConfig.seoSettings.og_image_url] : [],
    }
  }
}



export default async function Home() {
  const siteConfig = await getSiteConfig()
  const niche = await getNicheConfig(siteConfig.nicheSlug)
  const seo = await getSEOContent({ city: 'United States', state: 'USA', pageType: 'home' })

  const { data, error } = await supabase
    .from('usa city name')
    .select('state_name, state_id')

  if (error) {
    console.error('Error fetching states:', error)
  }

  // Deduplicate states
  const uniqueStates = Array.from(new Map(data?.map(item => [item.state_id, item])).values())
    .sort((a, b) => a.state_name.localeCompare(b.state_name))

  // Fetch top 50 cities by population for Featured Cities section
  // This flattens link depth: homepage → city (1 click instead of 2+)
  const { data: topCities } = await supabase
    .from('usa city name')
    .select('city, state_id, state_name, population')
    .order('population', { ascending: false })
    .limit(50)

  const featuredCities = topCities || []

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">

      <header className="relative py-32 px-6 bg-slate-900 overflow-hidden">
        <Navbar siteConfig={siteConfig} />

        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900 via-slate-900 to-black opacity-95"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-blue-300 text-sm font-medium mb-8">
            Find {niche.name} Services Near You
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-white tracking-tight leading-tight">
            {seo.h1Title}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-light mb-12 leading-relaxed">
            Searching for <span className="text-white font-semibold">{niche.primaryService.toLowerCase()} contractors near me</span>? Connect with local experts in over <span className="text-white font-semibold">31,000+ cities</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#states" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-full text-lg shadow-xl shadow-blue-600/20 transition-all transform hover:scale-105">
              Find {niche.primaryService} Near Me
            </a>
          </div>
        </div>
      </header>


      {/* Services Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{niche.name} Services Near Me</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Find professional {niche.name.toLowerCase()} services from licensed, insured local experts.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {niche.services.map((service, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all">
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {replacePlaceholders(service.description, { city: 'your area', state: 'your state', stateCode: '', service: service.title, nicheName: niche.name })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto py-24 px-6">
        {/* How It Works */}
        <section className="mb-32">
          <div className="bg-slate-900 rounded-3xl p-8 md:p-16 text-white text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Find {niche.name} Pros Near Me</h2>
              <p className="text-slate-400 mb-12 max-w-2xl mx-auto">Connect with local {niche.name.toLowerCase()} contractors in 3 easy steps</p>
              <div className="grid md:grid-cols-3 gap-12">
                <div className="relative">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
                  <h3 className="text-xl font-bold mb-4">Select Location</h3>
                  <p className="text-slate-400 leading-relaxed">Browse our directory to find {niche.primaryService.toLowerCase()} near you in all 50 states.</p>
                </div>
                <div className="relative">
                  <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
                  <h3 className="text-xl font-bold mb-4">Check Services</h3>
                  <p className="text-slate-400 leading-relaxed">View detailed service lists from local professionals in your exact area.</p>
                </div>
                <div className="relative">
                  <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
                  <h3 className="text-xl font-bold mb-4">Get Free Quote</h3>
                  <p className="text-slate-400 leading-relaxed">Request a free estimate from verified local contractors. Fast response times guaranteed.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* State Grid */}
        <section id="states" className="mb-32 scroll-mt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Find {niche.primaryService} Near Me by State</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Select your state to find trusted local {niche.name.toLowerCase()} contractors.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {uniqueStates.map((state) => (
              <Link
                key={state.state_id}
                href={`/${state.state_id.toLowerCase()}`}
                className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{state.state_id}</span>
                  <span className="font-semibold text-slate-700 group-hover:text-slate-900">{state.state_name}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Cities — Flattened link depth for top markets */}
        {featuredCities.length > 0 && (
          <section id="cities" className="mb-32 scroll-mt-20">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">Top Markets</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Featured Cities We Serve</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Direct access to {niche.name.toLowerCase()} services in our most popular markets across the United States.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {featuredCities.map((c) => (
                <Link
                  key={`${c.state_id}-${c.city}`}
                  href={`/${c.state_id.toLowerCase()}/${c.city.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="font-semibold text-slate-800 group-hover:text-blue-700 text-sm block">{c.city}</span>
                  <span className="text-xs text-slate-500">{c.state_id} · {c.population?.toLocaleString() || ''}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Intro Section (Moved here) */}
        {siteConfig.homepageContent && siteConfig.homepageContent.replace(/<[^>]*>/g, '').trim().length > 0 && (
          <section className="mb-32">
            <div className="max-w-4xl mx-auto px-6">
              <div
                className="homepage-intro-container"
                dangerouslySetInnerHTML={{
                  __html: replacePlaceholders(
                    siteConfig.homepageContent
                      .replace(/```html/g, '')
                      .replace(/```/g, '')
                      .trim(),
                    {
                      niche: niche.name,
                      service: niche.primaryService,
                      brand: siteConfig.siteName,
                      city: 'your area',
                      state: 'your state'
                    }
                  )
                }}
              />
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto mb-24">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Frequently Asked Questions</h2>
          <p className="text-slate-600 text-center mb-10">Common questions from homeowners searching for local {niche.name.toLowerCase()} services.</p>
          <div className="space-y-4">
            {(niche.home_faqs && niche.home_faqs.length > 0 ? niche.home_faqs : niche.faqs).map((faq, i) => (
              <details key={i} className="group bg-white p-6 rounded-2xl border border-slate-200 open:border-blue-200 open:ring-1 open:ring-blue-200 transition-all">
                <summary className="flex justify-between items-center font-semibold cursor-pointer list-none text-slate-800">
                  <span>{replacePlaceholders(faq.question, { service: niche.primaryService })}</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <p className="text-slate-600 mt-4 leading-relaxed group-open:animate-fadeIn">
                  {replacePlaceholders(faq.answer, { service: niche.primaryService })}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
