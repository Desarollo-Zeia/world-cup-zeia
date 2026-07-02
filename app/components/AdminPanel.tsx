'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Match, Team, User, Prediction, MatchWinner } from '@prisma/client'
import { getFlagUrl } from '@/app/lib/flags'
import {
  savePredictions,
  createPlayer,
  deletePrediction,
  logoutAdminAction,
} from '@/app/lib/actions'

type MatchWithTeams = Match & {
  homeTeam: Team | null
  awayTeam: Team | null
}

type PredictionWithMatch = Prediction & {
  match: MatchWithTeams
}

type UserWithPredictions = User & {
  predictions: PredictionWithMatch[]
}

const STAGE_LABELS: Record<string, string> = {
  ROUND_OF_32: '16avos de final',
  ROUND_OF_16: 'Octavos de final',
  QUARTER_FINAL: 'Cuartos de final',
  SEMI_FINAL: 'Semifinales',
  THIRD_PLACE: '3er puesto',
  FINAL: 'Final',
}

function stageOrder(stage: string): number {
  const order = [
    'ROUND_OF_32',
    'ROUND_OF_16',
    'QUARTER_FINAL',
    'SEMI_FINAL',
    'THIRD_PLACE',
    'FINAL',
  ]
  return order.indexOf(stage)
}

function isLocked(match: MatchWithTeams): boolean {
  return new Date(match.utcDate) <= new Date()
}

