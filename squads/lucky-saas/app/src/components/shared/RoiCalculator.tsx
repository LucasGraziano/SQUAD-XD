'use client'

import { useState, useCallback } from 'react'
import { captureEvent } from '@/lib/posthog'

interface Props {
  context?: 'modal' | 'landing'
}

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function ModalCalculator() {
  const [renovacoes, setRenovacoes] = useState(30)
  const [comissao, setComissao] = useState(500)

  const multiplier = Math.round((renovacoes * comissao) / 97)
  const receita = formatBRL(renovacoes * comissao)

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[13px] font-semibold text-[#0D0D0D]">Renovações por mês</label>
          <span className="text-[13px] font-bold text-[#0BD904]">{renovacoes}</span>
        </div>
        <input
          type="range" min={5} max={200} step={5} value={renovacoes}
          onChange={e => setRenovacoes(Number(e.target.value))}
          className="w-full h-1.5 bg-[#E5E5E5] rounded-full appearance-none cursor-pointer accent-[#0BD904]"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[11px] text-[#9CA3AF]">5</span>
          <span className="text-[11px] text-[#9CA3AF]">200</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[13px] font-semibold text-[#0D0D0D]">Comissão média por renovação</label>
          <span className="text-[13px] font-bold text-[#0BD904]">
            {formatBRL(comissao)}
          </span>
        </div>
        <input
          type="range" min={100} max={5000} step={100} value={comissao}
          onChange={e => setComissao(Number(e.target.value))}
          className="w-full h-1.5 bg-[#E5E5E5] rounded-full appearance-none cursor-pointer accent-[#0BD904]"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[11px] text-[#9CA3AF]">R$100</span>
          <span className="text-[11px] text-[#9CA3AF]">R$5.000</span>
        </div>
      </div>

      <div className="p-4 rounded-[8px] bg-[rgba(11,217,4,0.06)] border border-[rgba(11,217,4,0.2)]">
        <p className="text-[12px] text-[#6B7280] mb-1">Receita potencial em renovações</p>
        <p className="text-[22px] font-black text-[#0D0D0D] leading-tight">
          {receita}<span className="text-[14px] font-semibold text-[#9CA3AF]">/mês</span>
        </p>
        <p className="text-[13px] text-[#6B7280] mt-2">
          O Profissional custa{' '}
          <span className="font-semibold text-[#0D0D0D]">R$97/mês</span>
          {' '}— isso é{' '}
          <span className="font-black text-[#0BD904] text-[18px]">{multiplier}x</span>
          {' '}de retorno.
        </p>
      </div>
    </div>
  )
}

function LandingCalculator() {
  const [carteira, setCarteira] = useState(100)
  const [comissao, setComissao] = useState(450)
  const [renovacoesPerdidas, setRenovacoesPerdidas] = useState(3)

  const perdaMensal = renovacoesPerdidas * comissao
  const multiplier = Math.round(perdaMensal / 97)

  const handleInteract = useCallback((field: string, value: number) => {
    captureEvent('roi_calculator_interacted', {
      field,
      value,
      carteira_input: carteira,
      commission_input: comissao,
      renewals_lost_input: renovacoesPerdidas,
      roi_result: Math.round((renovacoesPerdidas * comissao) / 97),
    })
  }, [carteira, comissao, renovacoesPerdidas])

  return (
    <div className="max-w-[560px] mx-auto">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[14px] font-semibold text-[#0D0D0D]">
              Minha carteira tem
            </label>
            <span className="text-[14px] font-bold text-[#0BD904]">{carteira} apólices</span>
          </div>
          <input
            type="range" min={50} max={500} step={10} value={carteira}
            onChange={e => {
              const v = Number(e.target.value)
              setCarteira(v)
              handleInteract('carteira', v)
            }}
            className="w-full h-2 bg-[#E5E5E5] rounded-full appearance-none cursor-pointer accent-[#0BD904]"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[12px] text-[#9CA3AF]">50</span>
            <span className="text-[12px] text-[#9CA3AF]">500</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[14px] font-semibold text-[#0D0D0D]">
              Perco por esquecimento
            </label>
            <span className="text-[14px] font-bold text-[#0BD904]">
              {renovacoesPerdidas} renovação{renovacoesPerdidas !== 1 ? 'ões' : ''}/mês
            </span>
          </div>
          <input
            type="range" min={1} max={10} step={1} value={renovacoesPerdidas}
            onChange={e => {
              const v = Number(e.target.value)
              setRenovacoesPerdidas(v)
              handleInteract('renovacoes_perdidas', v)
            }}
            className="w-full h-2 bg-[#E5E5E5] rounded-full appearance-none cursor-pointer accent-[#0BD904]"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[12px] text-[#9CA3AF]">1</span>
            <span className="text-[12px] text-[#9CA3AF]">10</span>
          </div>
        </div>

        <div>
          <label className="block text-[14px] font-semibold text-[#0D0D0D] mb-2">
            Comissão média por renovação
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-[#6B7280]">R$</span>
            <input
              type="number"
              min={100}
              max={10000}
              step={50}
              value={comissao}
              onChange={e => {
                const v = Math.max(100, Math.min(10000, Number(e.target.value)))
                setComissao(v)
                handleInteract('comissao', v)
              }}
              className="w-full h-12 pl-10 pr-3 rounded-[6px] border border-[#D1D1D1] text-[14px] text-[#0D0D0D] outline-none focus:border-[#0BD904] focus:shadow-[0_0_0_3px_rgba(11,217,4,0.12)] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="mt-6 p-5 rounded-[10px] bg-[rgba(11,217,4,0.06)] border border-[rgba(11,217,4,0.25)]">
        <p className="text-[13px] text-[#6B7280] mb-2">Com {renovacoesPerdidas} renovação{renovacoesPerdidas !== 1 ? 'ões perdidas' : ' perdida'}/mês:</p>
        <p className="text-[28px] font-black text-[#DC2626] leading-tight">
          {formatBRL(perdaMensal)}
          <span className="text-[16px] font-semibold text-[#9CA3AF]">/mês</span>
        </p>
        <p className="text-[14px] text-[#6B7280] mt-2 leading-snug">
          em comissões que você não recebeu.{' '}
          <span className="font-semibold text-[#0D0D0D]">
            O Premia recupera isso por R$97/mês.
          </span>
        </p>
        <div className="mt-3 pt-3 border-t border-[rgba(11,217,4,0.2)]">
          <p className="text-[13px] text-[#6B7280]">
            ROI do primeiro mês:{' '}
            <span className="text-[20px] font-black text-[#0BD904]">{multiplier}x</span>
          </p>
        </div>
      </div>

      <a
        href="/signup"
        className="mt-5 flex items-center justify-center w-full h-12 rounded-[6px] bg-[#0BD904] text-[#0D0D0D] text-[15px] font-bold hover:bg-[#09C003] transition-colors"
      >
        Começar trial grátis — recupere sua primeira renovação hoje
      </a>
      <p className="text-center text-[12px] text-[#9CA3AF] mt-2">14 dias grátis · Sem cartão · Cancele quando quiser</p>
    </div>
  )
}

export function RoiCalculator({ context = 'modal' }: Props) {
  if (context === 'landing') return <LandingCalculator />
  return <ModalCalculator />
}
