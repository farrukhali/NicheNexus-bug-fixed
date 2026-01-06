import { NextResponse } from 'next/server'

// API endpoint to ping Google about sitemap updates
// Usage: POST /api/ping-google
// This should be called after deploying new content

export async function POST() {
    const sitemapUrl = 'https://usgutterinstallation.com/sitemap.xml'

    try {
        // Ping Google
        const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
        const googleResponse = await fetch(googlePingUrl)

        // Ping Bing
        const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
        const bingResponse = await fetch(bingPingUrl)

        return NextResponse.json({
            success: true,
            google: googleResponse.ok ? 'Pinged successfully' : 'Failed',
            bing: bingResponse.ok ? 'Pinged successfully' : 'Failed',
            timestamp: new Date().toISOString(),
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: String(error),
        }, { status: 500 })
    }
}

// GET endpoint for easy testing
export async function GET() {
    return NextResponse.json({
        message: 'Use POST to ping search engines about sitemap updates',
        endpoint: '/api/ping-google',
        method: 'POST',
    })
}
