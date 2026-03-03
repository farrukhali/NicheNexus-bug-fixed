import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware to 301 redirect URLs containing accented/special characters
 * to their ASCII-safe equivalents.
 * 
 * e.g. /pr/mariano-colón/... → /pr/mariano-colon/...
 *      /tx/lopeño/...        → /tx/lopeno/...
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Decode the pathname to get the actual characters (browsers send percent-encoded)
    let decoded: string
    try {
        decoded = decodeURIComponent(pathname)
    } catch {
        // If decoding fails, let it pass through
        return NextResponse.next()
    }

    // Quick check: if the decoded path is pure ASCII, skip processing entirely
    // This avoids any interference with normal URLs
    if (/^[\x00-\x7F]*$/.test(decoded)) {
        return NextResponse.next()
    }

    // Normalize: strip diacritics using NFD decomposition
    // Only strip combining diacritical marks, keep everything else intact
    const normalized = decoded
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')    // Strip combining diacritical marks only

    // Only redirect if the normalized path is different
    if (normalized !== decoded) {
        const url = request.nextUrl.clone()
        url.pathname = normalized
        return NextResponse.redirect(url, 301)
    }

    return NextResponse.next()
}

// Only run middleware on page routes (skip API, _next, static files)
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
    ],
}
