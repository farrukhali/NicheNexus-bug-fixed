export interface ServiceDetail {
    title: string
    slug: string
    description: (city: string, state: string) => string
    icon: string
    features: string[]
    benefits: string[]
}

export const servicesData: Record<string, ServiceDetail> = {
    "seamless-gutter-installation": {
        title: "Seamless Gutter Installation",
        slug: "seamless-gutter-installation",
        description: (city, state) => `Searching for seamless gutter installation near me in ${city}, ${state}? Our custom-fit 5" and 6" K-style seamless aluminum gutters are fabricated on-site to eliminate leaks. Licensed, insured, EPA RRP certified crews with lifetime warranty.`,
        icon: "🔧",
        features: ["Custom on-site fabrication with portable gutter machines", "5-inch and 6-inch K-style options", "0.027 and 0.032 gauge aluminum available", "20+ color options with baked enamel finish", "Professional hidden hanger installation"],
        benefits: ["No seams means no leaks", "Improved aesthetics and curb appeal", "30+ year lifespan with proper maintenance", "Lifetime transferable warranty", "Same-day installation available"]
    },
    "gutter-guards-leaf-protection": {
        title: "Gutter Guards & Leaf Protection",
        slug: "gutter-guards-leaf-protection",
        description: (city, state) => `Looking for gutter guards near me in ${city}, ${state}? Our micro-mesh leaf guard systems with 50-micron openings block pine needles, leaves, and roof grit. Stop cleaning your gutters forever with professional leaf guard gutters near me.`,
        icon: "🛡️",
        features: ["Micro-mesh technology with 50-micron openings", "Fits existing 5\" and 6\" gutters", "Marine-grade stainless steel mesh", "Hidden fastener system", "Multiple protection levels available"],
        benefits: ["Eliminate gutter maintenance forever", "Prevents ice dams in winter", "Protects foundation from overflow", "25-year no-clog guarantee", "Increases gutter system lifespan"]
    },
    "gutter-cleaning-maintenance": {
        title: "Gutter Cleaning & Maintenance",
        slug: "gutter-cleaning-maintenance",
        description: (city, state) => `Need gutter cleaning near me in ${city}, ${state}? Our licensed technicians safely remove leaves, debris, and granules, flush downspouts, and inspect your entire drainage system. Same-day gutter cleaning service available.`,
        icon: "🧹",
        features: ["Thorough debris removal and bagging", "2x3\" and 3x4\" downspout flushing", "Full system inspection and report", "Before/after photo documentation", "Roof debris check included"],
        benefits: ["Prevents water damage and foundation issues", "Extends gutter lifespan", "No ladders needed for homeowners", "Annual maintenance plans available", "Identifies problems before they're expensive"]
    },
    "downspout-installation-extensions": {
        title: "Downspout Installation & Extensions",
        slug: "downspout-installation-extensions",
        description: (city, state) => `Searching for downspout installation near me in ${city}, ${state}? We install 2x3" and 3x4" rectangular downspouts strategically sized for your roof. Underground drainage extensions keep water 10+ feet from your foundation.`,
        icon: "💧",
        features: ["2x3\" standard and 3x4\" high-capacity options", "Underground drain connections available", "Pop-up emitters for invisible drainage", "Proper sizing based on roof area", "French drain integration"],
        benefits: ["Protects foundation from water damage", "Prevents soil erosion", "Manages high-volume rain events", "Improves landscape appearance", "Eliminates basement moisture problems"]
    },
    "soffit-fascia-repair": {
        title: "Soffit & Fascia Repair",
        slug: "soffit-fascia-repair",
        description: (city, state) => `Looking for soffit and fascia repair near me in ${city}, ${state}? We replace rotted wood fascia, install aluminum fascia covers, and repair ventilated soffit panels. Color matching included. Licensed soffit repair contractors near me.`,
        icon: "🏠",
        features: ["Wood and aluminum fascia options", "Ventilated and solid soffit panels", "Rot and water damage repair", "Custom color matching to existing trim", "Pest damage restoration"],
        benefits: ["Prevents pest and wildlife entry", "Improves attic ventilation", "Restores roofline aesthetics", "Protects rafters from moisture", "Increases home value"]
    },
    "copper-gutter-systems": {
        title: "Copper Gutter Systems",
        slug: "copper-gutter-systems",
        description: (city, state) => `Want copper gutter installation near me in ${city}, ${state}? Our premium 16oz and 20oz copper gutter systems feature hand-soldered joints and develop a beautiful natural patina. Copper gutters near me with 75+ year lifespan.`,
        icon: "✨",
        features: ["16oz and 20oz weight options", "Hand-soldered seams and joints", "Half-round and K-style profiles", "Natural patina development", "Custom fabrication available"],
        benefits: ["75+ year expected lifespan", "Increases home value significantly", "Never rusts or corrodes", "Architectural beauty and elegance", "Historic home compatible"]
    },
    "commercial-gutter-services": {
        title: "Commercial Gutter Services",
        slug: "commercial-gutter-services",
        description: (city, state) => `Need commercial gutter installation near me in ${city}, ${state}? Our OSHA-compliant crews specialize in box gutters, industrial downspouts, and high-capacity drainage for retail, warehouse, and multi-family buildings.`,
        icon: "🏢",
        features: ["Box gutters and industrial profiles", "Large 4x5\" and 6\" round downspouts", "Scheduled maintenance contracts", "OSHA-compliant installation crews", "Multi-story building expertise"],
        benefits: ["Protects commercial assets", "Handles extreme water volume", "Minimizes business disruption", "Professional appearance maintenance", "Preventive maintenance programs"]
    },
    "storm-damage-repair": {
        title: "Storm Damage Repair",
        slug: "storm-damage-repair",
        description: (city, state) => `Need emergency gutter repair near me in ${city}, ${state} after a storm? Fast 24-48 hour response for gutters damaged by wind, hail, or fallen branches. We work directly with insurance adjusters for seamless storm damage claims.`,
        icon: "⛈️",
        features: ["24-48 hour emergency response", "Insurance claim documentation", "Damage assessment and estimates", "Temporary repairs to prevent further damage", "Full photo documentation"],
        benefits: ["Restores home protection quickly", "Prevents secondary water damage", "Stress-free insurance process", "Licensed, insured, and bonded", "Emergency crew availability"]
    },
    "ice-dam-removal": {
        title: "Ice Dam Removal",
        slug: "ice-dam-removal",
        description: (city, state) => `Searching for ice dam removal near me in ${city}, ${state}? Our low-pressure steam removal safely melts ice dams without damaging shingles or gutters. Professional ice dam prevention systems and heated gutter cables available.`,
        icon: "❄️",
        features: ["Low-pressure steam removal (safe for shingles)", "Heat cable installation available", "Ice and water shield installation", "Attic insulation assessment", "Gutter heating systems"],
        benefits: ["Prevents interior roof leaks", "Protects gutters from ice weight", "Safe for all roofing materials", "Long-term prevention options", "Emergency same-day service"]
    },
    "underground-drain-solutions": {
        title: "Underground Drain Solutions",
        slug: "underground-drain-solutions",
        description: (city, state) => `Need drainage solutions near me in ${city}, ${state}? We install French drains, buried downspout extensions, and pop-up emitters to move water far from your foundation. Professional drainage contractors near me guarantee dry basements.`,
        icon: "🚇",
        features: ["French drains with perforated pipe", "Buried corrugated drainage lines", "Pop-up emitters at discharge points", "Proper grading and slope calculation", "Sump pump connections"],
        benefits: ["Eliminates yard puddles and soggy spots", "Keeps basements and crawlspaces dry", "Cleaner landscape appearance", "Protects foundation long-term", "Reduces mosquito breeding areas"]
    },
    "color-gutter-matching": {
        title: "Color Gutter Matching",
        slug: "color-gutter-matching",
        description: (city, state) => `Looking for custom color gutters near me in ${city}, ${state}? Choose from 20+ factory colors or custom-painted gutters to perfectly match your home's siding, trim, and architectural style. Professional color matching service.`,
        icon: "🎨",
        features: ["20+ standard aluminum colors", "Custom paint matching available", "Kynar/Hylar finish options", "Sample chips for approval", "Fade-resistant factory finishes"],
        benefits: ["Seamless color coordination", "Boosts curb appeal and home value", "Long-lasting factory finish", "Personalized aesthetic", "HOA-approved color options"]
    },
    "emergency-gutter-repair": {
        title: "Emergency Gutter Repair",
        slug: "emergency-gutter-repair",
        description: (city, state) => `Need urgent gutter repair near me in ${city}, ${state}? When you have an active leak, sagging gutter, or storm damage, our emergency crews respond within hours. 7-day availability for gutter emergencies near me.`,
        icon: "🚨",
        features: ["Same-day and next-day availability", "After-hours emergency line", "Temporary waterproofing solutions", "Full repair or replacement options", "24/7 emergency hotline"],
        benefits: ["Prevents active water damage", "Immediate professional response", "Honest assessment and fair pricing", "Licensed and insured crews", "No overtime surge pricing"]
    }
}


