export interface AINicheConfig {
    primary_service: string;
    keywords: string[];
    services: {
        title: string;
        slug: string;
        description: string;
        icon: string;
        hero_image?: string;
        features?: string[];
        benefits?: string[];
        process?: string[];
        materials?: { name: string; description: string }[];
        faqs?: { question: string; answer: string }[];
    }[];
    faqs: {
        question: string;
        answer: string;
    }[];
    home_faqs?: {
        question: string;
        answer: string;
    }[];
    state_faqs?: {
        question: string;
        answer: string;
    }[];
    city_faqs?: {
        question: string;
        answer: string;
    }[];
    homepage_intro?: string;
}

export const DEFAULT_PROMPT = `You are an expert SEO content strategist and local service business consultant with 15+ years of experience in programmatic SEO, EEAT optimization, and lead generation.

Your mission: Create a comprehensive, search-optimized website configuration for the niche: "{{nicheName}}".

═══════════════════════════════════════════════════════════════════
📋 STRICT GENERATION REQUIREMENTS
═══════════════════════════════════════════════════════════════════

CONTENT VOLUME:
✓ Generate EXACTLY 10 Services (each service must be distinct and valuable and must be related to the niche and must be high search volume services)
✓ Generate EXACTLY 5 7 FAQs per service (service-specific questions with {{city}} placeholders)
✓ Generate EXACTLY 5 FAQs for "faqs" (General industry questions)
✓ Generate EXACTLY 5 FAQs for "home_faqs" (National/homepage questions)
✓ Generate EXACTLY 5 FAQs for "state_faqs" (State-specific questions)
✓ Generate EXACTLY 5 FAQs for "city_faqs" (Local city questions)
✓ Generate 4-6 features, 4-6 benefits, and 5-7 process steps per service
✓ Generate 3-5 paragraphs (200-300 words) of Niche-Specific Homepage Introductory Content

QUALITY STANDARDS:
→ Each FAQ must be 2-4 sentences for comprehensive answers
→ Each service description must be 2-3 sentences with clear value proposition
→ Use professional, authoritative tone (avoid marketing fluff)
→ Include specific technical terms, industry jargon, and entity names

═══════════════════════════════════════════════════════════════════
🎯 EEAT OPTIMIZATION (Experience, Expertise, Authoritativeness, Trust)
═══════════════════════════════════════════════════════════════════

EXPERIENCE:
→ Use first-person plural ("we", "our team") to demonstrate real-world experience
→ Include specific scenarios, common problems, and realistic timelines
→ Reference years of service, certifications, or industry standards where applicable

EXPERTISE:
→ Use industry-specific terminology and technical vocabulary
→ Mention tools, equipment brands, materials, and methodologies by name
→ Explain WHY certain approaches are better (demonstrate deep knowledge)

AUTHORITATIVENESS:
→ Reference building codes, industry standards, or regulations when relevant
→ Use confident, definitive language ("industry best practice", "code-compliant")
→ Cite specific benefits backed by reasoning (not just claims)

TRUSTWORTHINESS:
→ Be transparent about processes, timelines, and what customers can expect
→ Include warranties, guarantees, or quality assurance mentions
→ Use reassuring language about safety, licensing, insurance

═══════════════════════════════════════════════════════════════════
🔍 SEO & ENTITY OPTIMIZATION
═══════════════════════════════════════════════════════════════════

SEMANTIC ENTITIES (CRITICAL - Use liberally throughout):
For EACH service, you MUST include 8-15 related entities:
→ Tools & Equipment: Brand names, specific models, industry-standard tools
→ Materials: Specific product names, material types, grades, specifications
→ Techniques: Industry methods, processes, installation types
→ Problems Solved: Specific issues, symptoms, failure modes
→ Certifications: Licenses, training programs, industry associations
→ Related Services: Complementary services, related work
→ Industry Terms: Technical vocabulary, trade jargon, specialized language

EXAMPLE for "Drain Cleaning":
✓ Tools: hydro-jetting equipment, snake augers, camera inspection systems, Ridgid SeeSnake
✓ Materials: PVC pipes, cast iron, ABS, copper, galvanized steel
✓ Problems: tree root intrusion, grease buildup, bellied pipes, clog removal
✓ Techniques: trenchless repair, pipe bursting, CIPP lining, rooter service
✓ Industry: NASSCO certification, PACP standards, municipal codes

ENTITY PLACEMENT:
→ Sprinkle entities naturally in descriptions, features, benefits, process, materials, FAQs
→ Don't stuff - make it read naturally and professionally
→ Use entities in context (explain what they are if technical)

SEARCH INTENT TARGETING:
→ Include transactional keywords: "repair", "installation", "replacement", "service"
→ Include informational keywords: "cost", "how long", "when to", "signs of"
→ Include local modifiers using placeholders: "in {{city}}", "{{state}} residents"
→ Include urgency terms: "emergency", "same-day", "24/7", "immediate"

═══════════════════════════════════════════════════════════════════
🌍 DYNAMIC PLACEHOLDER SYSTEM (CRITICAL FOR UNIQUENESS)
═══════════════════════════════════════════════════════════════════

To ensure UNIQUE content across thousands of city pages, you MUST use placeholders:

Available Placeholders:
{{city}} → Replaced with city name (e.g., "Phoenix", "Brooklyn")
{{state}} → Replaced with full state name (e.g., "Arizona", "New York")
{{stateCode}} → Replaced with 2-letter code (e.g., "AZ", "NY")
{{service}} → Replaced with specific service name

WHERE TO USE PLACEHOLDERS:
✓ Service descriptions: "Serving homeowners in {{city}}"
✓ Features: "Licensed contractors in {{state}}"
✓ Benefits: "Same-day service in {{city}}"
✓ Process steps: "We arrive at your {{city}} home within 2 hours"
✓ Materials: "Code-compliant with {{state}} building standards"
✓ FAQ answers: "In {{city}}, we typically complete installation within 3-5 days"

PLACEHOLDER DENSITY:
→ Use {{city}} in 60-80% of content sections
→ Use {{state}} in 30-50% of content sections
→ Every FAQ answer should include at least ONE placeholder
→ Balance: Don't overuse in one sentence, spread naturally

═══════════════════════════════════════════════════════════════════
📝 HOMEPAGE CONTENT SEMANTIC SEO STANDARDS (CRITICAL)
═══════════════════════════════════════════════════════════════════

The "homepage_intro" is your primary organic signal. It must be SEMANTICALLY OPTIMIZED:

1. TOPICAL DEPTH: Go beyond surface-level facts. Discuss the "Silent Killers" of the niche (e.g., hidden moisture, structural fatigue), the technical precision required for lasting results, and the long-term ROI of expert work.
2. SEMANTIC HIERARCHY:
   - Start with one authoritative <h1> (e.g. "Elite {{nicheName}} Solutions in {{city}}, {{state}}").
   - Use multiple <h2> as context-shifting pillars.
   - Use <h3> for detailed technical breakdowns.
   - Use <ul> and <li> for high-value feature/benefit clusters.
3. ENTITY & LSI DENSITY: Naturally integrate high-value semantic entities (materials, methods, tools, regulations).
4. LOCAL RELEVANCE: Connect the technical aspects of the service specifically to {{state}}'s climate or {{city}}'s local infrastructure.
5. EEAT FINALE: Conclude with a strong statement of local authority, mentioning {{brand}}'s commitment to safety, licensing, and {{state}} community standards.

═══════════════════════════════════════════════════════════════════
📊 JSON OUTPUT STRUCTURE
═══════════════════════════════════════════════════════════════════

{
    "primary_service": "Main Service Name (e.g., 'Gutter Installation')",
    "homepage_intro": "<h1>Authoritative {{nicheName}} in {{city}}, {{state}}</h1> <p>Expert semantic intro about the industry standards in {{state}}...</p> <h2>Technical Expertise in {{city}}</h2> <p>Detailed look at specific challenges and {{brand}} solutions...</p> <ul><li>Semantic benefit item with technical term</li></ul> <p>Final EEAT-driven conclusion.</p>",
    "keywords": [
        "20 SEO keywords targeting different search intents",
        "Include: transactional, informational, local, long-tail variants",
        "Example: 'emergency gutter repair', 'gutter installation cost', 'best gutter company near me'"
    ],
    "services": [
        {
            "title": "Service Name (action-oriented, clear)",
            "slug": "url-friendly-slug-lowercase",
            "description": "2-3 sentence value proposition using {{city}} placeholder and 3-5 entities. Explain what, why, and who it's for.",
            "icon": "One relevant emoji",
            "hero_image": "https://images.unsplash.com/photo-XXXXX (find relevant, high-quality image)",
            "features": [
                "Feature with {{city}} and specific entity/tool mention",
                "Feature explaining technical capability with industry term",
                "Feature highlighting certification or expertise",
                "Feature about speed/convenience in {{state}}"
            ],
            "benefits": [
                "Benefit explaining outcome with {{state}} placeholder",
                "Benefit with cost savings or ROI mention",
                "Benefit about safety, compliance, or warranty",
                "Benefit comparing to DIY or competitors"
            ],
            "process": [
                "Step 1: Initial action in {{city}} with timeline",
                "Step 2: Technical step with specific tool/method",
                "Step 3: Another detailed step with entity",
                "Step 4: Quality check or verification step",
                "Step 5: Completion and follow-up in {{state}}"
            ],
            "materials": [
                {
                    "name": "Specific Material/Tool Brand Name",
                    "description": "Why we use it for {{service}} - mention durability, code compliance, or performance benefit"
                }
            ],
            "faqs": [
                {"question": "How much does {{service}} cost in {{city}}?", "answer": "Pricing for {{service}} in {{city}} varies based on scope and materials. We provide free, no-obligation estimates."},
                {"question": "How long does {{service}} take?", "answer": "Most {{service}} projects in {{city}} are completed in 1-2 days depending on complexity."},
                {"question": "Is {{service}} covered by warranty?", "answer": "Yes! All our {{service}} work in {{city}} comes with comprehensive warranty coverage."},
                {"question": "Do I need permits for {{service}} in {{city}}?", "answer": "Permit requirements vary by {{city}} municipality. We handle all permit paperwork."},
                {"question": "What's the best time for {{service}} in {{state}}?", "answer": "In {{state}}, we recommend scheduling during {{service}} during mild weather for best results."},
                {"question": "Why choose professional {{service}}?", "answer": "Professional {{service}} in {{city}} ensures code compliance, safety, and long-term reliability."}
            ]
        }
    ],
    "faqs": [
        {"question": "General niche question (industry-wide concern)", "answer": "Answer with {{city}}, entities, demonstrating expertise and trustworthiness"},
        {"question": "Cost or pricing question", "answer": "Transparent answer using {{state}}, mention factors that affect pricing"},
        {"question": "Timeline or process question", "answer": "Clear timeline with {{city}}, explain typical scenarios"},
        {"question": "Quality or warranty question", "answer": "Answer emphasizing EEAT - certifications, guarantees, standards"},
        {"question": "Problem identification question", "answer": "Help user diagnose with entities, mention when to call professional"}
    ],
    "home_faqs": [
        {"question": "Broad national question about the service", "answer": "Industry-wide answer, mention nationwide coverage or national standards"},
        {"question": "How to choose a provider question", "answer": "Educational answer demonstrating expertise, list what to look for"},
        {"question": "Industry misconception or myth", "answer": "Correct the misconception with authoritative explanation and entities"},
        {"question": "Regulatory or licensing question", "answer": "Explain industry regulations, importance of licensing, insurance"},
        {"question": "Technology or innovation question", "answer": "Showcase modern methods, tools, explain benefits over old approaches"}
    ],
    "state_faqs": [
        {"question": "Question about state-specific regulations or codes", "answer": "Answer using {{state}}, mention specific {{state}} building codes or requirements with entities"},
        {"question": "Climate or geography-specific question", "answer": "Address {{state}} climate concerns (weather, terrain) and how service adapts"},
        {"question": "Availability or coverage question", "answer": "Explain service coverage across {{state}}, mention major cities or counties"},
        {"question": "State-specific pricing or cost question", "answer": "Address {{state}} market factors, regional pricing, local competition"},
        {"question": "Local supplier or material question", "answer": "Mention {{state}}-based suppliers, locally-sourced materials, regional preferences"}
    ],
    "city_faqs": [
        {"question": "Local service availability question", "answer": "Emphasize {{city}} presence, same-day service, local dispatch, with specific {{city}} neighborhoods"},
        {"question": "Permit or local regulation question", "answer": "Address {{city}} permit requirements, HOA rules, local ordinances with entities"},
        {"question": "Local pricing or quote question", "answer": "Mention {{city}} pricing factors, offer free estimate, reference local competition"},
        {"question": "Emergency or urgent service question", "answer": "Highlight {{city}} emergency response, 24/7 availability, fast arrival times"},
        {"question": "Local reputation or reviews question", "answer": "Mention {{city}} customer satisfaction, local reviews, community involvement"}
    ]
}

═══════════════════════════════════════════════════════════════════
⚠️ CRITICAL RULES - DO NOT VIOLATE
═══════════════════════════════════════════════════════════════════

1. Return ONLY valid JSON (no markdown, no explanations, no extra text)
2. Every array must have the EXACT count specified above
3. Use placeholders {{city}}, {{state}}, {{stateCode}} liberally for uniqueness
4. Include minimum 8-15 entities per service (tools, materials, techniques, problems)
5. Write in professional, authoritative tone (EEAT principles)
6. Every FAQ answer must be 2-4 sentences minimum
7. Every service description must mention specific value and use 3-5 entities
8. No generic content - be specific, detailed, and useful

BEGIN CONTENT GENERATION NOW.`;


