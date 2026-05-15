'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou senha incorretos. Tente novamente.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="w-full max-w-[400px]">
      <div className="bg-white rounded-[12px] border border-[#E5E5E5] p-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
            <path d="M10 2C8 2 6.5 3.5 6.5 5.5C6.5 7.5 8 9 10 9C12 9 13.5 7.5 13.5 5.5C13.5 3.5 12 2 10 2Z" fill="#0BD904" />
            <path d="M4 7C2 7 0.5 8.5 0.5 10.5C0.5 12.5 2 14 4 14C6 14 7.5 12.5 7.5 10.5C7.5 8.5 6 7 4 7Z" fill="#0BD904" opacity="0.7" />
            <path d="M16 7C14 7 12.5 8.5 12.5 10.5C12.5 12.5 14 14 16 14C18 14 19.5 12.5 19.5 10.5C19.5 8.5 18 7 16 7Z" fill="#0BD904" opacity="0.7" />
            <path d="M10 12C8 12 6.5 13.5 6.5 15.5C6.5 17.5 8 19 10 19C12 19 13.5 17.5 13.5 15.5C13.5 13.5 12 12 10 12Z" fill="#0BD904" opacity="0.5" />
          </svg>
          <span className="font-display text-[18px] font-bold text-[#0D0D0D]">Premia</span>
        </div>

        <h1 className="text-[22px] font-semibold text-[#0D0D0D] mb-6">
          Entrar na sua conta
        </h1>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            autoComplete="email"
          />
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            error={error ?? undefined}
          />

          <Button type="submit" loading={loading} className="w-full">
            Entrar
          </Button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E5E5]" />
          </div>
          <div className="relative flex justify-center text-[12px]">
            <span className="px-3 bg-white text-[#9CA3AF]">ou</span>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={handleGoogleLogin}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continuar com Google
        </Button>

        <div className="mt-5 flex items-center justify-between text-[13px]">
          <Link href="/reset-password" className="text-[#6B7280] hover:text-[#0D0D0D]">
            Esqueci minha senha
          </Link>
          <Link href="/signup" className="text-[#0BD904] font-medium hover:underline">
            Começar trial grátis
          </Link>
        </div>
      </div>
    </div>
  )
}
