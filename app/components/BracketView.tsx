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
  highlight,
}: {
  team?: Team | null
  placeholder?: string | null
  score?: number | null
  highlight?: boolean
}) {
  const name = team?.name || placeholder || 'TBD'
  const flag = getFlagUrl(team?.code)

  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <div className="flex items-center gap-2 min-w-0">
        {flag ? (
          <Image
            src={flag}
            alt={name}
            width={20}
            height={14}
            className="rounded-sm object-cover shrink-0"
          />
        ) : (
          <div className="w-5 h-3.5 rounded-sm bg-[#2a2a2a] shrink-0" />
        )}
        <span
          className={`text-sm font-medium truncate ${
            highlight ? 'text-[#22c55e]' : 'text-white'
          }`}
        >
          {name}
        </span>
      </div>
      {score !== undefined && score !== null && (
        <span className="text-sm font-bold tabular-nums shrink-0 text-white">
          {score}
        </span>
      )}
    </div>
  )
}

function MatchCard({
  match,
  extra,
}: {
  match: MatchWithTeams
  extra?: React.ReactNode
}) {
  const hasResult = match.winner !== null

  return (
    <div
      className={`bg-[#1e1e1e] rounded-xl border border-[#2a2a2a] p-3 ${
        hasResult ? 'border-l-4 border-l-[#22c55e]' : ''
      }`}
    >
      <div className="text-[10px] text-gray-500 mb-1">{formatDate(match.utcDate)}</div>
      <TeamRow
        team={match.homeTeam}
        placeholder={match.placeholderA}
        score={match.homeScore}
      />
      <TeamRow
        team={match.awayTeam}
        placeholder={match.placeholderB}
        score={match.awayScore}
      />
      {extra && <div className="mt-2 pt-2 border-t border-[#2a2a2a]">{extra}</div>}
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
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
        {title}
      </h2>
      <div className={`grid ${gridCols} gap-3`}>
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            extra={renderExtra?.(match)}
          />
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
        <RoundSection
          title={STAGE_LABELS.FINAL}
          matches={byStage.FINAL}
          columns={1}
          renderExtra={renderExtra}
        />
        <RoundSection
          title={STAGE_LABELS.THIRD_PLACE}
          matches={byStage.THIRD_PLACE}
          columns={1}
          renderExtra={renderExtra}
        />
      </div>
    </>
  )
}
