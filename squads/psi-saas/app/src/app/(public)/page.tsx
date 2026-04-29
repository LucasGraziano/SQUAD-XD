'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import {
  ArrowRight,
  Shield,
  Brain,
  AlertTriangle,
  Calendar,
  FileText,
  CreditCard,
  Users,
  CheckCircle2,
  X,
  ChevronDown,
  Star,
  Quote,
  TrendingDown,
  Clock,
  MessageSquare,
  Lock,
} from 'lucide-react'
import {
  Reveal,
  StaggerGroup,
  StaggerItem,
  HoverCard,
  AnimatedCounter,
  FloatingShape,
  PulseDot,
  ShimmerText,
} from '@/components/ui/motion'
import { fadeUp, slideInLeft, slideInRight } from '@/lib/animations'

// ── Nav ────────────────────────────────────────────────────────
function Nav() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-border/60"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <motion.span
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="font-serif text-xl text-brand-teal"
        >
          Vínculo
        </motion.span>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="flex items-center gap-6"
        >
          <Link href="#como-funciona" className="text-sm text-neutral-secondary hover:text-neutral-charcoal transition-colors hidden md:block">
            Como funciona
          </Link>
          <Link href="#planos" className="text-sm text-neutral-secondary hover:text-neutral-charcoal transition-colors hidden md:block">
            Planos
          </Link>
          <Link href="#faq" className="text-sm text-neutral-secondary hover:text-neutral-charcoal transition-colors hidden md:block">
            FAQ
          </Link>
          <Link href="/login" className="text-sm font-medium text-neutral-charcoal hover:text-brand-teal transition-colors">
            Entrar
          </Link>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/register"
              className="bg-brand-teal hover:bg-brand-teal-dark text-white text-sm font-medium px-4 py-2 rounded-input transition-colors duration-fast"
            >
              14 dias grátis
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.nav>
  )
}

// ── Hero ───────────────────────────────────────────────────────
function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} className="relative hero-gradient pt-32 pb-28 px-6 overflow-hidden">
      <motion.div style={{ y, opacity }} className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-medium px-4 py-2 rounded-full mb-8 backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-sand animate-pulse" />
          O único SaaS clínico com alerta de abandono — Brasil
        </motion.div>

        {/* Big Idea — Headline */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.2, 0, 0, 1] }}
            className="font-serif text-display-xl text-white leading-tight"
          >
            Seu paciente dá 7 sinais
          </motion.h1>
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.7, ease: [0.2, 0, 0, 1] }}
          >
            <ShimmerText className="font-serif text-display-xl leading-tight">
              antes de abandonar a terapia.
            </ShimmerText>
          </motion.div>
          <motion.h1
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.7, ease: [0.2, 0, 0, 1] }}
            className="font-serif text-display-xl text-white leading-tight"
          >
            Nenhum sistema detectava isso.
          </motion.h1>
        </div>

        {/* Sub-headline PMN */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          className="text-white/75 text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Para a psicóloga que perdeu um paciente sem saber por quê — o Vínculo é o primeiro sistema
          que avisa <strong className="text-white">antes do desaparecimento</strong>, enquanto ainda dá tempo de agir.
          Prontuário, agenda e cobrança: tudo junto, CFP-compliant.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 bg-white text-brand-teal hover:bg-brand-sand font-semibold px-8 py-3.5 rounded-input transition-colors duration-fast"
            >
              Começar 14 dias grátis
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowRight size={18} />
              </motion.span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="#problema"
              className="flex items-center justify-center border border-white/30 text-white hover:bg-white/10 font-medium px-8 py-3.5 rounded-input transition-colors duration-fast"
            >
              Ver como funciona
            </Link>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-white/40 text-xs mt-4"
        >
          Sem cartão de crédito · Sem fidelidade · Cancele quando quiser
        </motion.p>
      </motion.div>

      {/* Floating shapes */}
      <FloatingShape duration={7} delay={0} className="absolute top-20 left-[8%] w-16 h-16 rounded-2xl bg-white/5 border border-white/10" />
      <FloatingShape duration={9} delay={1.5} className="absolute top-40 right-[6%] w-24 h-24 rounded-full bg-brand-gold/10 border border-brand-gold/20" />
      <FloatingShape duration={6} delay={3} className="absolute bottom-16 left-[15%] w-10 h-10 rounded-xl bg-white/8 border border-white/10" />
      <FloatingShape duration={8} delay={0.8} className="absolute bottom-24 right-[12%] w-14 h-14 rounded-2xl bg-brand-sand/10" />
    </section>
  )
}

