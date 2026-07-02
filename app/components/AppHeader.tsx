'use client'

import Image from 'next/image'
import Link from 'next/link'

const navItems = [
  { href: '/', label: 'Ranking' },
  { href: '/bracket', label: 'Bracket' },
  { href: '/admin', label: 'Admin' },
]

export default function AppHeader({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-slate-200 group-hover:ring-accent transition-colors">
            <Image
              src="/kiara.jpeg"
              alt="Kiara"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl font-semibold tracking-tight text-slate-900">
              Mundial Oficina
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              2026
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = item.href === '/admin' ? isAdmin : undefined
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-accent text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