export async function generateNicheWithAI(nicheName: string, apiKey: string, model: string = "openai/gpt-4o-mini", customPrompt?: string): Promise<AINicheConfig | null> {
    if (!apiKey) {
        console.error("AI Generation Error: No API key provided");
        throw new Error("OpenRouter API key is missing. Add it in Site Settings.");
    }

    let prompt = customPrompt || DEFAULT_PROMPT;
    prompt = prompt.replace('{{nicheName}}', nicheName);

    console.log("AI Generation Started:", { nicheName, model, hasCustomPrompt: !!customPrompt });

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://niche-scaling-system.com",
                "X-Title": "Niche Site Generator"
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.8,
                response_format: { type: "json_object" }
            })
        });

        console.log("API Response Status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error Response:", errorText);
            throw new Error(`API returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("API Response Data:", JSON.stringify(data).slice(0, 500));

        const content = data.choices?.[0]?.message?.content;

        if (!content) {
            console.error("No content in API response:", data);
            throw new Error(data.error?.message || "No content received from AI. Check model availability.");
        }

        console.log("AI Content Generated Successfully, length:", content.length);
        return JSON.parse(content) as AINicheConfig;
    } catch (error: any) {
        console.error("AI Niche Generation Error:", error);
        throw error; // Re-throw so the caller can handle it
    }
}
