'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, User } from 'lucide-react'

interface Props {
  params: { token: string }
}

export default function IntakePage({ params }: Props) {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    birth_date: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  function handle(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.full_name.trim()) { setError('Informe seu nome completo.'); return }
    setError(null)
    setSubmitting(true)

    const res = await fetch('/api/intake/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: params.token, ...form }),
    })

    const data = await res.json()
    setSubmitting(false)

    if (!res.ok) {
      setError(data.error ?? 'Erro ao enviar. Tente novamente.')
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-neutral-off-white flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm text-center"
        >
          <div className="w-16 h-16 rounded-full bg-semantic-success-bg flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={28} className="text-semantic-success" />
          </div>
          <h1 className="font-serif text-2xl text-neutral-charcoal mb-3">Dados recebidos</h1>
          <p className="text-neutral-secondary text-sm leading-relaxed">
            Seus dados foram enviados com sucesso para seu psicólogo.
            Você pode fechar esta página.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-off-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="font-serif text-2xl text-brand-teal">Vínculo</span>
          <div className="mt-6 w-14 h-14 rounded-full bg-brand-teal/10 flex items-center justify-center mx-auto mb-4">
            <User size={24} className="text-brand-teal" strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-xl text-neutral-charcoal mb-1">Ficha de cadastro</h1>
          <p className="text-sm text-neutral-secondary">
            Preencha seus dados para que seu psicólogo possa te cadastrar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-3 bg-semantic-danger-bg border border-semantic-danger/20 text-semantic-danger text-sm px-4 py-3 rounded-input"
              >
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <InputField label="Nome completo *" name="full_name" value={form.full_name} onChange={handle} placeholder="Maria Silva" />
          <InputField label="E-mail" name="email" type="email" value={form.email} onChange={handle} placeholder="maria@email.com" optional />
          <InputField label="Telefone / WhatsApp" name="phone" type="tel" value={form.phone} onChange={handle} placeholder="(11) 99999-9999" optional />
          <InputField label="Data de nascimento" name="birth_date" type="date" value={form.birth_date} onChange={handle} optional />

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-neutral-charcoal mb-1.5">
              Observações <span className="text-xs font-normal text-neutral-secondary ml-1">Opcional</span>
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handle}
              rows={3}
              placeholder="Algo que queira compartilhar com seu psicólogo antes da primeira sessão..."
              className="w-full px-3.5 py-2.5 rounded-input border border-neutral-border bg-white text-neutral-charcoal placeholder:text-neutral-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1 transition-all text-sm resize-none"
            />
          </div>

          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-input transition-colors"
          >
            {submitting ? 'Enviando...' : 'Enviar ficha'}
          </motion.button>
        </form>

        <p className="text-center text-xs text-neutral-secondary mt-6 leading-relaxed">
          Seus dados são criptografados e tratados conforme a LGPD.<br />
          Apenas seu psicólogo tem acesso.
        </p>
      </div>
    </div>
  )
}

function InputField({
  label, name, type = 'text', value, onChange, placeholder, optional,
}: {
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  optional?: boolean
}) {
  return (
    <div>
      <label className="flex items-center justify-between text-sm font-medium text-neutral-charcoal mb-1.5">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-neutral-secondary">Opcional</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-input border border-neutral-border bg-white text-neutral-charcoal placeholder:text-neutral-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1 transition-all text-sm"
      />
    </div>
  )
}