function TeamBox({
  team,
  placeholder,
  selected,
  onClick,
  disabled,
}: {
  team?: Team | null
  placeholder?: string | null
  selected: boolean
  onClick: () => void
  disabled: boolean
}) {
  const name = team?.name || placeholder || 'TBD'
  const flag = getFlagUrl(team?.code)

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 flex flex-col items-center justify-center gap-2 rounded-xl border-2 transition-all p-3 ${
        selected
          ? 'border-[#22c55e] bg-[#22c55e]/10'
          : 'border-[#2a2a2a] bg-[#161616] hover:border-[#3a3a3a]'
      } disabled:opacity-60 disabled:cursor-not-allowed`}
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
      <span className="text-xs font-bold text-center leading-tight text-white">
        {name}
      </span>
    </button>
  )
}

export default function AdminPanel({
  users,
  matches,
}: {
  users: UserWithPredictions[]
  matches: MatchWithTeams[]
}) {
  const [selectedUserId, setSelectedUserId] = useState('')
  const [newPlayerName, setNewPlayerName] = useState('')
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  function buildStateForUser(userId: string) {
    const selectedUser = users.find((u) => u.id === userId)
    const predictionMap = new Map<string, PredictionWithMatch>()
    if (selectedUser?.predictions) {
      for (const pred of selectedUser.predictions) {
        predictionMap.set(pred.matchId, pred)
      }
    }

    const state: Record<string, MatchWinner | ''> = {}
    for (const match of matches) {
      const pred = predictionMap.get(match.id)
      state[match.id] = pred?.predictedWinner || ''
    }
    return state
  }

  function getPredictionForMatch(matchId: string): PredictionWithMatch | undefined {
    const selectedUser = users.find((u) => u.id === selectedUserId)
    return selectedUser?.predictions.find((p) => p.matchId === matchId)
  }

  const [state, setState] = useState(() => buildStateForUser(selectedUserId))

  function selectUser(userId: string) {
    setSelectedUserId(userId)
    setState(buildStateForUser(userId))
  }

  function updateWinner(matchId: string, winner: MatchWinner | '') {
    setState((prev) => ({ ...prev, [matchId]: winner }))
  }

  async function handleCreatePlayer(formData: FormData) {
    setCreating(true)
    setMessage('')
    const result = await createPlayer(formData)
    setCreating(false)

    if ('error' in result) {
      setMessage(result.error)
    } else {
      setNewPlayerName('')
      setMessage('Jugador creado')
      selectUser(result.user.id)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  async function handleSave() {
    if (!selectedUserId) {
      setMessage('Selecciona un jugador')
      return
    }

    setSaving(true)
    setMessage('')

    const predictions = Object.entries(state)
      .filter(([, winner]) => winner !== '')
      .map(([matchId, winner]) => ({
        matchId,
        predictedWinner: winner as MatchWinner,
      }))

    const result = await savePredictions(selectedUserId, predictions)

    setSaving(false)
    if ('error' in result) {
      setMessage(result.error)
    } else {
      setMessage('Predicciones guardadas')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  async function handleDeletePrediction(matchId: string) {
    const pred = getPredictionForMatch(matchId)
    if (!pred) return

    const result = await deletePrediction(pred.id)
    if ('error' in result) {
      setMessage(result.error)
    } else {
      setState((prev) => ({ ...prev, [matchId]: '' }))
      setMessage('Predicción eliminada')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  async function handleLogout() {
    await logoutAdminAction()
  }

  const grouped = useMemo(() => {
    const map: Record<string, MatchWithTeams[]> = {}
    for (const match of matches) {
      if (!map[match.stage]) map[match.stage] = []
      map[match.stage].push(match)
    }
    return Object.entries(map).sort(
      (a, b) => stageOrder(a[0]) - stageOrder(b[0])
    )
  }, [matches])

  return (
    <div className="space-y-6">
      <form action={handleLogout} className="flex justify-end">
        <button
          type="submit"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Cerrar sesión de admin
        </button>
      </form>

      {/* Player management */}
      <div className="bg-[#1e1e1e] rounded-2xl border border-[#2a2a2a] p-6">
        <h2 className="text-lg font-bold text-white mb-4">Jugadores</h2>

        <form action={handleCreatePlayer} className="flex gap-3 mb-4">
          <input
            name="name"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Nombre del compañero"
            className="flex-1 h-12 bg-[#121212] text-white px-4 rounded-xl border border-[#3a3a3a] focus:border-[#22c55e] focus:outline-none"
          />
          <button
            type="submit"
            disabled={creating}
            className="bg-[#22c55e] text-[#121212] font-bold px-6 rounded-xl hover:bg-[#16a34a] transition-colors disabled:opacity-60"
          >
            {creating ? '...' : 'Crear'}
          </button>
        </form>

        <select
          value={selectedUserId}
          onChange={(e) => selectUser(e.target.value)}
          className="w-full h-12 bg-[#121212] text-white px-4 rounded-xl border border-[#3a3a3a] focus:border-[#22c55e] focus:outline-none"
        >
          <option value="">Selecciona un jugador</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      {message && (
        <div
          className={`p-3 rounded-xl text-sm ${
            message.includes('Error') || message.includes('incorrecta') || message.includes('existe')
              ? 'bg-red-500/10 border border-red-500/30 text-red-400'
              : 'bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e]'
          }`}
        >
          {message}
        </div>
      )}

      {selectedUserId && (
        <>
          {grouped.map(([stage, stageMatches]) => (
            <div key={stage} className="bg-[#1e1e1e] rounded-2xl border border-[#2a2a2a] p-6">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
                {STAGE_LABELS[stage] || stage}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {stageMatches.map((match) => {
                  const locked = isLocked(match)
                  const winner = state[match.id]
                  const hasExisting = getPredictionForMatch(match.id) !== undefined

                  return (
                    <div
                      key={match.id}
                      className={`bg-[#161616] rounded-2xl border border-[#2a2a2a] p-4 ${
                        locked ? 'opacity-70' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{new Date(match.utcDate).toLocaleString('es-ES')}</span>
                        {locked && <span className="text-orange-400">Cerrado</span>}
                      </div>

                      <div className="flex items-center justify-center gap-3">
                        <TeamBox
                          team={match.homeTeam}
                          placeholder={match.placeholderA}
                          selected={winner === 'HOME'}
                          onClick={() => updateWinner(match.id, 'HOME')}
                          disabled={locked}
                        />
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-gray-500 font-bold">VS</span>
                          <button
                            type="button"
                            onClick={() => updateWinner(match.id, 'DRAW')}
                            disabled={locked}
                            className={`text-[10px] font-bold uppercase rounded-full border transition-colors px-2 py-1 ${
                              winner === 'DRAW'
                                ? 'bg-[#22c55e] text-[#121212] border-[#22c55e]'
                                : 'border-[#3a3a3a] text-gray-400 hover:text-white'
                            } disabled:opacity-50`}
                          >
                            Empate
                          </button>
                        </div>
                        <TeamBox
                          team={match.awayTeam}
                          placeholder={match.placeholderB}
                          selected={winner === 'AWAY'}
                          onClick={() => updateWinner(match.id, 'AWAY')}
                          disabled={locked}
                        />
                      </div>

                      {hasExisting && !locked && (
                        <button
                          type="button"
                          onClick={() => handleDeletePrediction(match.id)}
                          className="mt-3 w-full text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                          Borrar predicción
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          <div className="fixed bottom-0 left-0 right-0 bg-[#1e1e1e]/95 backdrop-blur border-t border-[#2a2a2a] p-4 flex justify-center z-40">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#22c55e] text-[#121212] font-bold px-10 py-3 rounded-xl hover:bg-[#16a34a] active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {saving ? 'Guardando...' : 'Guardar predicciones'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
