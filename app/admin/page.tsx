import { syncMatches } from '@/app/lib/sync'
import { prisma } from '@/app/lib/prisma'
import { getAdminSession } from '@/app/lib/admin-auth'
import AppHeader from '@/app/components/AppHeader'
import AdminLogin from '@/app/components/AdminLogin'
import AdminPanel from '@/app/components/AdminPanel'

export default async function AdminPage() {
  const isAdmin = await getAdminSession()

  try {
    await syncMatches()
  } catch (error) {
    console.error('Failed to sync on admin page:', error)
  }

  const users = await prisma.user.findMany({
    include: {
      predictions: {
        include: {
          match: {
            include: {
              homeTeam: true,
              awayTeam: true,
            },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  })

  const matches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
    orderBy: [{ utcDate: 'asc' }],
  })

  return (
    <div className="min-h-screen bg-[#121212]">
      <AppHeader isAdmin={isAdmin} />

      <main className="max-w-5xl mx-auto px-4 py-6 pb-28">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Administración</h1>
          <p className="text-gray-400 text-sm">
            Registra y edita las predicciones de tus compañeros.
          </p>
        </div>

        {isAdmin ? (
          <AdminPanel users={users} matches={matches} />
        ) : (
          <AdminLogin />
        )}
      </main>
    </div>
  )
}
