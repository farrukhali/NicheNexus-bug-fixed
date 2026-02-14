
import { replacePlaceholders } from './seo-utils'
import { getSiteConfig } from './site-config'
import { getNicheConfig } from './niche-configs'
import { generateAIContent } from './ai-content'
import {
    getPopulationTier,
    getSettlementType,
    getPopulationDescriptor,
    formatPopulation,
    getDensityContext,
    getCountyContext,
    getMilitaryContext,
    type PopulationTier,
    type SettlementType,
    type EnrichedCityData
} from './city-data-utils'

// ─── Interfaces ────────────────────────────────────────────────────────────

export interface ContentVars {
    intro: string
    serviceDesc: string
    whyChoose: string
    processIntro: string
    materials: string
    technicalSpecs: string
    climateConsiderations: string
    faqAnswers: { [key: string]: string }
    h1Title?: string
    metaTitle?: string
    metaDescription?: string
    metaKeywords?: string[]
    // New enriched fields
    countyContext?: string
    densityContext?: string
    populationContext?: string
    militaryContext?: string
}

export interface SEOContentOptions {
    city: string
    state: string
    stateCode?: string
    pageType?: 'home' | 'state' | 'city' | 'service'
    serviceSlug?: string
    // New enrichment data — passed from page component
    population?: number
    density?: number
    countyName?: string
    military?: boolean
    incorporated?: boolean
    ranking?: number
}

// ─── Climate Zone Data ─────────────────────────────────────────────────────

const CLIMATE_ZONES: Record<string, { type: string; considerations: string }> = {
    // Northeast - Heavy snow/ice
    "CT": { type: "cold", considerations: "ice dams and heavy snow loads" },
    "MA": { type: "cold", considerations: "ice dams and heavy snow loads" },
    "ME": { type: "cold", considerations: "ice dams and heavy snow loads" },
    "NH": { type: "cold", considerations: "ice dams and heavy snow loads" },
    "NY": { type: "cold", considerations: "ice dams and heavy snow loads" },
    "VT": { type: "cold", considerations: "ice dams and heavy snow loads" },
    "PA": { type: "cold", considerations: "ice dams and freeze-thaw cycles" },
    "NJ": { type: "cold", considerations: "freeze-thaw cycles and heavy rain" },
    "RI": { type: "cold", considerations: "coastal storms and freeze-thaw cycles" },
    "DE": { type: "cold", considerations: "coastal storms and heavy rainfall" },
    "MD": { type: "cold", considerations: "freeze-thaw cycles and summer storms" },
    "DC": { type: "cold", considerations: "freeze-thaw cycles and summer storms" },
    "WV": { type: "cold", considerations: "mountain weather and heavy snowfall" },
    "VA": { type: "mixed", considerations: "seasonal storms and humid summers" },

    // Midwest - Snow and storms
    "IL": { type: "cold", considerations: "heavy snow and spring storms" },
    "IN": { type: "cold", considerations: "heavy snow and spring storms" },
    "MI": { type: "cold", considerations: "lake effect snow and ice dams" },
    "MN": { type: "cold", considerations: "extreme cold and heavy snow loads" },
    "OH": { type: "cold", considerations: "heavy snow and freeze-thaw cycles" },
    "WI": { type: "cold", considerations: "extreme cold and ice dam prevention" },
    "IA": { type: "cold", considerations: "heavy snow and spring flooding" },
    "ND": { type: "cold", considerations: "extreme cold and blizzard conditions" },
    "SD": { type: "cold", considerations: "extreme cold and prairie winds" },
    "NE": { type: "cold", considerations: "severe storms and heavy hail" },
    "KS": { type: "mixed", considerations: "severe storms, tornadoes, and hail" },
    "MO": { type: "mixed", considerations: "severe storms and temperature extremes" },

    // Southeast - Heavy rain
    "FL": { type: "tropical", considerations: "hurricane-force winds and heavy rainfall" },
    "GA": { type: "humid", considerations: "high humidity and summer thunderstorms" },
    "AL": { type: "humid", considerations: "high humidity and tornado season" },
    "LA": { type: "tropical", considerations: "hurricane season and extreme rainfall" },
    "MS": { type: "humid", considerations: "high humidity and severe storms" },
    "SC": { type: "humid", considerations: "hurricanes and coastal moisture" },
    "NC": { type: "humid", considerations: "hurricanes and mountain weather" },
    "TN": { type: "humid", considerations: "severe storms and temperature swings" },
    "KY": { type: "humid", considerations: "heavy rainfall and freeze-thaw cycles" },
    "AR": { type: "humid", considerations: "severe storms and spring flooding" },

    // Southwest - Heat and monsoons
    "AZ": { type: "desert", considerations: "monsoon season flash flooding" },
    "NM": { type: "desert", considerations: "monsoon rains and UV exposure" },
    "NV": { type: "desert", considerations: "flash floods and extreme heat" },
    "TX": { type: "mixed", considerations: "severe storms and hail damage" },
    "OK": { type: "mixed", considerations: "tornadoes and severe hailstorms" },

    // Pacific - Rain & mixed
    "WA": { type: "rainy", considerations: "persistent rain and moss growth" },
    "OR": { type: "rainy", considerations: "heavy rainfall and debris from evergreens" },
    "HI": { type: "tropical", considerations: "tropical moisture and salt air corrosion" },
    "AK": { type: "cold", considerations: "extreme cold, permafrost, and heavy snow loads" },

    // Mountain West - Snow
    "CO": { type: "cold", considerations: "heavy snowfall and altitude considerations" },
    "UT": { type: "cold", considerations: "heavy snowfall and freeze-thaw cycles" },
    "MT": { type: "cold", considerations: "extreme cold and heavy snow loads" },
    "WY": { type: "cold", considerations: "high winds and extreme cold" },
    "ID": { type: "cold", considerations: "heavy snowfall and spring runoff" },

    // California - Mixed
    "CA": { type: "mixed", considerations: "wildfires, drought, and occasional heavy rains" },
}

