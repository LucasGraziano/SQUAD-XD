import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

// Inline SVG illustrations — lightweight, no external deps
function IllustrationClients() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <circle cx="40" cy="28" r="14" fill="rgba(11,217,4,0.10)" stroke="rgba(11,217,4,0.4)" strokeWidth="1.5"/>
      <circle cx="40" cy="28" r="8" fill="rgba(11,217,4,0.18)"/>
      <path d="M16 62c0-13.255 10.745-24 24-24s24 10.745 24 24" stroke="rgba(11,217,4,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="22" cy="34" r="7" fill="#F3F4F6" stroke="#D1D1D1" strokeWidth="1.2"/>
      <circle cx="58" cy="34" r="7" fill="#F3F4F6" stroke="#D1D1D1" strokeWidth="1.2"/>
    </svg>
  )
}

function IllustrationApolices() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <rect x="16" y="12" width="48" height="56" rx="6" fill="#F9FAFB" stroke="#D1D1D1" strokeWidth="1.5"/>
      <rect x="16" y="12" width="48" height="56" rx="6" fill="rgba(11,217,4,0.06)" stroke="rgba(11,217,4,0.3)" strokeWidth="1.5"/>
      <line x1="26" y1="30" x2="54" y2="30" stroke="rgba(11,217,4,0.5)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="26" y1="40" x2="54" y2="40" stroke="#D1D1D1" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="26" y1="50" x2="42" y2="50" stroke="#D1D1D1" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="59" cy="55" r="10" fill="#0BD904"/>
      <path d="M54.5 55l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IllustrationAlerts() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <path d="M40 14C40 14 20 24 20 44v10l-4 4h48l-4-4V44C60 24 40 14 40 14Z" fill="rgba(11,217,4,0.10)" stroke="rgba(11,217,4,0.4)" strokeWidth="1.5"/>
      <path d="M35 58c0 2.761 2.239 5 5 5s5-2.239 5-5" stroke="rgba(11,217,4,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="40" cy="36" r="4" fill="rgba(11,217,4,0.4)"/>
    </svg>
  )
}

function IllustrationQuotes() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <rect x="12" y="18" width="44" height="32" rx="6" fill="rgba(11,217,4,0.08)" stroke="rgba(11,217,4,0.35)" strokeWidth="1.5"/>
      <line x1="22" y1="28" x2="46" y2="28" stroke="rgba(11,217,4,0.5)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="22" y1="36" x2="38" y2="36" stroke="#D1D1D1" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M28 50l6 10h24l6-10" fill="rgba(11,217,4,0.06)" stroke="rgba(11,217,4,0.25)" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
}

function IllustrationPipeline() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <rect x="8" y="14" width="18" height="52" rx="4" fill="rgba(11,217,4,0.08)" stroke="rgba(11,217,4,0.3)" strokeWidth="1.3"/>
      <rect x="31" y="22" width="18" height="44" rx="4" fill="rgba(11,217,4,0.06)" stroke="#D1D1D1" strokeWidth="1.3"/>
      <rect x="54" y="30" width="18" height="36" rx="4" fill="#F9FAFB" stroke="#D1D1D1" strokeWidth="1.3"/>
      <rect x="10" y="17" width="14" height="10" rx="3" fill="rgba(11,217,4,0.3)"/>
      <rect x="33" y="25" width="14" height="10" rx="3" fill="rgba(11,217,4,0.2)"/>
    </svg>
  )
}

const ILLUSTRATIONS = {
  clients:  IllustrationClients,
  apolices: IllustrationApolices,
  alerts:   IllustrationAlerts,
  quotes:   IllustrationQuotes,
  pipeline: IllustrationPipeline,
}

interface Cta {
  label: string
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

interface EmptyStateProps {
  illustration?: keyof typeof ILLUSTRATIONS
  title: string
  description: string
  primaryCta?: Cta
  secondaryCta?: Cta
  className?: string
  compact?: boolean
}

export function EmptyState({
  illustration,
  title,
  description,
  primaryCta,
  secondaryCta,
  className,
  compact = false,
}: EmptyStateProps) {
  const Illustration = illustration ? ILLUSTRATIONS[illustration] : null

  function renderCta(cta: Cta, primary: boolean) {
    const base = primary
      ? 'inline-flex items-center justify-center h-9 px-5 rounded-[6px] bg-[#0BD904] text-[#0D0D0D] text-[13px] font-semibold hover:bg-[#09C803] transition-colors'
      : 'inline-flex items-center justify-center h-9 px-5 rounded-[6px] border border-[#D1D1D1] text-[13px] font-medium text-[#6B7280] hover:border-[#0D0D0D] transition-colors'

    if (cta.href) {
      return <Link href={cta.href} className={base}>{cta.label}</Link>
    }
    return (
      <button type="button" onClick={cta.onClick} className={base}>{cta.label}</button>
    )
  }

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      compact ? 'py-10 px-6' : 'py-20 px-8',
      className
    )}>
      {Illustration && (
        <div className="mb-6">
          <Illustration />
        </div>
      )}
      <h3 className={cn('font-bold text-[#0D0D0D] mb-2', compact ? 'text-[16px]' : 'text-[20px]')}>
        {title}
      </h3>
      <p className={cn('text-[#6B7280] max-w-[360px] leading-relaxed', compact ? 'text-[13px]' : 'text-[14px]')}>
        {description}
      </p>
      {(primaryCta || secondaryCta) && (
        <div className="flex items-center gap-2 mt-6">
          {primaryCta && renderCta(primaryCta, true)}
          {secondaryCta && renderCta(secondaryCta, false)}
        </div>
      )}
    </div>
  )
}

// Inline filter-empty — no illustration, used inside filtered lists
export function FilterEmptyState({ term, onClear }: { term?: string; onClear?: () => void }) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <p className="text-[14px] font-medium text-[#0D0D0D]">
        {term ? `Nenhum resultado para "${term}"` : 'Nenhum resultado encontrado'}
      </p>
      {onClear && (
        <button type="button" onClick={onClear} className="mt-2 text-[13px] text-[#0BD904] hover:underline">
          Limpar filtros
        </button>
      )}
    </div>
  )
}
