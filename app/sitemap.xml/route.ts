import { supabase } from '@/lib/supabase'

export const revalidate = 86400 // Cache for 1 day

export async function GET() {
    const baseUrl = 'https://usgutterinstallation.com'
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format

    // Fetch all distinct states
    const { data: cities } = await supabase
        .from('usa city name')
        .select('state_id')

    if (!cities) {
        return new Response('<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></sitemapindex>', {
            headers: { 'Content-Type': 'application/xml' }
        })
    }

    const uniqueStates = Array.from(new Set(cities.map(c => c.state_id))).sort()

    // Priority order for sitemaps:
    // 1. Static pages (highest priority)
    // 2. States A-F (common states like CA, FL, TX)
    // 3. States G-M
    // 4. States N-Z

    const priorityStates = ['CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI'] // High population states
    const otherStates = uniqueStates.filter(s => !priorityStates.includes(s))

    const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>${baseUrl}/sitemap/static.xml</loc>
        <lastmod>${today}</lastmod>
    </sitemap>
    ${priorityStates.filter(s => uniqueStates.includes(s)).map(state => `
    <sitemap>
        <loc>${baseUrl}/sitemap/${state}.xml</loc>
        <lastmod>${today}</lastmod>
    </sitemap>`).join('')}
    ${otherStates.map(state => `
    <sitemap>
        <loc>${baseUrl}/sitemap/${state}.xml</loc>
        <lastmod>${today}</lastmod>
    </sitemap>`).join('')}
</sitemapindex>`

    return new Response(sitemapIndexXML, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
    })
}
