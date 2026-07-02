'use client'

import { useState } from 'react'
import { loginAdmin } from '@/app/lib/actions'

export default function AdminLogin() {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setError('')

    const result = await loginAdmin(formData)

    setPending(false)

    if ('error' in result) {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-[#1e1e1e] rounded-2xl border border-[#2a2a2a] p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">Acceso de administrador</h1>
        <p className="text-gray-400 text-sm mb-6">
          Ingresa la contraseña para registrar y editar predicciones.
        </p>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full h-12 bg-[#121212] text-white px-4 rounded-xl border border-[#3a3a3a] focus:border-[#22c55e] focus:outline-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-[#22c55e] text-[#121212] font-bold py-3 rounded-xl hover:bg-[#16a34a] active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {pending ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
