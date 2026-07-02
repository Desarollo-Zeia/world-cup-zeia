'use client'

import Image from 'next/image'
import Link from 'next/link'

type RankingItem = {
  id: string
  name: string
  imageUrl: string | null
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
              Jugador
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
                  className="flex items-center gap-3 text-white hover:text-[#22c55e] transition-colors font-medium"
                >
                  {u.imageUrl ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#3a3a3a] shrink-0">
                      <Image
                        src={u.imageUrl}
                        alt={u.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-gray-500 text-xs shrink-0">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span>{u.name}</span>
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
