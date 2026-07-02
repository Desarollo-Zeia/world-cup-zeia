import Image from 'next/image'
import { getFlagUrl } from '@/app/lib/flags'
import { Match, Team } from '@prisma/client'

export type MatchWithTeams = Match & {
  homeTeam: Team | null
  awayTeam: Team | null
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
    day: 'numeric',
    month: 'numeric',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function TeamRow({
  team,
  placeholder,
  score,
  isWinner,
}: {
  team?: Team | null
  placeholder?: string | null
  score?: number | null
  isWinner?: boolean
}) {
  const name = team?.name || placeholder || 'TBD'
  const flag = getFlagUrl(team?.code)

  return (
    <div className={`flex items-center justify-between gap-2 py-2.5 px-3 rounded-lg ${isWinner ? 'bg-accent-light/50' : ''}`}>
      <div className="flex items-center gap-2.5 min-w-0">
        {flag ? (
          <Image
            src={flag}
            alt={name}
            width={24}
            height={16}
            className="rounded-sm object-cover shrink-0 shadow-sm"
          />
        ) : (
          <div className="w-6 h-4 rounded-sm bg-slate-100 shrink-0" />
        )}
        <span className={`text-sm font-medium truncate ${isWinner ? 'text-accent-dark font-semibold' : 'text-slate-700'}`}>
          {name}
        </span>
      </div>
      {score !== undefined && score !== null && (
        <span className={`text-sm font-bold tabular-nums shrink-0 ${isWinner ? 'text-accent-dark' : 'text-slate-500'}`}>
          {score}
        </span>
      )}
    </div>
  )
}

function MatchCard({ match, extra }: { match: MatchWithTeams; extra?: React.ReactNode }) {
  const homeWinner = match.winner === 'HOME'
  const awayWinner = match.winner === 'AWAY'

  return (
    <div className="surface p-3 hover:border-slate-300 transition-colors">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
        <span>{formatDate(match.utcDate)}</span>
        {match.matchNumber && <span>#{match.matchNumber}</span>}
      </div>
      <TeamRow
        team={match.homeTeam}
        placeholder={match.placeholderA}
        score={match.homeScore}
        isWinner={homeWinner}
      />
      <TeamRow
        team={match.awayTeam}
        placeholder={match.placeholderB}
        score={match.awayScore}
        isWinner={awayWinner}
      />
      {extra && <div className="mt-2 pt-2 border-t border-slate-100">{extra}</div>}
    </div>
  )
}

function RoundSection({
  title,
  matches,
  columns = 4,
  renderExtra,
}: {
  title: string
  matches: MatchWithTeams[]
  columns?: number
  renderExtra?: (match: MatchWithTeams) => React.ReactNode
}) {
  const gridCols =
    columns === 1
      ? 'grid-cols-1'
      : columns === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : columns === 3
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1.5 h-5 rounded-full bg-accent" />
        <h2 className="font-display text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
        <span className="text-xs font-semibold text-slate-400">{matches.length} partidos</span>
      </div>
      <div className={`grid ${gridCols} gap-4`}>
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} extra={renderExtra?.(match)} />
        ))}
      </div>
    </div>
  )
}

export default function BracketView({
  matches,
  renderExtra,
}: {
  matches: MatchWithTeams[]
  renderExtra?: (match: MatchWithTeams) => React.ReactNode
}) {
  const byStage: Record<string, MatchWithTeams[]> = {
    ROUND_OF_32: [],
    ROUND_OF_16: [],
    QUARTER_FINAL: [],
    SEMI_FINAL: [],
    THIRD_PLACE: [],
    FINAL: [],
  }

  for (const match of matches) {
    if (byStage[match.stage]) byStage[match.stage].push(match)
  }

  return (
    <>
      <RoundSection
        title={STAGE_LABELS.ROUND_OF_32}
        matches={byStage.ROUND_OF_32}
        columns={4}
        renderExtra={renderExtra}
      />
      <RoundSection
        title={STAGE_LABELS.ROUND_OF_16}
        matches={byStage.ROUND_OF_16}
        columns={4}
        renderExtra={renderExtra}
      />
      <RoundSection
        title={STAGE_LABELS.QUARTER_FINAL}
        matches={byStage.QUARTER_FINAL}
        columns={4}
        renderExtra={renderExtra}
      />
      <RoundSection
        title={STAGE_LABELS.SEMI_FINAL}
        matches={byStage.SEMI_FINAL}
        columns={2}
        renderExtra={renderExtra}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <RoundSection title={STAGE_LABELS.FINAL} matches={byStage.FINAL} columns={1} renderExtra={renderExtra} />
        <RoundSection title={STAGE_LABELS.THIRD_PLACE} matches={byStage.THIRD_PLACE} columns={1} renderExtra={renderExtra} />
      </div>
    </>
  )
}
