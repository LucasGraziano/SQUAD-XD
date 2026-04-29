'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Users,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Clock,
  ChevronRight,
  CheckCircle2,
  CircleDashed,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { format } from 'date-fns'
import { AnimatedCounter, StaggerGroup, StaggerItem, HoverCard, PulseDot } from '@/components/ui/motion'
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations'

interface DashboardClientProps {
  stats: {
    totalPatients: number
    sessionsThisWeek: number
    criticalAlerts: number
    revenue: number
  }
  upcomingSessions: Array<{
    id: string
    scheduled_at: string
    session_number: number
    duration_minutes: number
    status: string
    patients: { full_name: string } | null
  }>
  recentPayments: Array<{
    id: string
    amount_cents: number
    status: string
    patients: { full_name: string } | null
  }>
}

export function DashboardClient({ stats, upcomingSessions, recentPayments }: DashboardClientProps) {
  return (
    <main className="flex-1 p-6 space-y-6 overflow-auto">
      {/* Stats Grid */}
      <motion.div
        variants={staggerContainer(0.07, 0.05)}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={staggerItem}>
          <StatCard
            label="Pacientes ativos"
            value={stats.totalPatients}
            suffix=""
            icon={<Users size={20} strokeWidth={1.5} />}
            color="teal"
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard
            label="Sessões esta semana"
            value={stats.sessionsThisWeek}
            suffix=""
            icon={<Calendar size={20} strokeWidth={1.5} />}
            color="sand"
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <Link href="/alertas">
            <StatCard
              label="Alertas de risco"
              value={stats.criticalAlerts}
              suffix=""
              icon={<AlertTriangle size={20} strokeWidth={1.5} />}
              color={stats.criticalAlerts > 0 ? 'danger' : 'success'}
              alert={stats.criticalAlerts > 0}
            />
          </Link>
        </motion.div>
        <motion.div variants={staggerItem}>
          <Link href="/financeiro">
            <StatCard
              label="Receita do mês"
              value={stats.revenue / 100}
              suffix=""
              prefix="R$"
              icon={<TrendingUp size={20} strokeWidth={1.5} />}
              color="gold"
            />
          </Link>
        </motion.div>
      </motion.div>

      {/* Getting Started — shown only when no patients yet */}
      {stats.totalPatients === 0 && <GettingStarted />}

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 card-vinculo p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-neutral-charcoal">Próximas sessões</h2>
            <Link
              href="/agenda"
              className="text-sm text-brand-teal hover:text-brand-teal-dark flex items-center gap-1 transition-colors"
            >
              Ver agenda <ChevronRight size={14} />
            </Link>
          </div>

          {!upcomingSessions.length ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-12"
            >
              <Calendar size={36} strokeWidth={1} className="mx-auto mb-3 text-neutral-border" />
              <p className="text-sm text-neutral-secondary">Nenhuma sessão agendada</p>
              <Link
                href="/agenda/novo"
                className="inline-flex items-center gap-1 mt-3 text-sm text-brand-teal hover:text-brand-teal-dark"
              >
                Agendar sessão <ChevronRight size={14} />
              </Link>
            </motion.div>
          ) : (
            <StaggerGroup className="space-y-2" staggerChildren={0.06} delayChildren={0.1}>
              {upcomingSessions.map((session) => (
                <StaggerItem key={session.id}>
                  <HoverCard className="flex items-center gap-4 p-3.5 rounded-xl bg-neutral-mist hover:bg-white border border-transparent hover:border-neutral-border cursor-pointer transition-colors">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-teal/10 flex items-center justify-center">
                      <Clock size={16} strokeWidth={1.5} className="text-brand-teal" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-charcoal truncate">
                        {session.patients?.full_name ?? 'Paciente'}
                      </p>
                      <p className="text-xs text-neutral-secondary">
                        {format(new Date(session.scheduled_at), 'HH:mm')} · Sessão #{session.session_number} · {session.duration_minutes}min
                      </p>
                    </div>
                    <SessionBadge status={session.status} />
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerGroup>
          )}
        </motion.div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
            className="card-vinculo p-5"
          >
            <h2 className="text-sm font-semibold text-neutral-charcoal mb-3">Ações rápidas</h2>
            <div className="space-y-1.5">
              {quickActions.map(({ label, href, icon: Icon }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06, duration: 0.3 }}
                >
                  <Link
                    href={href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-sand/40 transition-all duration-fast group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-brand-teal/10 group-hover:bg-brand-teal/15 flex items-center justify-center transition-colors">
                      <Icon size={14} strokeWidth={1.5} className="text-brand-teal" />
                    </div>
                    <span className="text-sm text-neutral-charcoal group-hover:text-brand-teal transition-colors">{label}</span>
                    <ChevronRight size={13} className="ml-auto text-neutral-secondary group-hover:text-brand-teal transition-all group-hover:translate-x-0.5" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Payments */}
          {recentPayments.length > 0 && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.25 }}
              className="card-vinculo p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-neutral-charcoal">Cobranças recentes</h2>
                <Link href="/financeiro" className="text-xs text-brand-teal hover:text-brand-teal-dark">
                  Ver todas
                </Link>
              </div>
              <StaggerGroup className="space-y-2" staggerChildren={0.05} delayChildren={0.3}>
                {recentPayments.map((payment) => (
                  <StaggerItem key={payment.id}>
                    <div className="flex items-center justify-between py-2 border-b border-neutral-border/50 last:border-0">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-neutral-charcoal truncate">
                          {payment.patients?.full_name ?? 'Paciente'}
                        </p>
                        <PaymentBadge status={payment.status} />
                      </div>
                      <span className="text-xs font-semibold text-neutral-charcoal tabular-nums ml-3 flex-shrink-0">
                        R${(payment.amount_cents / 100).toFixed(0)}
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
}

// ── Sub-components ─────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: number
  suffix?: string
  prefix?: string
  icon: React.ReactNode
  color: 'teal' | 'sand' | 'gold' | 'danger' | 'success'
  alert?: boolean
}

const colorMap = {
  teal:    'bg-brand-teal/10 text-brand-teal',
  sand:    'bg-brand-sand text-brand-teal',
  gold:    'bg-brand-gold/10 text-brand-gold',
  danger:  'bg-semantic-danger-bg text-semantic-danger',
  success: 'bg-semantic-success-bg text-semantic-success',
}

function StatCard({ label, value, suffix = '', prefix = '', icon, color, alert }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)' }}
      transition={{ duration: 0.2 }}
      className="card-vinculo p-5 cursor-default"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-neutral-secondary mb-1">{label}</p>
          <p className="text-2xl font-semibold text-neutral-charcoal tabular-nums leading-none">
            {prefix}
            <AnimatedCounter to={value} duration={1.2} />
            {suffix}
          </p>
        </div>
        <div className={`relative p-2 rounded-lg ${colorMap[color]}`}>
          {icon}
          {alert && (
            <span className="absolute -top-0.5 -right-0.5">
              <PulseDot />
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function SessionBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: 'bg-semantic-success-bg text-semantic-success border-semantic-success/20',
    scheduled: 'bg-neutral-mist text-neutral-secondary border-neutral-border',
    cancelled:  'bg-semantic-danger-bg text-semantic-danger border-semantic-danger/20',
  }
  const label: Record<string, string> = {
    confirmed: 'Confirmada',
    scheduled: 'Agendada',
    cancelled:  'Cancelada',
  }
  return (
    <span className={`text-[11px] font-medium px-2 py-1 rounded-badge border ${map[status] ?? map.scheduled}`}>
      {label[status] ?? status}
    </span>
  )
}

function PaymentBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid:    'text-semantic-success',
    pending: 'text-semantic-warning',
    overdue: 'text-semantic-danger',
  }
  const label: Record<string, string> = {
    paid:    'Pago',
    pending: 'Pendente',
    overdue: 'Em atraso',
  }
  return (
    <span className={`text-[10px] font-medium ${map[status] ?? 'text-neutral-secondary'}`}>
      {label[status] ?? status}
    </span>
  )
}

const quickActions = [
  { label: 'Novo paciente', href: '/pacientes/novo', icon: Users },
  { label: 'Agendar sessão', href: '/agenda/novo', icon: Calendar },
  { label: 'Ver alertas', href: '/alertas', icon: AlertTriangle },
  { label: 'Relatório financeiro', href: '/financeiro', icon: TrendingUp },
]

const STEPS = [
  {
    number: 1,
    title: 'Cadastre seu primeiro paciente',
    description: 'Adicione nome, contato e valor por sessão.',
    href: '/pacientes/novo',
    cta: 'Cadastrar paciente',
  },
  {
    number: 2,
    title: 'Agende a primeira sessão',
    description: 'Defina data, hora e ative a confirmação por WhatsApp.',
    href: '/agenda/novo',
    cta: 'Criar agendamento',
  },
  {
    number: 3,
    title: 'Escreva uma nota clínica',
    description: 'Prontuário criptografado AES-256 — só você acessa.',
    href: '/prontuario',
    cta: 'Abrir prontuário',
  },
]

function GettingStarted() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="card-vinculo p-6 border-brand-teal/20 bg-gradient-to-br from-white to-brand-teal/[0.03]"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="p-1.5 rounded-lg bg-brand-teal/10 text-brand-teal">
          <Sparkles size={16} strokeWidth={1.5} />
        </div>
        <h2 className="text-base font-semibold text-neutral-charcoal">Primeiros passos</h2>
        <span className="ml-auto text-xs text-neutral-secondary">
          Leva menos de 5 minutos
        </span>
      </div>

      <div className="space-y-3">
        {STEPS.map((step) => (
          <Link
            key={step.number}
            href={step.href}
            className="flex items-center gap-4 p-4 rounded-xl border border-neutral-border hover:border-brand-teal/30 hover:bg-brand-teal/[0.02] transition-all group"
          >
            <span className="flex-none w-7 h-7 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-semibold flex items-center justify-center">
              {step.number}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-charcoal">{step.title}</p>
              <p className="text-xs text-neutral-secondary mt-0.5">{step.description}</p>
            </div>
            <span className="flex-none text-xs font-medium text-brand-teal flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {step.cta} <ArrowRight size={12} />
            </span>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}
