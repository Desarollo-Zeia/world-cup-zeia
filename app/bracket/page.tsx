import { syncMatches } from '@/app/lib/sync'
import { prisma } from '@/app/lib/prisma'
import AppHeader from '@/app/components/AppHeader'
import BracketView from '@/app/components/BracketView'

export const dynamic = 'force-dynamic'

export default async function BracketPage() {
  try {
    await syncMatches()
  } catch (error) {
    console.error('Failed to sync on bracket page:', error)
  }

  const matches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
    orderBy: [{ matchNumber: 'asc' }],
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 pb-28">
        <div className="mb-8 sm:mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Bracket del Mundial
          </h1>
          <p className="text-slate-500 mt-2">
            Así quedaron los cruces del Mundial 2026
          </p>
        </div>

        <BracketView matches={matches} />
      </main>
    </div>
  )
}
