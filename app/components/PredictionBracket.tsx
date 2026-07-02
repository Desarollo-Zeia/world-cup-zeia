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
          <div className="text-xs text-center">
            <div className="text-gray-400">
              Predicción:{' '}
              <span className="text-white font-medium">
                {predictedWinnerLabel(match, pred.predictedWinner)}
              </span>
            </div>
            {hasResult && (
              <div
                className={`mt-1 font-medium ${
                  isHit ? 'text-[#22c55e]' : isMiss ? 'text-red-400' : 'text-gray-400'
                }`}
              >
                {isHit ? `+${pred.pointsEarned} pt` : 'Falló'}
              </div>
            )}
          </div>
        )
      }}
    />
  )
}
