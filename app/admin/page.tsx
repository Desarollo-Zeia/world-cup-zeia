import { syncMatches } from '@/app/lib/sync'
import { prisma } from '@/app/lib/prisma'
import { getAdminSession } from '@/app/lib/admin-auth'
import AppHeader from '@/app/components/AppHeader'
import AdminLogin from '@/app/components/AdminLogin'
import AdminPanel from '@/app/components/AdminPanel'

export const dynamic = 'force-dynamic'

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
    <div className="min-h-screen bg-slate-50">
      <AppHeader isAdmin={isAdmin} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 pb-28">
        <div className="mb-8 sm:mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Administración
          </h1>
          <p className="text-slate-500 mt-2">
            Registra y edita las predicciones de tus compañeros
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
