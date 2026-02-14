/**
 * City Content Generator
 * 
 * Generates unique, AI-powered content for each city page.
 * Content is stored in the `city_content` Supabase table and
 * used by getSEOContent() to differentiate programmatic pages.
 * 
 * Supports batch generation by population tier and individual city generation.
 */

import { supabase } from './supabase'
import { getPopulationTier, getSettlementType, getPopulationDescriptor, formatPopulation } from './city-data-utils'

// ─── Types ─────────────────────────────────────────────────────────────────

export interface CityContentRecord {
    id?: string
    city: string
    state_id: string
    niche_slug: string
    local_intro: string | null
    local_challenges: string | null
    local_regulations: string | null
    pricing_context: string | null
    common_property_types: string[] | null
    local_climate_notes: string | null
    notable_neighborhoods: string[] | null
    population_tier: number
    content_quality_score: number | null
    generation_model: string | null
    generation_prompt_version: number
    last_generated_at: string
    manually_reviewed: boolean
    is_published: boolean
}

export interface GenerationContext {
    city: string
    state_id: string
    state_name: string
    population: number
    density: number
    county_name: string
    lat: number
    lng: number
    niche_name: string
    niche_slug: string
    primary_service: string
    climate_considerations: string
}

export interface GenerationResult {
    local_intro: string
    local_challenges: string
    local_regulations: string
    pricing_context: string
    common_property_types: string[]
    local_climate_notes: string
    notable_neighborhoods: string[]
}

// ─── Climate Data (for prompt enrichment) ──────────────────────────────────

