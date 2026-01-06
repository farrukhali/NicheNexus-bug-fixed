
export interface ContentVars {
    intro: string
    serviceDesc: string
    whyChoose: string
    processIntro: string
    materials: string
    technicalSpecs: string
    climateConsiderations: string
    faqAnswers: { [key: string]: string }
}

// Regional climate data for more specific content
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

    // Southeast - Heavy rain
    "FL": { type: "tropical", considerations: "hurricane-force winds and heavy rainfall" },
    "GA": { type: "humid", considerations: "high humidity and summer thunderstorms" },
    "AL": { type: "humid", considerations: "high humidity and tornado season" },
    "LA": { type: "tropical", considerations: "hurricane season and extreme rainfall" },
    "MS": { type: "humid", considerations: "high humidity and severe storms" },
    "SC": { type: "humid", considerations: "hurricanes and coastal moisture" },
    "NC": { type: "humid", considerations: "hurricanes and mountain weather" },

    // Southwest - Heat and monsoons
    "AZ": { type: "desert", considerations: "monsoon season flash flooding" },
    "NM": { type: "desert", considerations: "monsoon rains and UV exposure" },
    "NV": { type: "desert", considerations: "flash floods and extreme heat" },
    "TX": { type: "mixed", considerations: "severe storms and hail damage" },
    "OK": { type: "mixed", considerations: "tornadoes and severe hailstorms" },

    // Pacific Northwest - Rain
    "WA": { type: "rainy", considerations: "persistent rain and moss growth" },
    "OR": { type: "rainy", considerations: "heavy rainfall and debris from evergreens" },

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

