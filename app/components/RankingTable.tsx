'use client'

import Image from 'next/image'
import Link from 'next/link'

type RankingItem = {
  id: string
  name: string
  imageUrl: string | null
  points: number
  winners: number
  form: ('hit' | 'miss' | 'pending')[]
}

function FormDots({ form }: { form: ('hit' | 'miss' | 'pending')[] }) {
  return (
    <div className="flex items-center gap-1.5">
      {form.map((status, i) => (
        <span
          key={i}
          className={`form-dot ${status === 'hit' ? 'hit' : status === 'miss' ? 'miss' : 'pending'}`}
          title={status === 'hit' ? 'Acierto' : status === 'miss' ? 'Fallo' : 'Pendiente'}
        />
      ))}
    </div>
  )
}

function RankBar({ rank }: { rank: number }) {
  if (rank === 1) return <span className="rank-bar gold" />
  if (rank === 2) return <span className="rank-bar silver" />
  if (rank === 3) return <span className="rank-bar bronze" />
  return <span className="rank-bar qualified" />
}

export default function RankingTable({ ranking }: { ranking: RankingItem[] }) {
  if (ranking.length === 0) {
    return (
      <div className="surface p-12 text-center">
        <p className="text-slate-600 text-lg">Aún no hay predicciones registradas</p>
        <p className="text-slate-500 text-sm mt-1">Ve al panel de admin para empezar</p>
      </div>
    )
  }

  return (
    <div className="surface overflow-hidden animate-fade-in-up">
      {/* Table header */}
      <div className="grid grid-cols-[2.5rem_1fr_5rem_5rem] sm:grid-cols-[3rem_1fr_6rem_6rem] gap-3 sm:gap-4 px-4 sm:px-6 py-3 border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
        <div>Pos</div>
        <div>Jugador</div>
        <div className="text-right">Aciertos</div>
        <div className="text-right">Pts</div>
      </div>

      {/* Table body */}
      {ranking.map((u, index) => {
        const rank = index + 1
        const isTop3 = rank <= 3

        return (
          <Link
            key={u.id}
            href={`/player/${u.id}`}
            className="standings-row relative group animate-fade-in-up"
            style={{ animationDelay: `${Math.min(index * 0.04, 0.3)}s` }}
          >
            <RankBar rank={rank} />

            <div className="pl-2 sm:pl-3 flex items-center justify-center">
              <span
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isTop3
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 group-hover:bg-white group-hover:ring-1 group-hover:ring-slate-200'
                }`}
              >
                {rank}
              </span>
            </div>

            <div className="flex items-center gap-3 min-w-0">
              {u.imageUrl ? (
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden ring-1 ring-slate-200 shrink-0">
                  <Image src={u.imageUrl} alt={u.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-display text-lg font-semibold shrink-0">
                  {u.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-display text-base sm:text-lg font-semibold text-slate-900 truncate group-hover:text-accent transition-colors">
                  {u.name}
                </h3>
                <div className="hidden sm:flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-500">Últimos resultados</span>
                  <FormDots form={u.form} />
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm sm:text-base font-semibold text-slate-700 tabular-nums">
                {u.winners}
              </span>
            </div>

            <div className="text-right">
              <span className="text-lg sm:text-xl font-bold text-slate-900 tabular-nums">
                {u.points}
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
