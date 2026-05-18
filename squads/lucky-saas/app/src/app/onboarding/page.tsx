'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createBrokerAndReferral } from '@/app/actions/referral'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RAMOS } from '@/lib/constants/ramos'
import { cn } from '@/lib/utils/cn'

type Step = 1 | 2 | 3 | 4

const CART_SIZES = [
  { value: 'lt50', label: 'Menos de 50 clientes' },
  { value: '50-200', label: '50 a 200 clientes' },
  { value: '200-500', label: '200 a 500 clientes' },
  { value: 'gt500', label: 'Mais de 500 clientes' },
]

const TOUR_SLIDES = [
  {
    title: 'Dashboard',
    description: 'Veja todos os alertas do dia em um só lugar — renovações, aniversários, leads parados.',
  },
  {
    title: 'Alertas de Renovação',
    description: 'Nunca perca uma renovação. O sistema avisa você 90, 60 e 30 dias antes do vencimento.',
  },
  {
    title: 'Pipeline de Leads',
    description: 'Acompanhe cada negociação do primeiro contato até o fechamento no Kanban.',
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [tourSlide, setTourSlide] = useState(0)

  // Step 1
  const [name, setName] = useState('')
  const [susep, setSusep] = useState('')
  const [cartSize, setCartSize] = useState('')

  // Step 2
  const [selectedRamos, setSelectedRamos] = useState<string[]>([])

  const progress = (step / 4) * 100

  function toggleRamo(ramo: string) {
    setSelectedRamos((prev) =>
      prev.includes(ramo) ? prev.filter((r) => r !== ramo) : [...prev, ramo]
    )
  }

  async function handleComplete() {
    setLoading(true)
    setSaveError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    // Read referral cookie set by /ref/[code]
    const referralCode = document.cookie
      .split('; ')
      .find(r => r.startsWith('premia_referral='))
      ?.split('=')[1] ?? null

    const { error } = await createBrokerAndReferral({
      name,
      susep: susep || null,
      email: user.email!,
      userId: user.id,
      ramos: selectedRamos,
      cartSize,
      referralCode,
    })

    if (error) {
      setSaveError('Erro ao salvar perfil. Tente novamente.')
      setLoading(false)
      return
    }

    // Clear referral cookie after use
    if (referralCode) {
      document.cookie = 'premia_referral=; path=/; max-age=0'
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-[#E5E5E5]">
        <div
          className="h-full bg-[#0BD904] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[480px]">

          {step === 1 && (
            <div>
              <h1 className="font-display text-[28px] font-bold text-[#0D0D0D] mb-2">
                Vamos começar
              </h1>
              <p className="text-[14px] text-[#6B7280] mb-8">
                Configure sua corretora para personalizar o sistema.
              </p>
              <div className="space-y-4">
                <Input
                  label="Nome da corretora"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Minha Corretora de Seguros"
                  required
                />
                <Input
                  label="Número SUSEP (opcional)"
                  value={susep}
                  onChange={(e) => setSusep(e.target.value)}
                  placeholder="100.000.000-0"
                />
                <div>
                  <label className="block text-[13px] font-medium text-[#0D0D0D] mb-2">
                    Quantos clientes você tem hoje?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {CART_SIZES.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setCartSize(s.value)}
                        className={cn(
                          'px-4 py-3 rounded-[6px] text-[13px] font-medium text-left border transition-colors',
                          cartSize === s.value
                            ? 'border-[#0BD904] bg-[rgba(11,217,4,0.06)] text-[#034001]'
                            : 'border-[#D1D1D1] text-[#6B7280] hover:border-[#9CA3AF]'
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                className="w-full mt-8"
                disabled={!name}
                onClick={() => setStep(2)}
              >
                Continuar
              </Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="font-display text-[28px] font-bold text-[#0D0D0D] mb-2">
                Quais ramos você trabalha?
              </h1>
              <p className="text-[14px] text-[#6B7280] mb-8">
                Selecione todos que se aplicam.
              </p>
              <div className="flex flex-wrap gap-2">
                {RAMOS.map((ramo) => (
                  <button
                    key={ramo.value}
                    type="button"
                    onClick={() => toggleRamo(ramo.value)}
                    className={cn(
                      'px-4 py-2 rounded-full text-[13px] font-medium border transition-colors',
                      selectedRamos.includes(ramo.value)
                        ? 'bg-[rgba(11,217,4,0.10)] border-[rgba(11,217,4,0.40)] text-[#034001]'
                        : 'border-[#D1D1D1] text-[#6B7280] hover:border-[#9CA3AF]'
                    )}
                  >
                    {ramo.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-8">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  Voltar
                </Button>
                <Button
                  className="flex-1"
                  disabled={selectedRamos.length === 0}
                  onClick={() => setStep(3)}
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="font-display text-[28px] font-bold text-[#0D0D0D] mb-2">
                Importar sua base
              </h1>
              <p className="text-[14px] text-[#6B7280] mb-8">
                Se você tem uma planilha de clientes ou apólices, pode importar agora.
              </p>
              <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-6 text-center">
                <p className="text-[14px] text-[#6B7280] mb-2">Importação via CSV</p>
                <p className="text-[12px] text-[#9CA3AF]">
                  Disponível em breve. Você pode importar a qualquer momento em Configurações.
                </p>
              </div>
              <div className="flex gap-3 mt-8">
                <Button variant="secondary" onClick={() => setStep(2)}>
                  Voltar
                </Button>
                <Button className="flex-1" onClick={() => setStep(4)}>
                  Pular por agora
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-8 text-center">
                <h2 className="font-display text-[22px] font-bold text-[#0D0D0D] mb-2">
                  {TOUR_SLIDES[tourSlide].title}
                </h2>
                <p className="text-[14px] text-[#6B7280] max-w-[320px] mx-auto">
                  {TOUR_SLIDES[tourSlide].description}
                </p>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-6">
                  {TOUR_SLIDES.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setTourSlide(i)}
                      className={cn(
                        'h-2 rounded-full transition-all',
                        i === tourSlide ? 'w-6 bg-[#0BD904]' : 'w-2 bg-[#E5E5E5]'
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {tourSlide < TOUR_SLIDES.length - 1 ? (
                  <Button className="w-full" onClick={() => setTourSlide(tourSlide + 1)}>
                    Próximo
                  </Button>
                ) : (
                  <>
                    {saveError && <p className="text-[12px] text-red-500 text-center">{saveError}</p>}
                    <Button className="w-full" loading={loading} onClick={handleComplete}>
                      Começar a usar
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