const VARIANTS = {
    intros: [
        (city: string, state: string) => `Searching for **gutter installation near me in ${city}**? You've found the #1 rated local gutter contractors in **${state}**. We specialize in seamless gutter systems, gutter guards, and complete gutter replacement designed specifically for ${state}'s unique weather patterns.`,
        (city: string, state: string) => `When you search for **gutter companies near me** in **${city}**, you need local experts who understand your area. Our ${state}-licensed crews provide top-tier **seamless gutter installation near me** services, ensuring your home stays protected from water damage year-round.`,
        (city: string, state: string) => `Looking for **seamless gutters near me in ${city}, ${state}**? We're your local factory-on-wheels, bringing custom gutter fabrication right to your driveway. No seams means no leaks—that's why homeowners across ${state} choose us.`,
        (city: string, state: string) => `Need **professional gutter installers near me in ${city}**? Our ${state}-based crews have over 50 years of combined experience installing K-style and half-round gutters. We're the trusted name for **gutter installation near me** in your neighborhood.`,
        (city: string, state: string) => `**${city}** homeowners searching for **gutter repair near me** trust our local experts for everything from new installations to emergency leak repairs. We've completed thousands of projects across **${state}** with a 4.9/5 customer satisfaction rating.`,
        (city: string, state: string) => `Stop water damage before it starts. **Gutter installation near me in ${city}** has never been easier. Our **${state}** licensed, insured, and bonded professionals are ready to protect your home with top-quality seamless gutters and gutter guards.`,
        (city: string, state: string) => `When you search for **reliable gutter services near me**, ${city} residents consistently choose US Gutter Installation for transparent pricing, premium materials, and our famous "no leak" workmanship guarantee. Serving all of **${state}**.`,
        (city: string, state: string) => `Your home in **${city}** deserves the best protection. Our **certified gutter contractors near me** use only commercial-grade aluminum, copper, and stainless steel gutter systems designed for **${state}**'s climate conditions.`,
        (city: string, state: string) => `Looking for **affordable gutter installation near me in ${city}**? Get quality that lasts without breaking the bank. Every gutter installation in **${state}** comes with our industry-leading lifetime warranty on materials.`,
        (city: string, state: string) => `For over a decade, we've been the go-to name for **gutter replacement near me** in **${city}, ${state}**. Our EPA RRP certified crews handle everything from simple gutter cleaning to complete gutter system overhauls.`,
        (city: string, state: string) => `Why search for **gutter cleaning near me in ${city}** every year? Invest in our micro-mesh **gutter guards near me** and never clean your gutters again. We serve all neighborhoods in **${state}** with free on-site estimates.`,
        (city: string, state: string) => `Homeowners in **${city}** ask us: "Who offers the best **leaf guard gutters near me**?" Our answer: micro-mesh technology that blocks leaves, pine needles, and debris while letting water flow freely. Available throughout **${state}**.`,
        (city: string, state: string) => `Is your **soffit and fascia near me in ${city}** showing signs of rot or water damage? Our ${state} gutter specialists repair and replace soffits, fascias, and gutters in a single professional visit.`,
        (city: string, state: string) => `Emergency **gutter repair near me in ${city}**? We offer 24-48 hour response for active leaks and storm damage. Our **${state}** crews are ready with same-day quotes and fast professional repairs.`,
        (city: string, state: string) => `**${city}** residents searching for **commercial gutter installation near me** trust our OSHA-compliant crews for retail, warehouse, and multi-family buildings across **${state}**. Industrial-grade box gutters and heavy-duty downspouts available.`,
    ],
    serviceDescs: [
        (city: string) => `Our **${city}** teams are equipped with mobile fabrication machines to create seamless 5-inch and 6-inch K-style or half-round gutters on-site. When you search for **gutter repair near me** or **gutter installation near me**, you expect fast, local, professional service—that's exactly what we deliver.`,
        (city: string) => `We bring our portable gutter factory right to your driveway in **${city}**. By custom-cutting seamless aluminum channels (0.027 or 0.032 gauge) on-site, we eliminate all leak points. We're the proven local experts when you search for **seamless gutters near me**.`,
        (city: string) => `Our **${city}** installers use commercial-grade hidden hangers spaced every 18-24 inches for maximum strength and longevity. Serving all neighborhoods, we're the top choice for **gutter cleaning near me** and **gutter guards near me**.`,
        (city: string) => `From 5-inch residential K-style to 6-inch high-capacity systems, our **${city}** crews precisely match the right gutter size to your roof's square footage, pitch, and local rainfall intensity.`,
        (city: string) => `Every installation in **${city}** includes properly sized 2x3 or 3x4 rectangular downspouts with quality leaf strainers. We calculate the optimal number and placement based on your roofline's specific drainage requirements.`,
        (city: string) => `Our technicians in **${city}** are factory-trained to identify and correct improper gutter slope (we use the industry-standard 1/4" drop per 10 linear feet) ensuring water flows correctly without pooling or overflow.`,
        (city: string) => `We specialize in both aluminum and copper seamless gutters in **${city}**. Our copper installations include hand-soldered joints and a natural patina finish that significantly increases your home's curb appeal and value.`,
        (city: string) => `For homes in **${city}** with complex rooflines, dormers, or multi-level structures, we custom-fabricate inside and outside miters on-site using our portable gutter machines. Every angle is precision-fit—no pre-cut pieces.`,
        (city: string) => `Need **gutter guards near me**? Our **${city}** installation teams offer multiple leaf protection options including micro-mesh, screen, and reverse-curve systems to match your budget and debris type.`,
        (city: string) => `Searching for **ice dam removal near me**? Our **${city}** crews install heated gutter cables, ice and water shields, and properly insulated gutter systems to prevent dangerous and damaging ice dams.`,
    ],
    materials: [
        "We offer **5-inch K-style** (handles 5,520 sq ft of roof) and **6-inch K-style** (handles 7,960 sq ft) seamless aluminum gutters. Choose from **20+ factory colors** in durable baked enamel finish. Perfect for homeowners searching for **seamless gutters near me**.",
        "Our premium **0.032 gauge aluminum** gutters are 20% thicker than standard 0.027 gauge, providing superior dent resistance and a lifespan of 30+ years. Ideal for high-traffic areas and homes with heavy tree coverage searching for **gutter installation near me**.",
        "For luxury and historic homes, our **copper gutter systems** (16 oz or 20 oz weight) develop a beautiful natural patina over time and can last 75+ years. The top choice when you want **copper gutters near me**.",
        "We install **half-round gutters** in 5\" and 6\" sizes for historic homes, Victorian, and Tudor-style architecture. Available in aluminum, copper, and galvanized steel for homeowners who want **gutter replacement near me** that matches their home's character.",
        "All our aluminum gutters feature **hidden hanger brackets** rated for 25+ lbs each, spaced every 18-24 inches to support heavy rain loads, ice, and snow without sagging. Essential for **gutter repair near me** prevention.",
        "Our **galvanized steel gutters** (26 gauge) offer superior strength for commercial applications. With a zinc coating that resists rust for 20+ years, they're perfect for businesses searching for **commercial gutters near me**.",
        "We offer **2x3 inch** and **3x4 inch rectangular downspouts** appropriately sized for your gutter capacity. Larger 3x4 downspouts move 50% more water per minute—critical for heavy rainfall areas needing **downspout installation near me**.",
        "Every gutter system includes our high-capacity **leaf strainers** and optional **micro-mesh gutter guards** with 50-micron openings that block pine needles, roof grit, and even helicopter seeds. Stop searching for **gutter cleaning near me** forever.",
    ],
    whyChoose: [
        (city: string) => `We're not just contractors; we're your neighbors in **${city}**. We understand local building codes, common architectural styles, and neighborhood HOA requirements. That's why we're the most recommended **gutter installers near me**.`,
        (city: string) => `With years of experience serving **${city}**, we've built a reputation for honesty, quality, and reliability. When you want **gutter services near me** that treat your home like their own, look no further.`,
        (city: string) => `Local expertise matters for lasting results. Our installers in **${city}** are trained to identify potential drainage issues specific to your property's grade, landscaping, and soil conditions.`,
        (city: string) => `Every gutter installation in **${city}** comes with our comprehensive warranty: lifetime coverage on materials, 10 years on labor. We stand behind our **gutter installation near me** work 100%.`,
        (city: string) => `Our **${city}** crews arrive on time, complete most jobs in a single day, and leave your property cleaner than they found it. We haul away all old materials at no extra charge—that's the **gutter companies near me** experience you deserve.`,
        (city: string) => `We're BBB A+ rated with a consistent 4.9/5 star rating across 10,000+ verified reviews. **${city}** homeowners trust us because we deliver what we promise: quality **gutter repair near me** that lasts.`,
        (city: string) => `Unlike big-box store subcontractors, our **${city}** team consists of full-time W-2 employees who are background-checked, drug-tested, and manufacturer-certified. That's the **gutter installers near me** difference.`,
        (city: string) => `We offer free on-site estimates in **${city}** with detailed written quotes. No hidden fees, no surprises, no high-pressure sales—just honest advice and quality **gutter installation near me** service.`,
    ],
    technicalSpecs: [
        "**Gutter Sizes:** 5-inch K-style (standard residential), 6-inch K-style (high-capacity), 5-inch half-round, 6-inch half-round. **Downspouts:** 2x3\", 3x4\", or 4\" round. Proper sizing is why professionals recommend **gutter installation near me** over DIY.",
        "**Gutter Pitch:** We install at the industry-standard 1/4-inch slope per 10 linear feet to ensure proper drainage. Maximum run of 40 feet before a downspout. This precision is what sets **gutter installers near me** apart.",
        "**Hanger Spacing:** Our hidden hangers are installed every 18-24 inches (vs. competitors' 36\") for superior strength against ice loads, heavy debris, and ladder damage. Key to long-lasting **seamless gutters near me**.",
        "**Material Thickness:** Standard 0.027 gauge for residential, heavy-duty 0.032 gauge for high-exposure areas, or premium 16-20 oz copper. The right material choice is why homeowners search for **professional gutter companies near me**.",
        "**Downspout Capacity:** 2x3\" handles 600 sq ft of roof per downspout. 3x4\" handles 1,200 sq ft. We calculate based on your specific roofline and local rainfall data—precision **downspout installation near me**.",
        "**Fascia Attachment:** We use zinc-plated wood screws (never nails) at every rafter tail for secure mounting that won't loosen over time. This professional technique is what you expect from **gutter repair near me** experts.",
    ],
    climateConsiderations: [
        (stateCode: string) => `In ${stateCode}, we engineer gutter systems specifically to handle ${getClimateContent(stateCode)}. Our installations account for local weather extremes—that's why homeowners search for **gutter installation near me** experts who know the region.`,
        (stateCode: string) => `${stateCode} weather requires gutters that can withstand ${getClimateContent(stateCode)}. We use climate-appropriate materials and mounting techniques. Local **gutter companies near me** understand these unique challenges.`,
        (stateCode: string) => `For ${stateCode} homes, we recommend gutter guards and proper sizing to effectively manage ${getClimateContent(stateCode)}. Ask about our climate-specific recommendations when searching for **gutter guards near me**.`,
        (stateCode: string) => `Living in ${stateCode} means dealing with ${getClimateContent(stateCode)}. Our **gutter installers near me** are factory-trained on systems designed for exactly these conditions.`,
    ]
}

