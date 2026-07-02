import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
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
  const pending = user.predictions.filter((p) => p.match.winner === null).length
  const played = user.predictions.length - pending

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 pb-28">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al ranking
        </Link>

        {/* Player identity card */}
        <section className="surface p-6 sm:p-8 mb-8 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {user.imageUrl ? (
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-1 ring-slate-200 shadow-sm">
                <Image src={user.imageUrl} alt={user.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-display text-4xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex-1">
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                {user.name}
              </h1>
              <p className="text-slate-500 mt-1">
                Predicciones registradas: {user.predictions.length}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="surface px-4 py-3 text-center min-w-[5.5rem]">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">{totalPoints}</div>
                <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">Puntos</div>
              </div>
              <div className="surface px-4 py-3 text-center min-w-[5.5rem]">
                <div className="text-2xl sm:text-3xl font-bold text-accent tabular-nums">{winners}</div>
                <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">Aciertos</div>
              </div>
              <div className="surface px-4 py-3 text-center min-w-[5.5rem]">
                <div className="text-2xl sm:text-3xl font-bold text-slate-700 tabular-nums">{played}</div>
                <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">Jugados</div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-8">
          <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-6 rounded-full bg-accent" />
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                Historial de predicciones
              </h2>
            </div>
            <PredictionGrid predictions={user.predictions} />
          </section>

          <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-6 rounded-full bg-accent" />
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                Bracket de predicciones
              </h2>
            </div>
            <PredictionBracket predictions={user.predictions} />
          </section>
        </div>
      </main>
    </div>
  )
}
