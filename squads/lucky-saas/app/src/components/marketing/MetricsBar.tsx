'use client'

import { useInView } from '@/hooks/useInView'
import { Shield, Bell, Zap, Users } from 'lucide-react'

const metrics = [
  { icon: Users,  value: '50+',  label: 'corretores ativos',           delay: 0 },
  { icon: Bell,   value: '30d',  label: 'de antecedência nos alertas', delay: 100 },
  { icon: Zap,    value: '5min', label: 'para cadastrar sua carteira', delay: 200 },
  { icon: Shield, value: '100%', label: 'cloud, sem instalação',       delay: 300 },
]

export function MetricsBar() {
  const { ref, inView } = useInView()

  return (
    <section ref={ref} className="bg-[#0D0D0D] py-10 px-5">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-white/10">
          {metrics.map((m) => (
            <div
              key={m.label}
              style={inView ? { animationDelay: `${m.delay}ms` } : undefined}
              className={`flex flex-col items-center text-center px-6 ${inView ? 'mkt-count' : 'opacity-0'}`}
            >
              <m.icon size={16} className="text-[#0BD904] mb-2" />
              <span className="text-[32px] font-black text-white leading-none mb-1">{m.value}</span>
              <span className="text-[12px] text-[#6B7280] leading-snug">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
