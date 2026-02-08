import Link from 'next/link'
import { SiteConfig } from '@/lib/site-config'
import { NavbarCallBtn } from './CallBtn'

interface NavbarProps {
    siteConfig: SiteConfig
}

export default function Navbar({ siteConfig }: NavbarProps) {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 group">
                    {siteConfig.logoUrl ? (
                        <img
                            src={siteConfig.logoUrl}
                            alt={siteConfig.siteName}
                            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                        />
                    ) : (
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-500">
                            {siteConfig.siteName}
                        </span>
                    )}
                </Link>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
                        <Link href="/" className="hover:text-blue-600 transition-colors">Locations</Link>
                        <Link href="/about" className="hover:text-blue-600 transition-colors">About</Link>
                        <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
                    </div>
                    <NavbarCallBtn />
                </div>
            </div>
        </nav>
    )
}