const getClimateContent = (stateCode: string): string => {
    const climate = CLIMATE_ZONES[stateCode.toUpperCase()]
    if (climate) {
        return climate.considerations
    }
    return "seasonal weather changes"
}

const getClimateType = (stateCode: string): string => {
    return CLIMATE_ZONES[stateCode.toUpperCase()]?.type || 'mixed'
}

// ─── Hash Function ─────────────────────────────────────────────────────────

function getHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }
    return Math.abs(hash)
}

// ─── Content Variant Engine ────────────────────────────────────────────────
// Instead of a single hardcoded sentence, we have multiple variants keyed
// by climate × settlement type. This ensures different cities get
// genuinely different content, not just name-swaps.

interface ContentVariantKey {
    climate: string
    settlement: SettlementType
    tier: PopulationTier
}

function buildIntro(
    city: string, state: string, stateCode: string,
    niche: string, primaryService: string,
    population: number | undefined, density: number | undefined,
    countyName: string | undefined
): string {
    const tier = getPopulationTier(population)
    const settlement = getSettlementType(density)
    const climate = getClimateType(stateCode)
    const popDesc = getPopulationDescriptor(population)
    const popFormatted = formatPopulation(population)
    const countyMention = countyName ? ` in ${countyName} County` : ''

    // Tier 1 & 2: Rich intro with population data and local context
    if (tier <= 2 && popFormatted) {
        const climateIntros: Record<string, string> = {
            cold: `With ${city}'s harsh winters and freeze-thaw cycles, proper ${niche.toLowerCase()} isn't just an upgrade — it's essential protection for your home.`,
            tropical: `${city}'s tropical climate demands ${niche.toLowerCase()} systems built to withstand intense rainfall and high humidity year-round.`,
            humid: `In ${city}'s humid ${state} climate, moisture management is critical. Professional ${niche.toLowerCase()} protects your most valuable investment.`,
            desert: `${city}'s desert conditions bring unique challenges — from monsoon flash floods to intense UV exposure. Your ${niche.toLowerCase()} system must be engineered for extremes.`,
            rainy: `With annual rainfall well above the national average, ${city} homes need ${niche.toLowerCase()} systems designed for continuous water management.`,
            mixed: `${city}'s variable ${state} weather — from summer storms to winter freezes — demands versatile ${niche.toLowerCase()} solutions built for all seasons.`,
        }

        const climateOpener = climateIntros[climate] || climateIntros['mixed']

        if (settlement === 'urban') {
            return `${climateOpener} Serving ${popFormatted} residents across this ${popDesc}${countyMention}, our licensed contractors specialize in ${primaryService.toLowerCase()} for properties ranging from historic rowhouses to modern developments. We understand ${city}'s building codes and work within the specific requirements of dense ${settlement} neighborhoods.`
        } else if (settlement === 'suburban') {
            return `${climateOpener} As a trusted ${niche.toLowerCase()} provider for ${city}'s ${popFormatted}-strong community${countyMention}, we've built our reputation on craftsmanship tailored to ${settlement} properties. From split-levels to new construction, our ${primaryService.toLowerCase()} solutions protect homes across ${city}'s diverse suburban landscape.`
        } else {
            return `${climateOpener} Serving the ${popDesc} of ${city}${countyMention} with a population of ${popFormatted}, our local crews bring professional-grade ${primaryService.toLowerCase()} to properties of every size. Rural homes often face unique challenges including longer service runs and proximity to mature tree canopies — challenges our experienced team knows how to solve.`
        }
    }

    // Tier 3: Medium-length intro with some context
    if (tier === 3) {
        const settlementVariants: Record<SettlementType, string> = {
            urban: `Looking for professional ${primaryService.toLowerCase()} in ${city}, ${stateCode}? Our licensed ${niche.toLowerCase()} contractors serve this ${popDesc}${countyMention} with solutions designed for ${city}'s building environment. We handle everything from inspections to complete installations, meeting all local ${state} building codes.`,
            suburban: `${city}, ${stateCode} homeowners trust our ${niche.toLowerCase()} team for reliable ${primaryService.toLowerCase()} that stands up to ${getClimateContent(stateCode)}. Serving families across this ${popDesc}${countyMention}, we deliver quality workmanship with transparent, upfront pricing.`,
            rural: `Need ${primaryService.toLowerCase()} in ${city}, ${stateCode}? Our experienced crews serve homeowners throughout${countyMention} the ${city} area. We understand the specific demands of ${settlement} properties in ${state} and bring the same professional standards to every project, regardless of size.`,
        }
        return settlementVariants[settlement]
    }

    // Tier 4: Shorter but still contextual
    const climateNote = CLIMATE_ZONES[stateCode.toUpperCase()]
        ? ` designed for ${getClimateContent(stateCode)}`
        : ''
    return `Professional ${primaryService.toLowerCase()} services in ${city}, ${stateCode}${countyMention}. Our licensed ${state} contractors deliver quality ${niche.toLowerCase()} solutions${climateNote}. Free estimates, transparent pricing, and workmanship you can count on.`
}

