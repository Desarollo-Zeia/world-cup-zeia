'use client'

import Image from 'next/image'
import { Prediction, Match, Team, MatchWinner } from '@prisma/client'
import { getFlagUrl } from '@/app/lib/flags'

type MatchWithTeams = Match & {
  homeTeam: Team | null
  awayTeam: Team | null
}

type PredictionWithMatch = Prediction & {
  match: MatchWithTeams
}

const STAGE_LABELS: Record<string, string> = {
  ROUND_OF_32: '16avos de final',
  ROUND_OF_16: 'Octavos de final',
  QUARTER_FINAL: 'Cuartos de final',
  SEMI_FINAL: 'Semifinales',
  THIRD_PLACE: '3er puesto',
  FINAL: 'Final',
}

function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function winnerLabel(match: MatchWithTeams): string {
  if (!match.winner) return ''
  if (match.winner === 'DRAW') return 'Empate'
  const team = match.winner === 'HOME' ? match.homeTeam : match.awayTeam
  return team?.name || match.winner
}

function predictedWinnerLabel(
  match: MatchWithTeams,
  predictedWinner: MatchWinner
): string {
  if (predictedWinner === 'DRAW') return 'Empate'
  const team = predictedWinner === 'HOME' ? match.homeTeam : match.awayTeam
  return team?.name || predictedWinner
}

function StatusBadge({ points, hasResult }: { points: number; hasResult: boolean }) {
  if (!hasResult) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-400">
        Pendiente
      </span>
    )
  }

  if (points > 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#22c55e]/20 text-[#22c55e]">
        +{points} pt
      </span>
    )
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
      Falló
    </span>
  )
}

function TeamBox({
  team,
  placeholder,
  isPredicted,
  isActual,
}: {
  team?: Team | null
  placeholder?: string | null
  isPredicted?: boolean
  isActual?: boolean
}) {
  const name = team?.name || placeholder || 'TBD'
  const flag = getFlagUrl(team?.code)

  return (
    <div
      className={`flex-1 flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-3 ${
        isActual
          ? 'border-[#22c55e] bg-[#22c55e]/10'
          : isPredicted
          ? 'border-[#3b82f6] bg-[#3b82f6]/10'
          : 'border-[#2a2a2a] bg-[#161616]'
      }`}
    >
      {flag ? (
        <Image
          src={flag}
          alt={name}
          width={48}
          height={32}
          className="object-cover rounded-md w-12 h-8"
        />
      ) : (
        <div className="w-12 h-8 rounded-md bg-[#2a2a2a]" />
      )}
      <span
        className={`text-xs font-bold text-center leading-tight ${
          isActual ? 'text-[#22c55e]' : isPredicted ? 'text-[#3b82f6]' : 'text-white'
        }`}
      >
        {name}
      </span>
    </div>
  )
}

export default function PredictionGrid({
  predictions,
}: {
  predictions: PredictionWithMatch[]
}) {
  const sorted = [...predictions].sort(
    (a, b) => new Date(a.match.utcDate).getTime() - new Date(b.match.utcDate).getTime()
  )

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sorted.map((pred) => {
        const match = pred.match
        const hasResult = match.winner !== null
        const actualWinner = match.winner
        const predictedWinner = pred.predictedWinner

        return (
          <div
            key={pred.id}
            className="bg-[#161616] rounded-2xl border border-[#2a2a2a] p-4"
          >
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>{STAGE_LABELS[match.stage] || match.stage}</span>
              <span>{formatDate(match.utcDate)}</span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <TeamBox
                team={match.homeTeam}
                placeholder={match.placeholderA}
                isPredicted={predictedWinner === 'HOME'}
                isActual={actualWinner === 'HOME'}
              />
              <span className="text-gray-500 font-bold">VS</span>
              <TeamBox
                team={match.awayTeam}
                placeholder={match.placeholderB}
                isPredicted={predictedWinner === 'AWAY'}
                isActual={actualWinner === 'AWAY'}
              />
            </div>

            <div className="mt-3 text-sm text-center text-gray-300">
              Predicción:{' '}
              <span className="font-medium text-white">
                {predictedWinnerLabel(match, predictedWinner)}
              </span>
            </div>

            {hasResult && (
              <div className="mt-2 text-xs text-center text-gray-400">
                Resultado: {winnerLabel(match)}
              </div>
            )}

            <div className="mt-3 flex justify-center">
              <StatusBadge points={pred.pointsEarned} hasResult={hasResult} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
