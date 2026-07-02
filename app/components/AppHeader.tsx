'use client'

import Link from 'next/link'

export default function AppHeader({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <header className="bg-[#1e1e1e] border-b border-[#2a2a2a] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-white text-lg">
          Oficina &apos;26 ⚽
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Ranking
          </Link>
          <Link
            href="/bracket"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Bracket
          </Link>
          <Link
            href="/admin"
            className={`transition-colors ${
              isAdmin ? 'text-[#22c55e] font-medium' : 'text-gray-300 hover:text-white'
            }`}
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  )
}