function buildWhyChoose(
    city: string, state: string, stateCode: string,
    niche: string, primaryService: string,
    population: number | undefined, density: number | undefined,
    countyName: string | undefined
): string {
    const settlement = getSettlementType(density)
    const tier = getPopulationTier(population)

    if (tier <= 2) {
        const reasons: Record<SettlementType, string> = {
            urban: `In a ${settlement} market like ${city}, you have options — and that's exactly why reputation matters. We've earned the trust of homeowners throughout ${countyName ? countyName + ' County' : state} by delivering consistently excellent ${niche.toLowerCase()} work, clear communication from bid to final walkthrough, and pricing that doesn't come with surprises. Our crews are familiar with ${city}'s specific building standards, permitting process, and the unique challenges of working in established neighborhoods.`,
            suburban: `${city} homeowners choose us because we treat every project like it's our own home. From the initial inspection to the final cleanup, our ${niche.toLowerCase()} process is built on transparency: written estimates with line-item detail, defined timelines, and a satisfaction guarantee that puts you in control. We're deeply familiar with ${state}'s building codes and the specific needs of ${settlement} properties in the ${city} area.`,
            rural: `Homeowners in ${city} and surrounding ${countyName ? countyName + ' County' : state} communities choose us for our combination of professional expertise and personal service. We understand that when you call for ${primaryService.toLowerCase()} in a ${settlement} area, you need a team that shows up on time, communicates clearly, and delivers work that lasts — not a crew that cuts corners because they're covering too much territory.`,
        }
        return reasons[settlement]
    }

    return `Homeowners in ${city}, ${stateCode} trust us for our transparent pricing, licensed contractors, and quality ${niche.toLowerCase()} workmanship. We're committed to earning your business with superior service on every ${primaryService.toLowerCase()} project.`
}