const CLIMATE_DESCRIPTIONS: Record<string, string> = {
    "CT": "cold New England winters with heavy snow, ice dams, and freeze-thaw cycles. Coastal areas face nor'easters.",
    "MA": "harsh winters with ice, snow, and coastal storms. Humid summers bring thunderstorms.",
    "ME": "extreme cold winters, heavy snowfall, and coastal exposure on the Atlantic.",
    "NH": "severe winters with heavy snow and ice. Mountain areas get extreme snowfall.",
    "NY": "cold winters with lake-effect snow in western parts, summer humidity, and occasional hurricanes downstate.",
    "VT": "long cold winters with heavy snowfall and freeze-thaw cycles in mountain terrain.",
    "PA": "cold winters with ice storms, humid summers, and significant freeze-thaw cycling.",
    "NJ": "variable weather with cold winters, humid summers, and coastal storm exposure.",
    "RI": "coastal climate with cold winters, nor'easters, and humid summers.",
    "DE": "mid-Atlantic climate with coastal storms, humid summers, and moderate winters.",
    "MD": "humid subtropical climate with hot summers, cold winters, and Chesapeake Bay weather influence.",
    "DC": "humid subtropical with hot summers and cold winters. Urban heat island effects.",
    "WV": "mountain climate with heavy snowfall in highlands and variable conditions across elevation changes.",
    "VA": "humid subtropical with hot summers, moderate to cold winters, and hurricane exposure.",
    "IL": "severe winters with heavy snow, hot humid summers, and springtime severe storms and tornadoes.",
    "IN": "continental climate with cold winters, hot summers, and springtime tornado risk.",
    "MI": "lake-effect snow belts, cold winters exceeding -10°F, and humid summers.",
    "MN": "extreme continental climate with -30°F winters, heavy snowfall, and short intense summers.",
    "OH": "variable continental climate with cold winters, lake-effect in the north, and freeze-thaw damage.",
    "WI": "severe winters with deep snow, extreme cold, and active ice dam formation.",
    "IA": "continental climate with severe winters, spring flooding, and significant temperature swings.",
    "ND": "extreme cold reaching -40°F, blizzard conditions, and prairie winds.",
    "SD": "extreme continental with prairie winds, blizzards, and rapid temperature changes.",
    "NE": "continental climate with severe thunderstorms, hail, and cold winters.",
    "KS": "severe storm alley with tornadoes, large hail, and extreme temperature swings.",
    "MO": "variable climate with ice storms, severe thunderstorms, and hot humid summers.",
    "FL": "tropical and subtropical with hurricane-force winds up to 150mph, extreme rainfall, and year-round humidity.",
    "GA": "hot humid summers, mild winters in south, and severe thunderstorm season.",
    "AL": "subtropical with high humidity, tornado alley exposure, and intense summer storms.",
    "LA": "tropical climate with hurricane season Jun-Nov, extreme rainfall up to 60+ inches annually, and high humidity year-round.",
    "MS": "subtropical with high humidity, severe storm exposure, and hot extended summers.",
    "SC": "humid subtropical with hurricane exposure, coastal salt air, and hot summers.",
    "NC": "varied from coastal hurricanes to mountain snow, with humid summers throughout.",
    "TN": "moderate climate with occasional severe storms, ice events, and hot humid summers.",
    "KY": "humid subtropical with heavy rainfall, freeze-thaw cycles, and storm exposure.",
    "AR": "subtropical with severe storms, spring flooding, and hot humid summers.",
    "AZ": "desert climate with monsoon season (Jul-Sep), flash flooding, extreme UV, and 115°F+ summer heat.",
    "NM": "high desert with monsoon rains, intense UV exposure, and dramatic temperature swings between day and night.",
    "NV": "arid desert with flash flood risk, extreme heat exceeding 120°F, and very low humidity.",
    "TX": "diverse: Gulf Coast hurricanes, Tornado Alley hail, extreme heat inland, and occasional ice storms north.",
    "OK": "Tornado Alley with severe hailstorms, extreme wind events, and rapid temperature changes.",
    "WA": "Pacific Northwest rain averaging 37+ inches, persistent drizzle, moss growth issues, and mild temperatures.",
    "OR": "heavy rainfall in western valleys, dry eastern plains, and year-round debris from evergreen forests.",
    "HI": "tropical moisture, trade wind rain patterns, salt air corrosion, and volcanic soil conditions.",
    "AK": "extreme cold to -60°F, permafrost challenges, heavy snow loads, and limited daylight in winter.",
    "CO": "high altitude with heavy snowfall, intense UV, hailstorm exposure on Front Range, and low humidity.",
    "UT": "dry continental with heavy mountain snowfall, extreme UV, and freeze-thaw at elevation.",
    "MT": "extreme cold, heavy snowfall, chinook winds, and rapid temperature changes.",
    "WY": "extreme wind exposure exceeding 60mph, cold winters, and high altitude UV damage.",
    "ID": "varied from cold mountain winters to moderate valley conditions, with spring runoff.",
    "CA": "diverse: earthquake risk, wildfire zones, coastal fog and salt air, drought conditions, and occasional atmospheric rivers.",
}

// ─── Prompt Builder ────────────────────────────────────────────────────────

