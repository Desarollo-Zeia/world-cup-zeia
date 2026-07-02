import { syncMatches } from '@/app/lib/sync'
import { prisma } from '@/app/lib/prisma'
import AppHeader from '@/app/components/AppHeader'
import RankingTable from '@/app/components/RankingTable'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  try {
    await syncMatches()
  } catch (error) {
    console.error('Failed to sync on home page:', error)
  }

  const users = await prisma.user.findMany({
    include: {
      predictions: true,
    },
  })

  const ranking = users
    .map((u) => ({
      id: u.id,
      name: u.name,
      points: u.predictions.reduce((sum, p) => sum + p.pointsEarned, 0),
      winners: u.predictions.filter((p) => p.pointsEarned >= 1).length,
    }))
    .sort((a, b) => b.points - a.points || b.winners - a.winners)

  return (
    <div className="min-h-screen bg-[#121212]">
      <AppHeader />

      <main className="max-w-3xl mx-auto px-4 py-6 pb-28">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Ranking</h1>
          <p className="text-gray-400 text-sm">
            Así van tus compañeros en la quiniela. Haz click en un nombre para ver su historial.
          </p>
        </div>

        <RankingTable ranking={ranking} />
      </main>
    </div>
  )
}
