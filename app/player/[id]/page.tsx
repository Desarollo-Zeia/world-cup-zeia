import { notFound } from 'next/navigation'
import { syncMatches } from '@/app/lib/sync'
import { prisma } from '@/app/lib/prisma'
import AppHeader from '@/app/components/AppHeader'
import PredictionGrid from '@/app/components/PredictionGrid'
import PredictionBracket from '@/app/components/PredictionBracket'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function PlayerPage({ params }: PageProps) {
  const { id } = await params

  try {
    await syncMatches()
  } catch (error) {
    console.error('Failed to sync on player page:', error)
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      predictions: {
        include: {
          match: {
            include: {
              homeTeam: true,
              awayTeam: true,
            },
          },
        },
      },
    },
  })

  if (!user) {
    notFound()
  }

  const totalPoints = user.predictions.reduce((sum, p) => sum + p.pointsEarned, 0)
  const winners = user.predictions.filter((p) => p.pointsEarned >= 1).length

  return (
    <div className="min-h-screen bg-[#121212]">
      <AppHeader />

      <main className="max-w-6xl mx-auto px-4 py-6 pb-28">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">{user.name}</h1>
          <p className="text-gray-400 text-sm">
            {totalPoints} puntos · {winners} aciertos
          </p>
        </div>

        <div className="mb-6 bg-[#1e1e1e] rounded-2xl border border-[#2a2a2a] p-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
            Historial de predicciones
          </h2>
          <PredictionGrid predictions={user.predictions} />
        </div>

        <div className="bg-[#1e1e1e] rounded-2xl border border-[#2a2a2a] p-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
            Bracket de predicciones
          </h2>
          <PredictionBracket predictions={user.predictions} />
        </div>
      </main>
    </div>
  )
}
