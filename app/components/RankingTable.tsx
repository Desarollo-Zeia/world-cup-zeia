'use client'

import Link from 'next/link'

type RankingItem = {
  id: string
  name: string
  points: number
  winners: number
}

export default function RankingTable({ ranking }: { ranking: RankingItem[] }) {
  return (
    <div className="bg-[#1e1e1e] rounded-2xl border border-[#2a2a2a] overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-[#2a2a2a]">
          <tr>
            <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">
              #
            </th>
            <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">
              Nombre
            </th>
            <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide text-right">
              Puntos
            </th>
            <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide text-right hidden sm:table-cell">
              Aciertos
            </th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((u, index) => (
            <tr key={u.id} className="border-t border-[#2a2a2a]">
              <td className="px-4 py-3 text-white font-bold">{index + 1}</td>
              <td className="px-4 py-3">
                <Link
                  href={`/player/${u.id}`}
                  className="text-white hover:text-[#22c55e] transition-colors font-medium"
                >
                  {u.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-[#22c55e] font-bold text-lg">{u.points}</span>
              </td>
              <td className="px-4 py-3 text-right text-gray-300 hidden sm:table-cell">
                {u.winners}
              </td>
            </tr>
          ))}
          {ranking.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                Aún no hay predicciones
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