// Simple string hash function for deterministic selection
function getHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
}

export function getSEOContent(city: string, state: string, stateCode?: string): ContentVars {
    const hash = getHash(city + state)
    const code = stateCode?.toUpperCase() || state.substring(0, 2).toUpperCase()

    // Select variants using modulo of the hash - now with 10 intro variants for more diversity
    const introFn = VARIANTS.intros[hash % VARIANTS.intros.length]
    const serviceFn = VARIANTS.serviceDescs[(hash >> 1) % VARIANTS.serviceDescs.length]
    const materialTxt = VARIANTS.materials[(hash >> 2) % VARIANTS.materials.length]
    const whyFn = VARIANTS.whyChoose[(hash >> 3) % VARIANTS.whyChoose.length]
    const techSpec = VARIANTS.technicalSpecs[(hash >> 4) % VARIANTS.technicalSpecs.length]
    const climateFn = VARIANTS.climateConsiderations[(hash >> 5) % VARIANTS.climateConsiderations.length]

    return {
        intro: introFn(city, state),
        serviceDesc: serviceFn(city),
        materials: materialTxt,
        whyChoose: whyFn(city),
        technicalSpecs: techSpec,
        climateConsiderations: climateFn(code),
        processIntro: "Our streamlined four-step process—Inspection, Measurement, Fabrication, Installation—takes the hassle out of home improvement.",
        faqAnswers: {
            cost: `In ${city}, seamless aluminum gutter installation typically costs $6-12 per linear foot, while copper ranges from $25-40. A standard 150-200 linear foot home averages $1,200-$2,400 for aluminum or $4,500-$8,000 for copper.`,
            timeline: `Our ${city} crews complete most residential gutter installations in a single 4-6 hour day. Complex rooflines or full copper systems may require two days.`,
            warranty: `Every installation in ${city} includes our industry-leading warranty: lifetime coverage on materials against manufacturing defects, plus 10 years on labor and workmanship.`,
            permit: `Most residential gutter replacements in ${city} don't require permits, but we verify local ${state} building codes for every project and pull permits when needed.`
        }
    }
}
