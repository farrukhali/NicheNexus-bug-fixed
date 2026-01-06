import { supabase } from '@/lib/supabase'
import { servicesData } from '@/lib/services-data'

export const revalidate = 86400 // Cache for 1 day

// Priority services (most searched)
const PRIORITY_SERVICES = [
    'seamless-gutter-installation',
    'gutter-guards-leaf-protection',
    'gutter-cleaning-maintenance',
    'soffit-fascia-repair',
    'ice-dam-removal',
]

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const baseUrl = 'https://usgutterinstallation.com'
    const today = new Date().toISOString().split('T')[0]

    // 1. Handle Static Sitemap
    if (id === 'static.xml') {
        const staticRoutes = [
            { path: '', priority: '1.0', changefreq: 'daily' },
            { path: '/about', priority: '0.8', changefreq: 'monthly' },
            { path: '/contact', priority: '0.8', changefreq: 'monthly' },
            { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
        ]

        const urlSet = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    ${staticRoutes.map(route => `
    <url>
        <loc>${baseUrl}${route.path}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${route.changefreq}</changefreq>
        <priority>${route.priority}</priority>
    </url>`).join('')}
</urlset>`

        return new Response(urlSet, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, max-age=3600',
            }
        })
    }

    // 2. Handle State Sitemaps (e.g., TX.xml)
    const stateMatch = id.match(/^([a-zA-Z]{2})\.xml$/)
    if (!stateMatch) {
        return new Response('Not Found', { status: 404 })
    }

    const stateCode = stateMatch[1].toUpperCase()

    // Fetch cities for this state with population data if available
    const { data: cities } = await supabase
        .from('usa city name')
        .select('city, state_id, population')
        .ilike('state_id', stateCode)
        .order('population', { ascending: false, nullsFirst: false })
        .limit(1000) // Limit to top 1000 cities per state for crawl efficiency

    if (!cities || cities.length === 0) {
        return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
            headers: { 'Content-Type': 'application/xml' }
        })
    }

    // State Page URL (highest priority)
    const stateUrl = `
    <url>
        <loc>${baseUrl}/${stateCode}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>`

    // City URLs - prioritize by population
    const cityUrls = cities.map((city, index) => {
        const citySlug = city.city.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')

        // Higher priority for top cities (by population or index)
        const cityPriority = index < 10 ? '0.8' : index < 50 ? '0.7' : '0.6'

        // Main city page
        const mainCityUrl = `
    <url>
        <loc>${baseUrl}/${stateCode}/${citySlug}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${cityPriority}</priority>
    </url>`

        // Only include priority services for top 100 cities (saves crawl budget)
        const includeAllServices = index < 100
        const servicesToInclude = includeAllServices
            ? Object.values(servicesData)
            : Object.values(servicesData).filter(s => PRIORITY_SERVICES.includes(s.slug))

        const serviceUrls = servicesToInclude.map(service => {
            const servicePriority = PRIORITY_SERVICES.includes(service.slug) ? '0.6' : '0.5'
            return `
    <url>
        <loc>${baseUrl}/${stateCode}/${citySlug}/${service.slug}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>${servicePriority}</priority>
    </url>`
        }).join('')

        return mainCityUrl + serviceUrls
    }).join('')

    const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${stateUrl}
    ${cityUrls}
</urlset>`

    return new Response(sitemapXML, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
    })
}
