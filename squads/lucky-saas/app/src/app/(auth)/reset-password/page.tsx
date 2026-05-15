'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ResetPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/nova-senha`,
    })

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="w-full max-w-[400px]">
      <div className="bg-white rounded-[12px] border border-[#E5E5E5] p-10">
        <h1 className="text-[22px] font-semibold text-[#0D0D0D] mb-2">
          Redefinir senha
        </h1>

        {sent ? (
          <div>
            <p className="text-[14px] text-[#6B7280] mb-6">
              Enviamos um link para <strong>{email}</strong>. Verifique sua caixa de entrada.
            </p>
            <Link href="/login">
              <Button variant="secondary" className="w-full">Voltar para o login</Button>
            </Link>
          </div>
        ) : (
          <>
            <p className="text-[14px] text-[#6B7280] mb-6">
              Digite seu email e enviaremos um link para redefinir sua senha.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
              <Button type="submit" loading={loading} className="w-full">
                Enviar link
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Link href="/login" className="text-[13px] text-[#6B7280] hover:text-[#0D0D0D]">
                Voltar para o login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
