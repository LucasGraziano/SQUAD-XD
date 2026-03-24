export interface Expert {
  id: string
  name: string
  focus: string
  icon: string
  color: string
  layers: { name: string; description: string; items: string[] }[]
}

export interface DnaLayer {
  name: string
  icon: string
  description: string
  color: string
}

export const dnaLayers: DnaLayer[] = [
  { name: 'FILOSOFIAS', icon: '💎', description: 'Crenças fundamentais e princípios filosóficos que guiam decisões', color: 'coral' },
  { name: 'MODELOS-MENTAIS', icon: '🧩', description: 'Frameworks cognitivos para interpretar situações e tomar decisões', color: 'menta' },
  { name: 'HEURISTICAS', icon: '⚡', description: 'Regras práticas e atalhos decisórios testados em campo', color: 'gold' },
  { name: 'FRAMEWORKS', icon: '🏗️', description: 'Estruturas implementáveis para resolver problemas específicos', color: 'coral' },
  { name: 'METODOLOGIAS', icon: '📋', description: 'Processos completos e step-by-step para executar estratégias', color: 'menta' },
]

export const experts: Expert[] = [
  {
    id: 'alex-hormozi',
    name: 'Alex Hormozi',
    focus: 'Sales & Business Scaling',
    icon: '💰',
    color: 'coral',
    layers: [
      {
        name: 'FILOSOFIAS',
        description: 'Princípios de negócios e vendas',
        items: [
          'Value Equation: Reduzir tempo/esforço e aumentar resultado/certeza',
          'Grand Slam Offer: Oferta tão boa que as pessoas se sentem estúpidas dizendo não',
          'Volume negates luck: Quantidade suficiente de ação remove a variável sorte',
          'Price is a proxy for value: Preço baixo comunica baixo valor',
          'Sell the vacation, not the plane flight',
        ],
      },
      {
        name: 'MODELOS-MENTAIS',
        description: 'Frameworks cognitivos para negócios',
        items: [
          'Value Equation Model: Dream Outcome × Perceived Likelihood / Time × Effort',
          'Lead Generation Triangle: Volume × Quality × Conversion',
          'Offer Creation Matrix: Pain → Dream → Vehicle → Stack',
          'Price-to-Value Gap: Quanto maior o gap, mais irresistível',
        ],
      },
      {
        name: 'HEURISTICAS',
        description: 'Regras práticas de vendas',
        items: [
          'Se não é um "HELL YES", é um "no"',
          'Cobrar mais → mais commitment → melhores resultados',
          'Garantia remove risco → remove objeção principal',
          'Escassez real > urgência artificial',
        ],
      },
      {
        name: 'FRAMEWORKS',
        description: 'Estruturas de implementação',
        items: [
          'CLOSER Framework: Clarify, Label, Overview, Sell, Explain, Reinforce',
          'Value Ladder: Free → Low-Ticket → Core → High-Ticket → Continuity',
          'Lead Magnet Formula: Solve one narrow problem completely',
          'Offer Stack Blueprint: Core + Bonuses + Guarantee + Scarcity + Urgency',
        ],
      },
      {
        name: 'METODOLOGIAS',
        description: 'Processos completos',
        items: [
          '$100M Offers Methodology: Identificar dor → Criar solução → Empacotar oferta → Precificar premium',
          '$100M Leads Methodology: Warm outreach → Cold outreach → Content → Paid ads',
          'Gym Launch Model: Transformar negócio local em máquina de aquisição',
        ],
      },
    ],
  },
  {
    id: 'cole-gordon',
    name: 'Cole Gordon',
    focus: 'Sales Models & Differentiation',
    icon: '🎯',
    color: 'menta',
    layers: [
      {
        name: 'FILOSOFIAS',
        description: 'Princípios de vendas consultivas',
        items: [
          'Selling is serving: Vender é ajudar pessoas a tomar a melhor decisão',
          'Questions > Statements: Quem pergunta controla a conversa',
          'Differentiation through process, not product',
          'Close on logic, open on emotion',
        ],
      },
      {
        name: 'FRAMEWORKS',
        description: 'Estruturas de vendas',
        items: [
          'NEPQ Framework: Situation → Problem → Implication → Need-Payoff',
          'Remote Closing Blueprint: Discovery → Diagnosis → Prescription → Close',
          'Objection Prevention System: Prevenir > Rebater',
          'Commission-Only Sales Team Scaling Model',
        ],
      },
      {
        name: 'METODOLOGIAS',
        description: 'Processos de vendas',
        items: [
          'Sales Team Building: Recruit → Train → Deploy → Optimize → Scale',
          '7-Figure Closer Academy: Mindset → Script → Practice → Deploy → Iterate',
        ],
      },
    ],
  },
  {
    id: 'jeremy-haynes',
    name: 'Jeremy Haynes',
    focus: 'Marketing & Ad Strategies',
    icon: '📱',
    color: 'gold',
    layers: [
      {
        name: 'FILOSOFIAS',
        description: 'Princípios de marketing digital',
        items: [
          'Advertise results, not methods',
          'Creative is the new targeting',
          'Diversify traffic sources or die',
          'Speed of implementation > perfection',
        ],
      },
      {
        name: 'FRAMEWORKS',
        description: 'Estruturas de marketing',
        items: [
          'Ad Creative Formula: Hook → Story → Offer → CTA',
          'Funnel Architecture: Traffic → Opt-in → Nurture → Sales → Delivery',
          'Audience Segmentation Matrix: Cold → Warm → Hot → Buyer',
          'Campaign Structure: Testing → Scaling → Maintenance',
        ],
      },
      {
        name: 'METODOLOGIAS',
        description: 'Processos de marketing',
        items: [
          'Agency Scaling Model: Niche → Offer → Fulfillment → Scale',
          'Client Acquisition Flywheel: Paid Ads → Results → Case Studies → More Clients',
          'Creative Testing Protocol: 3-3-3 (3 hooks × 3 bodies × 3 CTAs)',
        ],
      },
    ],
  },
  {
    id: 'jeremy-miner',
    name: 'Jeremy Miner',
    focus: 'NEPQ & Problem-Awareness Sales',
    icon: '🧠',
    color: 'coral',
    layers: [
      {
        name: 'FILOSOFIAS',
        description: 'Vendas baseadas em perguntas',
        items: [
          'Never pitch — diagnose',
          'People buy emotionally, justify logically',
          'The problem is never the problem (go deeper)',
          'Tension creates decision',
        ],
      },
      {
        name: 'FRAMEWORKS',
        description: 'Frameworks de vendas NEPQ',
        items: [
          'NEPQ: Neuro-Emotional Persuasion Questions',
          'Problem Awareness Ladder: Unaware → Problem-Aware → Solution-Aware → Product-Aware → Most Aware',
          'Tone & Pacing Framework: Curious → Concerned → Confident → Casual',
          'Objection Dissolution: Agree → Isolate → Reverse → Close',
        ],
      },
      {
        name: 'METODOLOGIAS',
        description: 'Processos NEPQ',
        items: [
          '7th Level Selling System: Connect → Situation → Problem → Solution → Consequence → Commitment → Close',
          'Micro-Commitment Stacking: Small yeses → Big yes',
        ],
      },
    ],
  },
  {
    id: 'jordan-lee',
    name: 'Jordan Lee',
    focus: 'Enterprise Value & Team Structure',
    icon: '🏢',
    color: 'menta',
    layers: [
      {
        name: 'FILOSOFIAS',
        description: 'Valor empresarial e estrutura',
        items: [
          'Build to sell, even if you never do',
          'Systems run the business, people run the systems',
          'Enterprise value > monthly revenue',
          'Recurring revenue is the foundation of wealth',
        ],
      },
      {
        name: 'FRAMEWORKS',
        description: 'Frameworks empresariais',
        items: [
          'Team Structure Diamond: CEO → Ops → Sales → Delivery → Support',
          'Hiring Framework: A-players hire A-players, B-players hire C-players',
          'KPI Dashboard: Revenue, Profit, LTV, CAC, Churn, NPS',
        ],
      },
    ],
  },
  {
    id: 'richard-linder',
    name: 'Richard Linder',
    focus: 'Framework Optimization',
    icon: '⚙️',
    color: 'gold',
    layers: [
      {
        name: 'FILOSOFIAS',
        description: 'Otimização de sistemas',
        items: [
          'Optimize the system, not the symptom',
          'Measurement is the first step to improvement',
          'Simplify before you optimize',
        ],
      },
      {
        name: 'FRAMEWORKS',
        description: 'Frameworks de otimização',
        items: [
          'Conversion Optimization Framework: Traffic → Landing → Offer → Follow-up',
          'Split Testing Protocol: Hypothesis → Test → Measure → Iterate',
          'Funnel Diagnostic: Where are people dropping off?',
        ],
      },
    ],
  },
  {
    id: 'sam-oven',
    name: 'Sam Ovens',
    focus: 'Business Model Design',
    icon: '🔬',
    color: 'coral',
    layers: [
      {
        name: 'FILOSOFIAS',
        description: 'Design de modelo de negócio',
        items: [
          'Consulting is the fastest path to $1M',
          'Niche down until it hurts, then niche down more',
          'Transform yourself first, then teach the transformation',
          'One funnel, one offer, one traffic source — until $1M',
        ],
      },
      {
        name: 'FRAMEWORKS',
        description: 'Frameworks de negócios',
        items: [
          'Consulting Business Blueprint: Niche → Offer → Funnel → Traffic → Close → Deliver',
          'Quantum Model: Information → Automation → Done-For-You → Platform',
          'Webinar Funnel Framework: Ad → Registration → Webinar → Application → Close',
        ],
      },
      {
        name: 'METODOLOGIAS',
        description: 'Metodologias completas',
        items: [
          'Consulting Accelerator: Mindset → Niche → Offer → Acquisition → Delivery → Scale',
          'UpLevel Consulting: Advanced positioning, premium pricing, team building',
        ],
      },
    ],
  },
  {
    id: 'the-scalable-company',
    name: 'The Scalable Company',
    focus: 'Scaling Methodologies',
    icon: '📈',
    color: 'menta',
    layers: [
      {
        name: 'FILOSOFIAS',
        description: 'Filosofias de escala',
        items: [
          'Scale systems, not effort',
          'Constraint theory: Find and fix the bottleneck',
          'Predictable revenue requires predictable systems',
          'Culture eats strategy for breakfast',
        ],
      },
      {
        name: 'FRAMEWORKS',
        description: 'Frameworks de escala',
        items: [
          'Scaling Readiness Assessment: Product-Market Fit → Unit Economics → Team → Systems → Capital',
          'Growth Engine Framework: Acquisition → Activation → Revenue → Retention → Referral',
          'Operations Maturity Model: Chaos → Reactive → Proactive → Predictive → Autonomous',
        ],
      },
      {
        name: 'METODOLOGIAS',
        description: 'Metodologias de escala',
        items: [
          'Scale Sprint: 90-day intensive scaling program',
          'Department Building: Hire → Train → Document → Delegate → Audit',
        ],
      },
    ],
  },
]

export const megaBrainStats = {
  totalKnowledgeItems: 60,
  experts: 8,
  dnaLayers: 5,
  dossiers: 31,
  playbooks: 12,
  syncMode: 'Incremental (SHA-256)',
  lastSync: '2026-03-11',
}

export const companyContext = {
  name: 'Squad XD',
  founders: [
    { name: 'Lucas Graziano', role: 'CEO / Tech', focus: 'AI Orchestration, Full-Stack Development, Product Strategy' },
    { name: 'Pedro Cabral', role: 'COO / Marketing', focus: 'Marketing Digital, Tráfego Pago, Growth' },
  ],
  products: [
    { name: 'Zero Diástase Quiz', type: 'Low-Ticket Funnel', description: 'Quiz de vendas para programa de recuperação de diástase abdominal pós-parto' },
  ],
}
