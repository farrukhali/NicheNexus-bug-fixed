import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Footer from '@/components/Footer'
import { getSiteConfig } from '@/lib/site-config'
import { Metadata } from 'next'

export const revalidate = 3600 // Cache for 1 hour

export async function generateMetadata(): Promise<Metadata> {
    const siteConfig = await getSiteConfig()
    return {
        title: `Site Directory - All Locations | ${siteConfig.siteName}`,
        description: `Complete directory of all 30,000+ cities and service areas covered by ${siteConfig.siteName}.`
    }
}

// Helper to fetch all rows since Supabase caps at 1000
async function getAllCities() {
    let allData: any[] = []
    let from = 0
    const step = 999
    let more = true

    while (more) {
        const { data, error } = await supabase
            .from('usa city name')
            .select('city, state_id, state_name')
            .range(from, from + step)
            .order('city', { ascending: true })

        if (error) {
            console.error('Error fetching cities:', error)
            break
        }

        if (data && data.length > 0) {
            allData = [...allData, ...data]
            from += step + 1
            // safety break if needed, but we want all
            if (data.length < step) more = false
        } else {
            more = false
        }
    }
    return allData
}

export default async function SitemapPage() {
    const siteConfig = await getSiteConfig()

    // Fetch all raw data
    const allCities = await getAllCities()

    // 1. Process States
    const uniqueStates = Array.from(new Map(allCities.map(item => [item.state_id, item])).values())
        .sort((a, b) => a.state_name.localeCompare(b.state_name))

    // 2. Group Cities by Letter
    const groupedCities: { [key: string]: any[] } = {}
    const alphabet = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

    allCities.forEach(city => {
        let letter = city.city.charAt(0).toUpperCase()
        if (!/[A-Z]/.test(letter)) letter = '#'
        if (!groupedCities[letter]) groupedCities[letter] = []
        groupedCities[letter].push(city)
    })

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
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
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Site Directory</h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Browse services in <span className="font-bold text-slate-900">{uniqueStates.length} states</span> and <span className="font-bold text-slate-900">{allCities.length.toLocaleString()} cities</span> across the USA.
                        </p>
                    </div>

                    {/* Section 1: States */}
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-200">Browse by State</h2>
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-24">
                        {uniqueStates.map((state) => (
                            <Link
                                key={state.state_id}
                                href={`/${state.state_id.toLowerCase()}`}
                                className="group bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex justify-between items-center"
                            >
                                <span className="font-semibold text-slate-900 group-hover:text-blue-600">{state.state_name}</span>
                                <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">{state.state_id}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Section 2: Cities A-Z */}
                    <div className="mt-24">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                            <h2 className="text-2xl font-bold text-slate-900">Browse All Cities</h2>
                            <span className="text-sm text-slate-500">Jump to letter:</span>
                        </div>

                        {/* Sticky A-Z Nav */}
                        <div className="sticky top-20 z-40 bg-white/95 backdrop-blur border border-slate-200 shadow-sm rounded-xl p-2 mb-12 flex flex-wrap justify-center gap-1">
                            {alphabet.map(letter => (
                                <a
                                    key={letter}
                                    href={`#letter-${letter}`}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${groupedCities[letter] ? 'text-blue-600 hover:bg-blue-50 hover:scale-110' : 'text-slate-300 cursor-not-allowed'}`}
                                >
                                    {letter}
                                </a>
                            ))}
                        </div>

                        {/* City Lists */}
                        <div className="space-y-16">
                            {alphabet.filter(l => groupedCities[l]).map(letter => (
                                <div key={letter} id={`letter-${letter}`} className="scroll-mt-32">
                                    <h3 className="flex items-center gap-4 text-3xl font-black text-slate-200 mb-8">
                                        <span className="w-12 h-12 flex items-center justify-center bg-slate-900 text-white rounded-xl shadow-lg text-2xl">
                                            {letter}
                                        </span>
                                        <div className="h-0.5 bg-slate-100 flex-grow"></div>
                                    </h3>
                                    <div className="columns-2 md:columns-3 lg:columns-4 gap-x-8 gap-y-2">
                                        {groupedCities[letter].map((city, i) => (
                                            <Link
                                                key={i}
                                                href={`/${city.state_id.toLowerCase()}/${city.city.toLowerCase().replace(/\s+/g, '-')}`}
                                                className="block py-1.5 text-sm text-slate-600 hover:text-blue-600 hover:font-medium break-inside-avoid"
                                            >
                                                {city.city}, <span className="text-slate-400 text-xs">{city.state_id}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