function buildTechnicalSpecs(
    city: string, state: string, stateCode: string,
    niche: string, density: number | undefined,
    countyName: string | undefined
): string {
    const settlement = getSettlementType(density)
    const climate = getClimateType(stateCode)

    const climateSpecs: Record<string, string> = {
        cold: `All installations exceed ${state} cold-climate building standards with proper ice and water barriers, enhanced underlayment in valleys and eaves, and materials rated for freeze-thaw durability.`,
        tropical: `Our ${niche.toLowerCase()} systems are engineered for ${state}'s tropical conditions with wind-rated components, corrosion-resistant hardware, and high-capacity water handling.`,
        humid: `We specify materials with superior moisture resistance for ${state}'s humid climate, including anti-microbial treatments and enhanced ventilation to prevent mold and rot.`,
        desert: `Materials are selected for ${state}'s extreme UV exposure and temperature swings, with UV-stabilized components and thermal-expansion-tolerant fastening systems.`,
        rainy: `Systems designed for ${state}'s heavy rainfall volumes use oversized downspouts, seamless runs to minimize leak points, and enhanced water-shedding profiles.`,
        mixed: `Our installations meet all ${state} building codes with materials and techniques chosen for the region's variable climate conditions.`,
    }

    const spec = climateSpecs[climate] || climateSpecs['mixed']
    const countyNote = countyName
        ? ` We're current on all ${countyName} County permit requirements and inspection standards.`
        : ''

    return `${spec}${countyNote}`
}

function buildMaterials(
    city: string, state: string, stateCode: string,
    niche: string, density: number | undefined
): string {
    const climate = getClimateType(stateCode)

    const materialsByClimate: Record<string, string> = {
        cold: `We select materials proven in cold climates — impact-resistant profiles, reinforced brackets rated for snow loads, and sealants that remain flexible down to -20°F. Every product we install in ${city} is manufacturer-warrantied for your specific ${state} conditions.`,
        tropical: `For ${city}'s tropical environment, we exclusively use marine-grade and impact-rated materials — corrosion-resistant aluminum, stainless steel hardware, and UV-stabilized finishes designed to withstand ${state}'s intense sun and salt air.`,
        humid: `Moisture control drives our material choices in ${city}. We use anti-microbial coatings, moisture-barrier underlayments, and rot-resistant materials throughout — critical for ${state}'s humid conditions that accelerate deterioration in inferior products.`,
        desert: `In ${city}'s extreme climate, standard materials fail prematurely. We use heat-reflective finishes, UV-stabilized polymers, and thermally stable mounting hardware designed for the 100°F+ temperature differentials common in ${state}.`,
        rainy: `For ${city}'s rain-heavy climate, high-capacity systems are essential. We install oversized profiles with seamless construction to minimize failure points, paired with debris-management solutions that keep water flowing freely through ${state}'s wettest months.`,
        mixed: `We source professional-grade materials from leading manufacturers, selecting products specifically tested for ${state}'s variable climate conditions. Every installation in ${city} uses components backed by comprehensive manufacturer warranties.`,
    }

    return materialsByClimate[climate] || materialsByClimate['mixed']
}

// ─── Main getSEOContent Function ───────────────────────────────────────────

// Overload signatures for backward compatibility
export async function getSEOContent(city: string, state: string, stateCode?: string): Promise<ContentVars>;
export async function getSEOContent(options: SEOContentOptions): Promise<ContentVars>;

