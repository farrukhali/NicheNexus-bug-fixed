import { NextRequest, NextResponse } from 'next/server'
import { getSiteConfig } from '@/lib/site-config'
import { getNicheConfig } from '@/lib/niche-configs'
import { generateBatchCityContent, getCityContentStats, generateCityContent, BatchGenerationProgress } from '@/lib/city-content-generator'
import { supabase } from '@/lib/supabase'

// ─── Auth Helper ───────────────────────────────────────────────────────────

function checkAuth(request: NextRequest): boolean {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) return false

    const [scheme, credentials] = authHeader.split(' ')
    if (scheme !== 'Basic') return false

    const decoded = atob(credentials)
    const [username, password] = decoded.split(':')

    return (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    )
}

// ─── GET: Stats & Status ──────────────────────────────────────────────────

export async function GET(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const siteConfig = await getSiteConfig()
    const nicheSlug = siteConfig.nicheSlug || process.env.NEXT_PUBLIC_NICHE_SLUG || 'default'

    const stats = await getCityContentStats(nicheSlug)

    // Also get total cities by tier from main table
    const { data: tierCounts } = await supabase
        .from('usa city name')
        .select('population')

    const totalByTier = {
        1: tierCounts?.filter(c => c.population >= 100000).length || 0,
        2: tierCounts?.filter(c => c.population >= 25000 && c.population < 100000).length || 0,
        3: tierCounts?.filter(c => c.population >= 5000 && c.population < 25000).length || 0,
        4: tierCounts?.filter(c => c.population < 5000 || !c.population).length || 0,
    }

    return NextResponse.json({
        nicheSlug,
        contentStats: stats,
        totalCities: tierCounts?.length || 0,
        totalByTier,
        coverage: stats ? {
            tier1: `${stats.byTier[1]}/${totalByTier[1]}`,
            tier2: `${stats.byTier[2]}/${totalByTier[2]}`,
            tier3: `${stats.byTier[3]}/${totalByTier[3]}`,
            tier4: `${stats.byTier[4]}/${totalByTier[4]}`,
        } : null
    })
}

// ─── POST: Generate Content ───────────────────────────────────────────────

export async function POST(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const {
            action = 'batch',   // 'batch' or 'single'
            tier,               // 1, 2, 3, or 4
            stateId,            // Optional: specific state
            limit = 10,         // Max cities per batch
            city,               // For single mode
            model = 'openai/gpt-4o-mini',
            delayMs = 1500,
        } = body

        // Get config
        const siteConfig = await getSiteConfig()
        const apiKey = siteConfig.openRouterKey || process.env.OPENROUTER_API_KEY
        if (!apiKey) {
            return NextResponse.json({ error: 'No OpenRouter API key configured' }, { status: 400 })
        }

        const nicheSlug = siteConfig.nicheSlug || process.env.NEXT_PUBLIC_NICHE_SLUG || 'default'
        const niche = await getNicheConfig(nicheSlug)

        const nicheConfig = {
            name: niche.name,
            slug: nicheSlug,
            primaryService: niche.primaryService,
        }

        // ── Single city generation ──
        if (action === 'single' && city && stateId) {
            const { data: cityData } = await supabase
                .from('usa city name')
                .select('city, state_id, state_name, population, density, county_name, lat, lng')
                .ilike('city', city)
                .ilike('state_id', stateId)
                .limit(1)
                .single()

            if (!cityData) {
                return NextResponse.json({ error: `City not found: ${city}, ${stateId}` }, { status: 404 })
            }

            const record = await generateCityContent(cityData, nicheConfig, apiKey, model)

            if (!record) {
                return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
            }

            // Upsert to Supabase
            const { error: upsertError } = await supabase
                .from('city_content')
                .upsert(record, { onConflict: 'city,state_id,niche_slug' })

            if (upsertError) {
                return NextResponse.json({ error: upsertError.message }, { status: 500 })
            }

            return NextResponse.json({
                success: true,
                action: 'single',
                city: `${city}, ${stateId}`,
                qualityScore: record.content_quality_score,
                content: record,
            })
        }

        // ── Batch generation ──
        const progress = await generateBatchCityContent(
            nicheConfig,
            apiKey,
            {
                tier: tier ? Number(tier) : undefined,
                stateId,
                limit: Math.min(Number(limit), 100), // Cap at 100 per request
                skipExisting: true,
                model,
                delayMs: Number(delayMs),
            }
        )

        return NextResponse.json({
            success: true,
            action: 'batch',
            progress,
        })

    } catch (error: any) {
        console.error('City content generation error:', error)
        return NextResponse.json({
            error: error.message || 'Internal server error',
        }, { status: 500 })
    }
}