function buildGenerationPrompt(ctx: GenerationContext): string {
    const tier = getPopulationTier(ctx.population)
    const settlement = getSettlementType(ctx.density)
    const popDesc = getPopulationDescriptor(ctx.population)
    const climateDesc = CLIMATE_DESCRIPTIONS[ctx.state_id] || ctx.climate_considerations

    return `You are a local services content writer specializing in ${ctx.niche_name}. Generate unique, factual content for a ${ctx.primary_service} service page targeting ${ctx.city}, ${ctx.state_name} (${ctx.state_id}).

CITY DATA:
- City: ${ctx.city}, ${ctx.state_name}
- Population: ${formatPopulation(ctx.population)} (${popDesc})
- County: ${ctx.county_name} County
- Settlement type: ${settlement} (density: ${ctx.density}/sq mi)
- Coordinates: ${ctx.lat}, ${ctx.lng}
- Climate: ${climateDesc}

GENERATE THE FOLLOWING JSON (no markdown, no code fences, raw JSON only):

{
  "local_intro": "A 150-${tier <= 2 ? '300' : '200'} word introduction paragraph. MUST mention: (1) specific geographical features of ${ctx.city} like rivers, lakes, mountains, or terrain, (2) the city's character — is it a college town, industrial hub, retirement community, military town, suburban bedroom community, or historic district? (3) Why ${ctx.niche_name.toLowerCase()} matters specifically here given the local conditions. DO NOT use generic phrases like 'beautiful city' or 'wonderful community'. Be specific and factual.",

  "local_challenges": "A 100-150 word paragraph about specific ${ctx.niche_name.toLowerCase()} challenges homeowners face in ${ctx.city}. Reference: (1) local soil types or terrain (clay, sandy, rocky, flat, hilly), (2) specific weather patterns — not just 'rain' but ${climateDesc}, (3) common home construction types and ages in #{ctx.city}. Be technical and specific.",

  "local_regulations": "A 80-120 word paragraph about building regulations in ${ctx.county_name} County, ${ctx.state_id}. Mention: (1) whether permits are typically required for ${ctx.niche_name.toLowerCase()} work in ${ctx.state_name}, (2) any state-level contractor licensing requirements, (3) local code requirements specific to the ${settlement} environment. If you don't know specific regulations, discuss general ${ctx.state_name} requirements accurately.",

  "pricing_context": "A 80-120 word paragraph about ${ctx.niche_name.toLowerCase()} pricing in the ${ctx.city} market. Reference: (1) how ${ctx.state_name} labor costs compare regionally, (2) factors that affect pricing in ${settlement} areas specifically, (3) seasonal timing that affects costs. Use relative language ('above/below national average') rather than specific dollar amounts that may become outdated.",

  "common_property_types": ["array", "of", "3-5", "common", "home", "types", "in", "this", "area"],

  "local_climate_notes": "A 60-100 word summary of ${ctx.city}'s specific microclimate and how it impacts ${ctx.niche_name.toLowerCase()} specifically. Be more specific than just the state-level climate.",

  "notable_neighborhoods": ["array", "of", "5-8", "real", "neighborhoods", "or", "areas", "in", "${ctx.city}"]
}

CRITICAL RULES:
1. Return ONLY valid JSON. No markdown, no code fences, no explanation.
2. Every field must be a non-empty string or non-empty array.
3. Content MUST be factual — do not invent landmarks or neighborhoods. If unsure, use broader area descriptions.
4. Write naturally — this content will be read by homeowners, not search engines.
5. Do NOT mention competitor businesses by name.
6. Do NOT include any pricing dollar amounts — use comparative language only.`
}

// ─── AI Generation ─────────────────────────────────────────────────────────

async function callAI(prompt: string, apiKey: string, model: string = 'openai/gpt-4o-mini'): Promise<GenerationResult | null> {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://nichenexus.com',
                'X-Title': 'NicheNexus City Content Generator',
            },
            body: JSON.stringify({
                model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 2000,
                response_format: { type: 'json_object' },
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error(`AI API Error (${response.status}):`, errorText)
            return null
        }

        const data = await response.json()
        const content = data.choices?.[0]?.message?.content?.trim()

        if (!content) {
            console.error('Empty AI response')
            return null
        }

        // Parse JSON response
        const parsed = JSON.parse(content)

        // Validate required fields
        if (!parsed.local_intro || !parsed.local_challenges) {
            console.error('Missing required fields in AI response:', Object.keys(parsed))
            return null
        }

        return {
            local_intro: parsed.local_intro || '',
            local_challenges: parsed.local_challenges || '',
            local_regulations: parsed.local_regulations || '',
            pricing_context: parsed.pricing_context || '',
            common_property_types: Array.isArray(parsed.common_property_types) ? parsed.common_property_types : [],
            local_climate_notes: parsed.local_climate_notes || '',
            notable_neighborhoods: Array.isArray(parsed.notable_neighborhoods) ? parsed.notable_neighborhoods : [],
        }
    } catch (error) {
        console.error('AI generation error:', error)
        return null
    }
}

// ─── Content Quality Scoring ───────────────────────────────────────────────

