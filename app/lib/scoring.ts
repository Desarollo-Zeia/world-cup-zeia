import { MatchWinner } from '@prisma/client'

export function calculatePoints(
  predictedWinner: MatchWinner,
  actualWinner: MatchWinner | null
): number {
  if (!actualWinner) return 0
  if (predictedWinner !== actualWinner) return 0
  return 1
}