// ── Pain Installer ─────────────────────────────────────────────
function PainInstaller() {
  return (
    <section id="problema" className="py-20 px-6 bg-neutral-charcoal overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative max-w-3xl mx-auto text-center">
        <Reveal>
          <p className="text-brand-sand text-xs font-semibold uppercase tracking-widest mb-6">O cenário que toda psicóloga conhece</p>
          <blockquote className="font-serif text-2xl text-white leading-relaxed mb-8">
            "Segunda-feira, 7h da manhã. Você abre a agenda e percebe que aquela paciente
            não confirmou, não respondeu, e provavelmente não vai aparecer.
            <span className="text-brand-sand"> Você só descobre agora."</span>
          </blockquote>
          <p className="text-white/60 text-base leading-relaxed mb-10">
            Ela não abandona de uma hora para outra. Ela deu sinais por semanas — faltou uma vez, depois confirmou tarde, depois não respondeu. Você estava com <strong className="text-white/80">15 outros pacientes para gerenciar e uma planilha que não avisa ninguém.</strong>
          </p>

          <div className="grid sm:grid-cols-3 gap-4 text-left">
            {[
              { icon: TrendingDown, label: 'R$ 4.800/ano', desc: 'Valor médio perdido por cada paciente que abandona (10 sessões × R$160 × 3 pacientes/ano)' },
              { icon: Clock, label: '3 semanas', desc: 'Tempo médio que a psicóloga leva para perceber que o paciente desengajou' },
              { icon: MessageSquare, label: '40–60%', desc: 'Taxa de abandono na terapia — o problema mais caro e mais invisível da sua clínica' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <Icon size={18} className="text-brand-sand mb-3" strokeWidth={1.5} />
                <p className="text-white font-semibold text-lg mb-1">{label}</p>
                <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ── Feature Killer ─────────────────────────────────────────────
function FeatureKiller() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-semantic-danger-bg to-orange-50/50 border-b border-semantic-danger/10 overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, #C0392B 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }} />

      <div className="relative max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal variants={slideInLeft}>
            <div className="inline-flex items-center gap-2 bg-semantic-danger/12 text-semantic-danger text-xs font-semibold px-4 py-2 rounded-full mb-5 uppercase tracking-wide">
              <AlertTriangle size={14} />
              Exclusivo Vínculo — nenhum concorrente tem
            </div>
            <h2 className="font-serif text-display-md text-neutral-charcoal mb-5 leading-tight">
              Alerta de Risco<br />de Abandono
            </h2>
            <p className="text-neutral-secondary leading-relaxed mb-6">
              O Vínculo analisa frequência de faltas, padrão de confirmação e
              tempo desde a última sessão — e calcula diariamente o risco de cada paciente desaparecer.
              Você recebe o alerta <strong className="text-neutral-charcoal">antes</strong> do sumiço,
              não depois.
            </p>
            <div className="space-y-3">
              {[
                'Por que sua paciente que faltou 3 vezes tem 78% de chance de não voltar',
                'Email de alerta quando o risco passa do limiar — com sugestão de ação',
                'Dashboard de pacientes em atenção, ordenados por urgência',
                'Nenhum outro sistema no Brasil detecta abandono antes de acontecer',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm text-neutral-secondary">
                  <CheckCircle2 size={16} className="text-semantic-danger flex-shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>
          </Reveal>

          {/* Risk Score Card Preview */}
          <Reveal variants={slideInRight} delay={100}>
            <HoverCard className="bg-white rounded-card shadow-modal p-6 border border-neutral-border/50">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-neutral-secondary mb-0.5">Paciente</p>
                  <p className="font-semibold text-neutral-charcoal">Maria Fernanda</p>
                </div>
                <div className="flex items-center gap-2">
                  <PulseDot />
                  <span className="text-xs font-medium text-semantic-danger bg-semantic-danger-bg px-2.5 py-1 rounded-badge">
                    CRÍTICO
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-neutral-secondary">Score de Risco</span>
                  <span className="text-sm font-bold text-semantic-danger tabular-nums">
                    <AnimatedCounter to={84} suffix="%" duration={1.8} />
                  </span>
                </div>
                <div className="h-2 bg-neutral-mist rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '84%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: 0.3, ease: [0.2, 0, 0, 1] }}
                    className="h-full bg-gradient-to-r from-orange-400 to-semantic-danger rounded-full"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-5">
                {[
                  { label: 'Taxa de faltas', value: '40%' },
                  { label: 'Dias sem sessão', value: '22 dias' },
                  { label: 'Confirmações ignoradas', value: '3 de 4' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="text-neutral-secondary">{label}</span>
                    <span className="font-medium text-neutral-charcoal tabular-nums">{value}</span>
                  </div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="pt-4 border-t border-neutral-border"
              >
                <p className="text-xs text-neutral-secondary mb-2">Sugestão do Vínculo</p>
                <p className="text-sm font-medium text-brand-teal">
                  → Entre em contato agora. Alta probabilidade de abandono em 7 dias.
                </p>
              </motion.div>
            </HoverCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ── Before / After ─────────────────────────────────────────────
function BeforeAfter() {
  const items = [
    {
      before: 'Agenda no Google Calendar + confirmação manual pelo WhatsApp',
      after: 'Agenda integrada com confirmação automática 48h antes — zero trabalho manual',
    },
    {
      before: 'Prontuário no Word ou papel — sem criptografia, sem conformidade CFP',
      after: 'Prontuário eletrônico criptografado AES-256, imutável após 24h, exportável em PDF CFP-compliant',
    },
    {
      before: 'Cobrar pelo WhatsApp, constrangedor e esquecido com frequência',
      after: 'PIX gerado automaticamente ao registrar a sessão — você recebe sem precisar cobrar',
    },
    {
      before: 'Saber que um paciente abandonou só quando o horário vira furo na agenda',
      after: 'Alerta por email antes do abandono, com sugestão de ação e score de risco em tempo real',
    },
    {
      before: 'Nenhuma visão da sua orientação teórica — impressão, não dado',
      after: 'IA analisa seus escritos e identifica sua linhagem predominante: TCC, humanista, analítica',
    },
  ]

  return (
    <section className="py-24 px-6 bg-white border-t border-neutral-border">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-14">
          <p className="text-brand-teal text-xs font-semibold uppercase tracking-widest mb-3">Antes × Depois</p>
          <h2 className="font-serif text-display-md text-neutral-charcoal mb-3">
            Como é a sua semana agora<br />e como vai ser com o Vínculo
          </h2>
        </Reveal>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="pb-4 pr-6 text-left">
                  <div className="flex items-center gap-2 text-sm font-semibold text-neutral-secondary">
                    <X size={16} className="text-semantic-danger" />
                    Método atual
                  </div>
                </th>
                <th className="pb-4 text-left">
                  <div className="flex items-center gap-2 text-sm font-semibold text-brand-teal">
                    <CheckCircle2 size={16} />
                    Com o Vínculo
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ before, after }, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="border-t border-neutral-border/50"
                >
                  <td className="py-4 pr-6 align-top">
                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-semantic-danger/40 mt-2 flex-shrink-0" />
                      <p className="text-sm text-neutral-secondary leading-relaxed">{before}</p>
                    </div>
                  </td>
                  <td className="py-4 align-top">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={14} className="text-semantic-success mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                      <p className="text-sm text-neutral-charcoal leading-relaxed">{after}</p>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

// ── Features ───────────────────────────────────────────────────
function Features() {
  return (
    <section id="funcionalidades" className="py-24 px-6 bg-neutral-off-white">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-16">
          <p className="text-brand-teal text-xs font-semibold uppercase tracking-widest mb-3">Funcionalidades</p>
          <h2 className="font-serif text-display-md text-neutral-charcoal mb-4">
            Tudo que você precisa,<br />nada que você não usa
          </h2>
          <p className="text-neutral-secondary max-w-lg mx-auto">
            De prontuários a cobranças — uma plataforma, zero planilhas.
          </p>
        </Reveal>

        <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" staggerChildren={0.07}>
          {features.map(({ icon: Icon, title, desc, badge }) => (
            <StaggerItem key={title}>
              <HoverCard className="card-vinculo p-6 h-full cursor-default">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-brand-sand rounded-xl flex items-center justify-center">
                    <Icon size={20} strokeWidth={1.5} className="text-brand-teal" />
                  </div>
                  {badge && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide bg-brand-gold/15 text-brand-gold px-2 py-0.5 rounded-badge">
                      {badge}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-neutral-charcoal mb-2 leading-snug">{title}</h3>
                <p className="text-sm text-neutral-secondary leading-relaxed">{desc}</p>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}

// ── Testimonials ───────────────────────────────────────────────
function Testimonials() {
  return (
    <section className="py-24 px-6 bg-white border-t border-neutral-border">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-14">
          <p className="text-brand-teal text-xs font-semibold uppercase tracking-widest mb-3">Beta Testers</p>
          <h2 className="font-serif text-display-md text-neutral-charcoal mb-3">
            O que as primeiras usuárias dizem
          </h2>
          <p className="text-neutral-secondary text-sm">Psicólogas que usaram o Vínculo durante o beta fechado</p>
        </Reveal>

        <StaggerGroup className="grid md:grid-cols-3 gap-6" staggerChildren={0.1}>
          {testimonials.map((t, i) => (
            <StaggerItem key={i}>
              <div className="bg-neutral-off-white rounded-card p-6 border border-neutral-border h-full flex flex-col">
                <Quote size={20} className="text-brand-teal/30 mb-3 flex-shrink-0" strokeWidth={1.5} />
                <p className="text-sm text-neutral-charcoal leading-relaxed flex-1 mb-5 italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-neutral-border">
                  <div className="w-9 h-9 rounded-full bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-teal text-xs font-semibold">{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-charcoal">{t.name}</p>
                    <p className="text-[11px] text-neutral-secondary">{t.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} size={11} className="text-brand-gold fill-brand-gold" />
                    ))}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}

// ── How it works ───────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: '01', title: 'Crie sua conta em 3 min', desc: 'CRP, especialização, valor por sessão. Sem formulários longos, sem treinamento.' },
    { n: '02', title: 'Importe seus pacientes', desc: 'Cadastro com consentimento LGPD já integrado. Histórico fica no ar, não no HD.' },
    { n: '03', title: 'A agenda trabalha por você', desc: 'WhatsApp automático confirma 48h antes. Falta? Você sabe no mesmo dia.' },
    { n: '04', title: 'Foco só na clínica', desc: 'Notas, cobranças e alertas resolvidos. Você só abre e atende.' },
  ]

  return (
    <section id="como-funciona" className="py-24 px-6 bg-neutral-off-white border-t border-neutral-border">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-16">
          <p className="text-brand-teal text-xs font-semibold uppercase tracking-widest mb-3">Como funciona</p>
          <h2 className="font-serif text-display-md text-neutral-charcoal">
            Pronto em menos de 10 minutos
          </h2>
          <p className="text-neutral-secondary mt-3 max-w-md mx-auto">
            Não precisa de treinamento, não precisa migrar dados, não precisa de TI.
          </p>
        </Reveal>

        <StaggerGroup className="grid md:grid-cols-4 gap-6" staggerChildren={0.1}>
          {steps.map(({ n, title, desc }) => (
            <StaggerItem key={n}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-teal/10 text-brand-teal font-serif text-lg flex items-center justify-center mx-auto mb-4 ring-2 ring-brand-teal/10">
                  {n}
                </div>
                <h3 className="font-semibold text-neutral-charcoal mb-2">{title}</h3>
                <p className="text-sm text-neutral-secondary leading-relaxed">{desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}

// ── Pricing ────────────────────────────────────────────────────
function Pricing() {
  return (
    <section id="planos" className="py-24 px-6 bg-white border-t border-neutral-border">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-4">
          <p className="text-brand-teal text-xs font-semibold uppercase tracking-widest mb-3">Planos</p>
          <h2 className="font-serif text-display-md text-neutral-charcoal mb-3">Simples. Sem surpresas.</h2>
          <p className="text-neutral-secondary">Cancele quando quiser. Sem fidelidade. Tudo começa com 14 dias grátis.</p>
        </Reveal>

        {/* Âncora de custo */}
        <Reveal>
          <div className="max-w-2xl mx-auto mb-12 bg-brand-teal/5 border border-brand-teal/20 rounded-xl px-5 py-4 text-center">
            <p className="text-sm text-neutral-charcoal leading-relaxed">
              <strong>Quanto custa não ter o Vínculo?</strong> Se você perde 3 pacientes/ano por abandono evitável (média de mercado), são{' '}
              <strong className="text-brand-teal">R$ 4.800–9.600 que saem sem você perceber.</strong>{' '}
              O plano Solo custa R$ 79/mês. Você recupera o investimento com um paciente.
            </p>
          </div>
        </Reveal>

        <StaggerGroup className="grid md:grid-cols-3 gap-6 items-start" staggerChildren={0.1} delayChildren={0.1}>
          {plans.map(({ name, price, description, features: planFeatures, highlighted }) => (
            <StaggerItem key={name}>
              <motion.div
                whileHover={highlighted ? { y: -4 } : { y: -3 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className={`rounded-card p-7 border transition-shadow ${
                  highlighted
                    ? 'bg-brand-teal text-white border-brand-teal shadow-modal'
                    : 'bg-white border-neutral-border shadow-card hover:shadow-card-hover'
                }`}
              >
                {highlighted && (
                  <div className="inline-flex items-center gap-1 text-brand-sand text-[10px] font-semibold uppercase tracking-wider mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-sand" />
                    Mais popular
                  </div>
                )}
                <p className={`font-semibold text-lg mb-1 ${highlighted ? 'text-white' : 'text-neutral-charcoal'}`}>
                  {name}
                </p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-3xl font-bold tabular-nums ${highlighted ? 'text-white' : 'text-neutral-charcoal'}`}>
                    R${price}
                  </span>
                  <span className={`text-sm ${highlighted ? 'text-white/60' : 'text-neutral-secondary'}`}>/mês</span>
                </div>
                <p className={`text-sm mb-6 ${highlighted ? 'text-white/65' : 'text-neutral-secondary'}`}>
                  {description}
                </p>
                <ul className="space-y-2.5 mb-7">
                  {planFeatures.map((f) => (
                    <li key={f} className={`text-sm flex items-start gap-2.5 ${highlighted ? 'text-white/85' : 'text-neutral-secondary'}`}>
                      <CheckCircle2 size={15} className={`mt-0.5 flex-shrink-0 ${highlighted ? 'text-brand-sand' : 'text-semantic-success'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/register"
                    className={`block text-center font-semibold py-2.5 px-4 rounded-input transition-colors duration-fast text-sm ${
                      highlighted
                        ? 'bg-white text-brand-teal hover:bg-brand-sand'
                        : 'border-2 border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white'
                    }`}
                  >
                    Começar 14 dias grátis
                  </Link>
                </motion.div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}

// ── Security Strip ─────────────────────────────────────────────
function SecurityStrip() {
  return (
    <Reveal>
      <section className="py-14 px-6 bg-brand-teal">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Shield size={48} strokeWidth={1} className="text-brand-sand flex-shrink-0" />
          </motion.div>
          <div>
            <h2 className="font-serif text-xl text-white mb-2">Segurança de nível hospitalar</h2>
            <p className="text-white/65 text-sm leading-relaxed">
              Criptografia AES-256-GCM nos prontuários — <strong className="text-white/80">nem nós conseguimos ler as notas dos seus pacientes.</strong>{' '}
              Dados armazenados no Brasil. LGPD compliant. CFP Res. 001/2009 + 09/2024.
              Cada acesso a prontuário registrado com timestamp auditável.
            </p>
          </div>
          <div className="flex gap-3 md:ml-auto flex-shrink-0 flex-wrap justify-center">
            {['LGPD', 'CFP 001/2009', 'AES-256-GCM', 'Dados no BR'].map((badge) => (
              <span key={badge} className="text-xs font-semibold text-white/70 border border-white/20 px-3 py-1.5 rounded-full">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  )
}

// ── FAQ ────────────────────────────────────────────────────────
function FAQ() {
  return (
    <section id="faq" className="py-24 px-6 bg-neutral-off-white border-t border-neutral-border">
      <div className="max-w-3xl mx-auto">
        <Reveal className="text-center mb-14">
          <p className="text-brand-teal text-xs font-semibold uppercase tracking-widest mb-3">Dúvidas frequentes</p>
          <h2 className="font-serif text-display-md text-neutral-charcoal">
            Respostas diretas
          </h2>
        </Reveal>

        <StaggerGroup className="space-y-3" staggerChildren={0.06}>
          {faqs.map(({ q, a }, i) => (
            <StaggerItem key={i}>
              <details className="group bg-white border border-neutral-border rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none text-neutral-charcoal font-medium text-sm">
                  {q}
                  <ChevronDown size={16} className="text-neutral-secondary flex-shrink-0 group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <div className="px-5 pb-4 text-sm text-neutral-secondary leading-relaxed border-t border-neutral-border/50 pt-3">
                  {a}
                </div>
              </details>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}

// ── Final CTA ──────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="py-24 px-6 text-center bg-white border-t border-neutral-border">
      <Reveal>
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Lock size={14} className="text-brand-teal" strokeWidth={1.5} />
            <p className="text-brand-teal text-xs font-semibold uppercase tracking-widest">Pronta para começar?</p>
          </div>
          <h2 className="font-serif text-display-md text-neutral-charcoal mb-4">
            Sua concorrente já está usando.<br />
            <span className="text-neutral-secondary/60">Você ainda está na planilha.</span>
          </h2>
          <p className="text-neutral-secondary mb-10">
            14 dias grátis. Sem cartão. Sem compromisso. Se não simplificar sua clínica em 14 dias, cancele com um clique.
          </p>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-brand-teal hover:bg-brand-teal-dark text-white font-semibold px-10 py-4 rounded-input transition-colors duration-fast text-base"
            >
              Criar conta grátis agora
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowRight size={20} />
              </motion.span>
            </Link>
          </motion.div>
          <p className="text-neutral-secondary/50 text-xs mt-5">
            Sem cartão de crédito · Cancele quando quiser · Dados no Brasil
          </p>
        </div>
      </Reveal>
    </section>
  )
}

// ── Footer ─────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-neutral-border py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-serif text-brand-teal">Vínculo</span>
        <p className="text-xs text-neutral-secondary">© {new Date().getFullYear()} Vínculo. Todos os direitos reservados.</p>
        <div className="flex gap-5 text-xs text-neutral-secondary">
          <Link href="/privacidade" className="hover:text-brand-teal transition-colors">Privacidade</Link>
          <Link href="/termos" className="hover:text-brand-teal transition-colors">Termos</Link>
        </div>
      </div>
    </footer>
  )
}

// ── Page ───────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-off-white">
      <Nav />
      <Hero />
      <PainInstaller />
      <FeatureKiller />
      <BeforeAfter />
      <Features />
      <Testimonials />
      <HowItWorks />
      <Pricing />
      <SecurityStrip />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  )
}

// ── Data ───────────────────────────────────────────────────────

const features = [
  {
    icon: Users,
    title: 'Gestão de Pacientes',
    badge: null,
    desc: 'Cadastro com consentimento LGPD automático. Histórico completo, status de vínculo terapêutico e dados de contato de emergência — tudo em um lugar.',
  },
  {
    icon: Calendar,
    title: 'Agenda que confirma sozinha',
    badge: null,
    desc: 'WhatsApp automático 48h antes de cada sessão. Se o paciente não confirmar, você sabe na hora — não quando o horário vira furo.',
  },
  {
    icon: FileText,
    title: 'Prontuário eletrônico seguro',
    badge: null,
    desc: 'Notas criptografadas AES-256 — só você acessa. Imutabilidade após 24h por exigência do CFP. Exportação em PDF pronta para fiscalização.',
  },
  {
    icon: Brain,
    title: 'IA de Linhagem Terapêutica',
    badge: 'IA',
    desc: 'Analisa seus escritos e identifica sua orientação predominante: TCC, psicanálise, humanista. Com percentuais e as técnicas que você mais usa.',
  },
  {
    icon: CreditCard,
    title: 'Cobrança sem constrangimento',
    badge: null,
    desc: 'PIX gerado automaticamente ao registrar a sessão. Cobranças semanais e mensais para pacientes recorrentes. Recibo de saúde integrado.',
  },
  {
    icon: AlertTriangle,
    title: 'Alerta de Abandono',
    badge: 'Exclusivo',
    desc: 'Score de risco diário para cada paciente ativo. Você recebe o alerta antes do sumiço — com a sugestão de ação certa para cada nível de risco.',
  },
]

const testimonials = [
  {
    quote: 'Antes eu descobria que o paciente tinha desaparecido quando olhava para o horário vazio. Agora recebo o alerta dias antes. Já salvei 2 vínculos terapêuticos que teriam encerrado.',
    name: 'Dra. Carolina M.',
    role: 'Psicóloga Clínica · São Paulo, SP',
    initials: 'CM',
  },
  {
    quote: 'Cobrar sempre foi a parte que eu mais evitava. Com o PIX automático, simplesmente parei de pensar nisso. O dinheiro cai e eu foco na clínica.',
    name: 'Dra. Renata F.',
    role: 'Psicoterapeuta · Belo Horizonte, MG',
    initials: 'RF',
  },
  {
    quote: 'O prontuário eletrônico com criptografia me deu paz. Sei que se o CFP fiscalizar amanhã, tudo está conforme. Isso não tem preço.',
    name: 'Dra. Amanda L.',
    role: 'Psicóloga · Porto Alegre, RS',
    initials: 'AL',
  },
]

const plans = [
  {
    name: 'Solo',
    price: '79',
    description: 'Para a psicóloga autônoma',
    highlighted: false,
    features: [
      'Até 30 pacientes ativos',
      'Prontuário eletrônico criptografado',
      'Agenda + confirmação WhatsApp',
      'Cobrança por sessão (PIX automático)',
      'Alerta de abandono básico',
      '14 dias grátis para começar',
    ],
  },
  {
    name: 'Clínico',
    price: '149',
    description: 'Para quem quer crescer sem perder controle',
    highlighted: true,
    features: [
      'Pacientes ilimitados',
      'Tudo do plano Solo',
      'IA de Linhagem Terapêutica',
      'Todos os ciclos de cobrança',
      'Dashboard financeiro completo',
      'Alertas avançados com sugestões de ação',
    ],
  },
  {
    name: 'Pro',
    price: '249',
    description: 'Para clínicas com equipe',
    highlighted: false,
    features: [
      'Tudo do Clínico',
      'Até 5 psicólogas na mesma conta',
      'Relatórios consolidados por profissional',
      'Exportação contábil',
      'Suporte prioritário',
    ],
  },
]

const faqs = [
  {
    q: 'O Vínculo é seguro para o sigilo profissional?',
    a: 'Sim. As notas clínicas são criptografadas com AES-256-GCM diretamente no seu navegador — nem nós temos acesso ao conteúdo. Estamos em conformidade com o CFP Res. 001/2009 e 09/2024. Cada acesso a prontuário fica registrado com timestamp para auditoria.',
  },
  {
    q: 'Preciso de treinamento para começar?',
    a: 'Não. O onboarding leva menos de 10 minutos. Você configura seu CRP, valor por sessão e já pode cadastrar o primeiro paciente. Sem manuais, sem treinamento, sem TI.',
  },
  {
    q: 'Meu prontuário atual (papel ou Word) pode ser migrado?',
    a: 'Você pode cadastrar novos pacientes e criar os prontuários digitais no Vínculo. A migração de dados históricos em papel não é automatizada — mas você pode digitalizá-los gradualmente, sessão a sessão.',
  },
  {
    q: 'O que acontece com meus dados se eu cancelar?',
    a: 'Você pode exportar todos os prontuários em PDF antes de cancelar. Seus dados ficam disponíveis por 30 dias após o cancelamento para que você faça o download completo.',
  },
  {
    q: 'O PIX automático substitui o meu contador?',
    a: 'Não. O Vínculo gera os recibos de saúde e os relatórios financeiros. Você exporta esses dados para enviar ao seu contador. O Vínculo é a gestão clínica — a contabilidade fica com o seu contador.',
  },
  {
    q: 'Como funciona o período de 14 dias grátis?',
    a: 'Você cria a conta sem cartão de crédito e tem acesso completo ao plano Solo por 14 dias. No 15º dia, você escolhe se quer continuar com um plano pago. Se não quiser, simplesmente não faz nada — a conta encerra automaticamente.',
  },
]