function scoreContent(result: GenerationResult): number {
    let score = 0
    const maxScore = 7

    // Check each field for quality
    if (result.local_intro && result.local_intro.length >= 100) score += 1
    if (result.local_intro && result.local_intro.length >= 250) score += 0.5
    if (result.local_challenges && result.local_challenges.length >= 80) score += 1
    if (result.local_regulations && result.local_regulations.length >= 60) score += 1
    if (result.pricing_context && result.pricing_context.length >= 60) score += 1
    if (result.common_property_types && result.common_property_types.length >= 3) score += 0.5
    if (result.local_climate_notes && result.local_climate_notes.length >= 40) score += 1
    if (result.notable_neighborhoods && result.notable_neighborhoods.length >= 3) score += 1

    return Math.min(1.0, score / maxScore)
}

// ─── Single City Generator ─────────────────────────────────────────────────

export async function generateCityContent(
    cityData: {
        city: string
        state_id: string
        state_name: string
        population: number
        density: number
        county_name: string
        lat: number
        lng: number
    },
    nicheConfig: {
        name: string
        slug: string
        primaryService: string
    },
    apiKey: string,
    model: string = 'openai/gpt-4o-mini'
): Promise<CityContentRecord | null> {
    const climateDesc = CLIMATE_DESCRIPTIONS[cityData.state_id] || 'seasonal weather changes'

    const ctx: GenerationContext = {
        city: cityData.city,
        state_id: cityData.state_id,
        state_name: cityData.state_name,
        population: cityData.population,
        density: cityData.density,
        county_name: cityData.county_name,
        lat: cityData.lat,
        lng: cityData.lng,
        niche_name: nicheConfig.name,
        niche_slug: nicheConfig.slug,
        primary_service: nicheConfig.primaryService,
        climate_considerations: climateDesc,
    }

    const prompt = buildGenerationPrompt(ctx)
    const result = await callAI(prompt, apiKey, model)

    if (!result) return null

    const qualityScore = scoreContent(result)
    const tier = getPopulationTier(cityData.population)

    const record: CityContentRecord = {
        city: cityData.city,
        state_id: cityData.state_id,
        niche_slug: nicheConfig.slug,
        local_intro: result.local_intro,
        local_challenges: result.local_challenges,
        local_regulations: result.local_regulations,
        pricing_context: result.pricing_context,
        common_property_types: result.common_property_types,
        local_climate_notes: result.local_climate_notes,
        notable_neighborhoods: result.notable_neighborhoods,
        population_tier: tier,
        content_quality_score: qualityScore,
        generation_model: model,
        generation_prompt_version: 1,
        last_generated_at: new Date().toISOString(),
        manually_reviewed: false,
        is_published: qualityScore >= 0.5, // Auto-publish only if quality is decent
    }

    return record
}

// ─── Batch Generator ───────────────────────────────────────────────────────

export interface BatchGenerationOptions {
    tier?: number          // 1, 2, 3, or 4 — which population tier to generate
    stateId?: string       // Optional: limit to a specific state 
    limit?: number         // Max cities to generate (for testing)
    skipExisting?: boolean // Skip cities that already have content
    model?: string         // AI model to use
    delayMs?: number       // Delay between API calls (rate limiting)
}

export interface BatchGenerationProgress {
    total: number
    completed: number
    failed: number
    skipped: number
    currentCity: string
    status: 'running' | 'completed' | 'error'
    errors: { city: string; error: string }[]
}

