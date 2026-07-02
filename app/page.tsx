import { syncMatches } from '@/app/lib/sync'
import { prisma } from '@/app/lib/prisma'
import AppHeader from '@/app/components/AppHeader'
import RankingTable from '@/app/components/RankingTable'

export const dynamic = 'force-dynamic'

function buildForm(predictions: { pointsEarned: number; match: { winner: string | null; utcDate: Date } }[]) {
  const sorted = [...predictions].sort(
    (a, b) => new Date(a.match.utcDate).getTime() - new Date(b.match.utcDate).getTime()
  )

  return sorted.slice(-5).map((p) => {
    if (p.match.winner === null) return 'pending'
    return p.pointsEarned > 0 ? 'hit' : 'miss'
  })
}

export default async function HomePage() {
  try {
    await syncMatches()
  } catch (error) {
    console.error('Failed to sync on home page:', error)
  }

  const users = await prisma.user.findMany({
    include: {
      predictions: {
        include: {
          match: true,
        },
      },
    },
  })

  const ranking = users
    .map((u) => ({
      id: u.id,
      name: u.name,
      imageUrl: u.imageUrl,
      points: u.predictions.reduce((sum, p) => sum + p.pointsEarned, 0),
      winners: u.predictions.filter((p) => p.pointsEarned >= 1).length,
      form: buildForm(u.predictions),
    }))
    .sort((a, b) => b.points - a.points || b.winners - a.winners)

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-28">
        <div className="mb-8 sm:mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Así van las predicciones
          </h1>
          <p className="text-slate-500 mt-2">
            Tabla de posiciones de tus compañeros · Mundial 2026
          </p>
        </div>

        <RankingTable ranking={ranking} />
      </main>
    </div>
  )
}