export async function getSEOContent(
    cityOrOptions: string | SEOContentOptions,
    stateArg?: string,
    stateCodeArg?: string
): Promise<ContentVars> {
    let city: string, state: string, stateCode: string | undefined
    let pageType: 'home' | 'state' | 'city' | 'service' = 'city'
    let serviceSlug: string | undefined
    let population: number | undefined
    let density: number | undefined
    let countyName: string | undefined
    let military: boolean | undefined

    if (typeof cityOrOptions === 'object') {
        city = cityOrOptions.city
        state = cityOrOptions.state
        stateCode = cityOrOptions.stateCode
        pageType = cityOrOptions.pageType || 'city'
        serviceSlug = cityOrOptions.serviceSlug
        population = cityOrOptions.population
        density = cityOrOptions.density
        countyName = cityOrOptions.countyName
        military = cityOrOptions.military
    } else {
        city = cityOrOptions
        state = stateArg!
        stateCode = stateCodeArg
    }

    const siteConfig = await getSiteConfig()
    const niche = await getNicheConfig(siteConfig.nicheSlug)
    const code = stateCode?.toUpperCase() || state.substring(0, 2).toUpperCase()

    const hashString = city + state + niche.slug
    const hash = getHash(hashString)

    // Select service
    let selectedService = niche.services[hash % niche.services.length]
    if (serviceSlug) {
        const foundService = niche.services.find(s => s.slug === serviceSlug)
        if (foundService) selectedService = foundService
    }

    const placeholderVars = {
        city,
        state,
        stateCode: code,
        niche: niche.name,
        service: selectedService.title,
        brand: siteConfig.siteName,
        phone: siteConfig.contactPhone,
        baseurl: siteConfig.domain
    }

    // ── Meta title/description/h1 templates (unchanged logic) ──────────
    let metaTitleTemplate = `{{service}} in {{city}}, {{state}} | {{brand}}`
    let metaDescTemplate = `Professional {{service}} in {{city}}, {{state}}. Licensed, insured local experts.`
    let h1Template = `{{service}} in {{city}}, {{state}}`

    if (siteConfig.seoSettings) {
        const s = siteConfig.seoSettings
        switch (pageType) {
            case 'home':
                metaTitleTemplate = s.meta_title_home || metaTitleTemplate
                metaDescTemplate = s.meta_description_home || metaDescTemplate
                h1Template = s.h1_template_home || `Find {{service}} Near Me`
                break
            case 'state':
                if (code) {
                    if (s.state_overrides?.[code]?.meta_title) metaTitleTemplate = s.state_overrides[code].meta_title
                    else metaTitleTemplate = s.meta_title_state || metaTitleTemplate
                    if (s.state_overrides?.[code]?.meta_description) metaDescTemplate = s.state_overrides[code].meta_description
                    else metaDescTemplate = s.meta_description_state || metaDescTemplate
                } else {
                    metaTitleTemplate = s.meta_title_state || metaTitleTemplate
                    metaDescTemplate = s.meta_description_state || metaDescTemplate
                }
                h1Template = s.h1_template_state || `{{service}} in {{state}} | Local Experts`
                break
            case 'city':
                metaTitleTemplate = s.meta_title_city || metaTitleTemplate
                metaDescTemplate = s.meta_description_city || metaDescTemplate
                h1Template = s.h1_template_city || `{{service}} in {{city}}, {{state}}`
                break
            case 'service':
                metaTitleTemplate = s.meta_title_service || metaTitleTemplate
                metaDescTemplate = s.meta_description_service || metaDescTemplate
                h1Template = s.h1_template_service || `{{service}} Services in {{city}}`
                break
        }
    }

    // ── Build data-driven content ──────────────────────────────────────
    const intro = buildIntro(city, state, code, niche.name, niche.primaryService, population, density, countyName)
    const whyChoose = buildWhyChoose(city, state, code, niche.name, niche.primaryService, population, density, countyName)
    const technicalSpecs = buildTechnicalSpecs(city, state, code, niche.name, density, countyName)
    const materials = buildMaterials(city, state, code, niche.name, density)
    const climateConsiderations = `In ${code}, we specialize in ${niche.name.toLowerCase()} solutions that handle ${getClimateContent(code)}.`

    // ── Enrichment context (new fields) ────────────────────────────────
    const countyContext = getCountyContext(countyName, code, niche.name)
    const densityContext = getDensityContext(density, niche.name)
    const populationContext = population
        ? `Serving ${formatPopulation(population)} residents across the ${getPopulationDescriptor(population)} of ${city}.`
        : ''
    const militaryContext = getMilitaryContext(military, city, niche.name)

    // ── FAQ answers ────────────────────────────────────────────────────
    const faqs = (pageType === 'city' && niche.city_faqs && niche.city_faqs.length > 0)
        ? niche.city_faqs
        : niche.faqs

    return {
        h1Title: replacePlaceholders(h1Template, placeholderVars),
        metaTitle: replacePlaceholders(metaTitleTemplate, placeholderVars),
        metaDescription: replacePlaceholders(metaDescTemplate, placeholderVars),
        metaKeywords: niche.keywords.map(k => replacePlaceholders(k, placeholderVars)),
        intro,
        serviceDesc: replacePlaceholders(selectedService.description, placeholderVars),
        materials,
        whyChoose,
        technicalSpecs,
        climateConsiderations,
        processIntro: "Our streamlined process takes the hassle out of home improvement.",
        faqAnswers: faqs.reduce((acc: Record<string, string>, faq: any) => ({
            ...acc,
            [faq.question]: replacePlaceholders(faq.answer, placeholderVars)
        }), {}),
        // Enrichment extras
        countyContext,
        densityContext,
        populationContext,
        militaryContext,
    }
}