export async function generateBatchCityContent(
    nicheConfig: { name: string; slug: string; primaryService: string },
    apiKey: string,
    options: BatchGenerationOptions = {},
    onProgress?: (progress: BatchGenerationProgress) => void
): Promise<BatchGenerationProgress> {
    const {
        tier,
        stateId,
        limit = 50,
        skipExisting = true,
        model = 'openai/gpt-4o-mini',
        delayMs = 1000,
    } = options

    // Build query for cities
    let query = supabase
        .from('usa city name')
        .select('city, state_id, state_name, population, density, county_name, lat, lng')
        .order('population', { ascending: false })
        .limit(limit)

    // Filter by tier
    if (tier === 1) query = query.gte('population', 100000)
    else if (tier === 2) query = query.gte('population', 25000).lt('population', 100000)
    else if (tier === 3) query = query.gte('population', 5000).lt('population', 25000)
    else if (tier === 4) query = query.lt('population', 5000)

    // Filter by state
    if (stateId) query = query.eq('state_id', stateId.toUpperCase())

    const { data: cities, error } = await query

    if (error || !cities) {
        console.error('Error fetching cities:', error)
        return {
            total: 0, completed: 0, failed: 0, skipped: 0,
            currentCity: '', status: 'error',
            errors: [{ city: 'query', error: error?.message || 'Unknown error' }],
        }
    }

    // If skipping existing, check which cities already have content
    let existingCities = new Set<string>()
    if (skipExisting) {
        const { data: existing } = await supabase
            .from('city_content')
            .select('city, state_id')
            .eq('niche_slug', nicheConfig.slug)

        if (existing) {
            existingCities = new Set(existing.map(e => `${e.city}|${e.state_id}`))
        }
    }

    const progress: BatchGenerationProgress = {
        total: cities.length,
        completed: 0,
        failed: 0,
        skipped: 0,
        currentCity: '',
        status: 'running',
        errors: [],
    }

    for (const cityData of cities) {
        const key = `${cityData.city}|${cityData.state_id}`
        progress.currentCity = `${cityData.city}, ${cityData.state_id}`

        // Skip if content already exists
        if (skipExisting && existingCities.has(key)) {
            progress.skipped++
            onProgress?.(progress)
            continue
        }

        try {
            // Generate content
            const record = await generateCityContent(cityData, nicheConfig, apiKey, model)

            if (!record) {
                progress.failed++
                progress.errors.push({ city: progress.currentCity, error: 'AI returned null' })
                onProgress?.(progress)
                continue
            }

            // Upsert to Supabase
            const { error: upsertError } = await supabase
                .from('city_content')
                .upsert(record, { onConflict: 'city,state_id,niche_slug' })

            if (upsertError) {
                progress.failed++
                progress.errors.push({ city: progress.currentCity, error: upsertError.message })
            } else {
                progress.completed++
            }
        } catch (err: any) {
            progress.failed++
            progress.errors.push({ city: progress.currentCity, error: err.message })
        }

        onProgress?.(progress)

        // Rate limiting delay
        if (delayMs > 0) {
            await new Promise(resolve => setTimeout(resolve, delayMs))
        }
    }

    progress.status = 'completed'
    onProgress?.(progress)

    return progress
}

// ─── Fetch Existing Content ────────────────────────────────────────────────

export async function getCityContent(
    city: string,
    stateId: string,
    nicheSlug: string
): Promise<CityContentRecord | null> {
    const { data, error } = await supabase
        .from('city_content')
        .select('*')
        .eq('city', city)
        .eq('state_id', stateId)
        .eq('niche_slug', nicheSlug)
        .eq('is_published', true)
        .single()

    if (error || !data) return null
    return data as CityContentRecord
}

// ─── Stats ─────────────────────────────────────────────────────────────────

export async function getCityContentStats(nicheSlug: string) {
    const { data, error } = await supabase
        .from('city_content')
        .select('population_tier, content_quality_score, is_published, manually_reviewed')
        .eq('niche_slug', nicheSlug)

    if (error || !data) return null

    const stats = {
        total: data.length,
        published: data.filter(d => d.is_published).length,
        reviewed: data.filter(d => d.manually_reviewed).length,
        avgQuality: data.reduce((sum, d) => sum + (d.content_quality_score || 0), 0) / (data.length || 1),
        byTier: {
            1: data.filter(d => d.population_tier === 1).length,
            2: data.filter(d => d.population_tier === 2).length,
            3: data.filter(d => d.population_tier === 3).length,
            4: data.filter(d => d.population_tier === 4).length,
        }
    }

    return stats
}
