'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ClaimStatusBadge } from './ClaimStatusBadge'
import { updateClaimStatus, addClaimNote } from '@/app/actions/claims'
import {
  CLAIM_STATUS_LABELS,
  CLAIM_STATUS_FLOW,
  type ClaimStatus,
} from '@/types/claim'

interface Props {
  claimId: string
  currentStatus: ClaimStatus
}

const TERMINAL_STATUSES: ClaimStatus[] = ['closed', 'denied']

export function ClaimDetailActions({ claimId, currentStatus }: Props) {
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [confirmDeny, setConfirmDeny] = useState(false)

  const isTerminal = TERMINAL_STATUSES.includes(currentStatus)

  async function handleStatusUpdate(newStatus: ClaimStatus) {
    setSaving(true)
    setError(null)
    setSuccess(null)
    const { error: err } = await updateClaimStatus(claimId, newStatus, note || undefined)
    setSaving(false)
    if (err) { setError(err); return }
    setNote('')
    setSuccess(`Status atualizado para "${CLAIM_STATUS_LABELS[newStatus]}"`)
    setTimeout(() => setSuccess(null), 3000)
  }

  async function handleAddNote() {
    if (!note.trim()) return
    setSaving(true)
    setError(null)
    const { error: err } = await addClaimNote(claimId, note.trim())
    setSaving(false)
    if (err) { setError(err); return }
    setNote('')
    setSuccess('Nota adicionada')
    setTimeout(() => setSuccess(null), 3000)
  }

  const currentIdx = CLAIM_STATUS_FLOW.indexOf(currentStatus)
  const nextStatus = currentIdx >= 0 && currentIdx < CLAIM_STATUS_FLOW.length - 1
    ? CLAIM_STATUS_FLOW[currentIdx + 1]
    : null

  return (
    <div className="space-y-4">
      {/* Atualizar status */}
      {!isTerminal && (
        <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-4">
          <p className="text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-3">Atualizar Status</p>

          <div className="space-y-1 mb-3">
            {CLAIM_STATUS_FLOW.map(s => (
              <button
                key={s}
                disabled={saving || s === currentStatus}
                onClick={() => handleStatusUpdate(s)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-[6px] text-[13px] text-left transition-colors ${
                  s === currentStatus
                    ? 'bg-[#F3F4F6] text-[#9CA3AF] cursor-default'
                    : 'hover:bg-[#F9FAFB] text-[#0D0D0D]'
                }`}
              >
                <ClaimStatusBadge status={s} size="sm" />
                {s === nextStatus && (
                  <span className="ml-auto text-[10px] text-[#9CA3AF]">próximo</span>
                )}
              </button>
            ))}
          </div>

          {/* Encerrar / Negar */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F3F4F6]">
            <button
              disabled={saving}
              onClick={() => handleStatusUpdate('closed')}
              className="py-1.5 rounded-[6px] text-[12px] font-medium border border-[#E5E5E5] text-[#6B7280] hover:bg-[#F9FAFB] transition-colors"
            >
              Encerrar
            </button>
            {confirmDeny ? (
              <div className="flex gap-1">
                <button
                  disabled={saving}
                  onClick={() => { setConfirmDeny(false); handleStatusUpdate('denied') }}
                  className="flex-1 py-1.5 rounded-[6px] text-[12px] font-semibold bg-[#EF4444] text-white hover:bg-[#DC2626] transition-colors"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setConfirmDeny(false)}
                  className="flex-1 py-1.5 rounded-[6px] text-[12px] font-medium border border-[#E5E5E5] text-[#6B7280] hover:bg-[#F9FAFB] transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                disabled={saving}
                onClick={() => setConfirmDeny(true)}
                className="py-1.5 rounded-[6px] text-[12px] font-medium bg-[#FEF2F2] text-[#EF4444] hover:bg-[#FEE2E2] transition-colors"
              >
                Negar
              </button>
            )}
          </div>
        </div>
      )}

      {/* Adicionar nota */}
      <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-4">
        <p className="text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-3">Adicionar Nota</p>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Escreva uma atualização..."
          rows={3}
          className="w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 py-2 text-[13px] text-[#0D0D0D] outline-none focus:border-[#0BD904] transition-colors resize-none mb-3"
        />
        {!isTerminal && nextStatus && (
          <Button
            onClick={() => handleStatusUpdate(nextStatus)}
            disabled={saving || !note.trim()}
            className="w-full mb-2"
          >
            {saving ? 'Salvando...' : `Avançar + Nota`}
          </Button>
        )}
        <button
          onClick={handleAddNote}
          disabled={saving || !note.trim()}
          className="w-full h-9 rounded-[6px] border border-[#D1D1D1] text-[13px] font-medium text-[#6B7280] hover:text-[#0D0D0D] hover:border-[#0D0D0D] transition-colors disabled:opacity-40"
        >
          Só salvar nota
        </button>
      </div>

      {error && (
        <div className="bg-[#FEF2F2] rounded-[6px] px-3 py-2 text-[12px] text-[#EF4444]">{error}</div>
      )}
      {success && (
        <div className="bg-[#F0FFF4] rounded-[6px] px-3 py-2 text-[12px] text-[#059669]">{success}</div>
      )}

      {isTerminal && (
        <div className="bg-[#F9FAFB] rounded-[6px] px-3 py-3 text-[12px] text-[#6B7280] text-center border border-[#E5E5E5]">
          Sinistro encerrado — só é possível adicionar notas.
        </div>
      )}
    </div>
  )
}
