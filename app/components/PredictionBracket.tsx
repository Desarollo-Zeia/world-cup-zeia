'use client'

import { Prediction, MatchWinner } from '@prisma/client'
import BracketView, { MatchWithTeams } from './BracketView'

type PredictionWithMatch = Prediction & {
  match: MatchWithTeams
}

function predictedWinnerLabel(
  match: MatchWithTeams,
  predictedWinner: MatchWinner
): string {
  if (predictedWinner === 'DRAW') return 'Empate'
  const team = predictedWinner === 'HOME' ? match.homeTeam : match.awayTeam
  return team?.name || predictedWinner
}

export default function PredictionBracket({
  predictions,
}: {
  predictions: PredictionWithMatch[]
}) {
  const predictionMap = new Map<string, PredictionWithMatch>()
  for (const pred of predictions) {
    predictionMap.set(pred.matchId, pred)
  }

  const allMatches = predictions.map((p) => p.match)

  return (
    <BracketView
      matches={allMatches}
      renderExtra={(match: MatchWithTeams) => {
        const pred = predictionMap.get(match.id)
        if (!pred) return null

        const hasResult = match.winner !== null
        const isHit = hasResult && pred.pointsEarned > 0
        const isMiss = hasResult && pred.pointsEarned === 0

        return (
          <div className="text-xs flex items-center justify-between">
            <span className="text-slate-500">
              Predicción:{' '}
              <span className="font-semibold text-slate-900">
                {predictedWinnerLabel(match, pred.predictedWinner)}
              </span>
            </span>
            {hasResult && (
              <span
                className={`badge ${isHit ? 'badge-hit' : isMiss ? 'badge-miss' : 'badge-pending'}`}
              >
                {isHit ? `+${pred.pointsEarned} pt` : 'Falló'}
              </span>
            )}
          </div>
        )
      }}
    />
  )
}
