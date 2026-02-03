import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Footer from '@/components/Footer'
import { getSiteConfig } from '@/lib/site-config'
import { getNicheConfig } from '@/lib/niche-configs'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
    const siteConfig = await getSiteConfig()
    return {
        title: `Site Directory | ${siteConfig.siteName}`,
        description: `Browse our complete directory of service areas and locations served by ${siteConfig.siteName}.`
    }
}

export default async function SitemapPage() {
    const siteConfig = await getSiteConfig()
    const niche = await getNicheConfig(siteConfig.nicheSlug)

    const { data: states, error } = await supabase
        .from('usa city name')
        .select('state_name, state_id')

    if (error) {
        console.error('Error fetching states for directory:', error)
    }

    // Deduplicate and sort states
    const uniqueStates = Array.from(new Map(states?.map(item => [item.state_id, item])).values())
        .sort((a, b) => a.state_name.localeCompare(b.state_name))

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
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Site Directory</h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Browse all our service locations across the United States.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {uniqueStates.map((state) => (
                            <div key={state.state_id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex justify-between items-center">
                                    {state.state_name}
                                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{state.state_id}</span>
                                </h2>
                                <Link
                                    href={`/${state.state_id.toLowerCase()}`}
                                    className="text-blue-600 font-medium hover:underline text-sm"
                                >
                                    View all cities in {state.state_name} &rarr;
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
