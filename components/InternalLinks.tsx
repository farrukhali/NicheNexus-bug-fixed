import Link from 'next/link'

interface InternalLinksProps {
    currentCity: string
    stateCode: string
    relatedCities?: { city: string; state_id: string }[]
}

// This component adds semantic internal links to improve crawlability
export default function InternalLinks({ currentCity, stateCode, relatedCities }: InternalLinksProps) {
    if (!relatedCities || relatedCities.length === 0) return null

    // Group cities for better link distribution
    const nearbyLinks = relatedCities.slice(0, 5)
    const moreLinks = relatedCities.slice(5, 15)

    return (
        <section className="py-12 px-6 bg-slate-100 border-t border-slate-200">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">
                    Gutter Services in Nearby {stateCode} Cities
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Primary Internal Links - Nearby Cities */}
                    <div>
                        <h3 className="font-semibold text-slate-800 mb-3">
                            Gutter Installation Near {currentCity}
                        </h3>
                        <ul className="space-y-2">
                            {nearbyLinks.map((city, i) => {
                                const citySlug = city.city.toLowerCase().replace(/\s+/g, '-')
                                return (
                                    <li key={i}>
                                        <Link
                                            href={`/${city.state_id}/${citySlug}`}
                                            className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                                        >
                                            Gutter Installation in {city.city}, {city.state_id}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    {/* Secondary Internal Links - More Cities */}
                    {moreLinks.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-slate-800 mb-3">
                                More {stateCode} Locations
                            </h3>
                            <ul className="space-y-2">
                                {moreLinks.map((city, i) => {
                                    const citySlug = city.city.toLowerCase().replace(/\s+/g, '-')
                                    return (
                                        <li key={i}>
                                            <Link
                                                href={`/${city.state_id}/${citySlug}`}
                                                className="text-slate-600 hover:text-blue-600 hover:underline text-sm"
                                            >
                                                {city.city} Gutter Services
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )}
                </div>

                {/* State Link for Topical Authority */}
                <div className="mt-8 text-center">
                    <Link
                        href={`/${stateCode}`}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                        <span>←</span>
                        View All {stateCode} Cities
                    </Link>
                </div>
            </div>
        </section>
    )
}
