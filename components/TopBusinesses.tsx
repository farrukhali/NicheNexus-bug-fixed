import { createClient } from '@supabase/supabase-js'

interface TopBusinessesProps {
    city: string
    state: string
}

export default async function TopBusinesses({ city, state }: TopBusinessesProps) {
    const supabaseUrl = process.env.LEADS_SUPABASE_URL
    const supabaseKey = process.env.LEADS_SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
        return null
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Format city for display
    const formattedCity = city.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    const stateUpper = state.toUpperCase()

    // Fetch leads for the specific city and state
    // DB has city="New York", state="NY" - need to match with proper formatting
    const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .ilike('city', formattedCity)
        .ilike('state', stateUpper)
        .limit(10)

    if (error || !leads || leads.length === 0) {
        console.error('Error fetching leads:', error)
        return null
    }

    const actionTexts = [
        "Call Now",
        "Request Quote",
        "Get Estimate",
        "Book Now",
        "Contact Team",
        "Free Quote",
        "Speak to Pro",
        "Check Availability",
        "Schedule Service",
        "Get Pricing"
    ]

    const mainPhoneNumber = "+18588985338"

    // Generate ItemList schema for SEO
    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": `Top ${leads.length} Best Gutter Service Providers Near Me in ${formattedCity}, ${stateUpper}`,
        "description": `Find the best gutter installation, cleaning, and repair service providers near me in ${formattedCity}, ${stateUpper}. Verified local contractors.`,
        "numberOfItems": leads.length,
        "itemListElement": leads.map((lead: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "LocalBusiness",
                "name": lead.company_name || lead.name || "Local Gutter Pro",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": lead.address || "",
                    "addressLocality": formattedCity,
                    "addressRegion": stateUpper
                },
                "telephone": mainPhoneNumber,
                "priceRange": "$$",
                "areaServed": formattedCity
            }
        }))
    }

    return (
        <section
            className="py-16 px-6 bg-gradient-to-b from-white to-slate-50 border-t border-slate-100"
            itemScope
            itemType="https://schema.org/ItemList"
        >
            {/* ItemList Schema for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
            />

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Trusted Local Pros</span>
                    <h2
                        className="text-3xl font-bold text-slate-900 mt-2 mb-4"
                        itemProp="name"
                    >
                        Top {leads.length} Best Gutter Service Providers Near Me in {formattedCity}, {stateUpper}
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto" itemProp="description">
                        Looking for gutter installation near me in {formattedCity}? Connect with our vetted, top-rated
                        local gutter contractors for cleaning, repair, and new installations.
                    </p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-lg bg-white">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-900 text-white">
                            <tr>
                                <th className="py-4 px-6 text-sm font-semibold uppercase tracking-wider">#</th>
                                <th className="py-4 px-6 text-sm font-semibold uppercase tracking-wider">Company Name</th>
                                <th className="py-4 px-6 text-sm font-semibold uppercase tracking-wider hidden sm:table-cell">Address</th>
                                <th className="py-4 px-6 text-sm font-semibold uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {leads.map((lead: any, index: number) => {
                                const actionText = actionTexts[index % actionTexts.length]
                                return (
                                    <tr
                                        key={lead.id || index}
                                        className="hover:bg-slate-50 transition-colors group"
                                        itemScope
                                        itemType="https://schema.org/LocalBusiness"
                                        itemProp="itemListElement"
                                    >
                                        <td className="py-4 px-6 font-bold text-slate-900">
                                            {index + 1}
                                        </td>
                                        <td className="py-4 px-6 font-medium text-slate-900" itemProp="name">
                                            {lead.company_name || lead.name || "Local Gutter Pro"}
                                        </td>
                                        <td className="py-4 px-6 text-slate-500 text-sm hidden sm:table-cell" itemProp="address">
                                            {lead.address || `${formattedCity}, ${stateUpper}`}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <a
                                                href={`tel:${mainPhoneNumber}`}
                                                className="inline-block bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-2.5 px-6 rounded-full transition-all hover:scale-105 shadow-md"
                                                itemProp="telephone"
                                            >
                                                {actionText}
                                            </a>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-500 italic">
                        ✓ All service providers are vetted and verified for {formattedCity} area.
                    </p>
                </div>
            </div>
        </section>
    )
}

