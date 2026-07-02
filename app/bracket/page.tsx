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
    <div className="min-h-screen bg-[#121212]">
      <AppHeader />

      <main className="max-w-6xl mx-auto px-4 py-6 pb-28">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Bracket</h1>
          <p className="text-gray-400 text-sm">Así quedaron los cruces del Mundial.</p>
        </div>

        <BracketView matches={matches} />
      </main>
    </div>
  )
}
