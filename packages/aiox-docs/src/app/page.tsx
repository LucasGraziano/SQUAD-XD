import Link from 'next/link'

export default function Home() {
  return (
    <div className="grid-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative px-12 pt-24 pb-20 border-b border-surface-600 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-coral/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-menta/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <span className="px-3 py-1 rounded-full bg-surface-700 border border-surface-600 text-[10px] font-bold text-coral uppercase tracking-[0.2em]">
              System Protocol v4.0
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-menta status-dot" />
          </div>
          
          <h1 className="text-7xl font-black mb-6 tracking-tighter leading-[0.9] animate-slide-up">
            AIOX <br />
            <span className="gradient-text">DNA STRATEGY</span>
          </h1>
          
          <p className="text-xl text-text-secondary mb-10 leading-relaxed max-w-2xl animate-slide-up delay-100">
            A orquestração definitiva de inteligência artificial. Onde a visão estratégica se funde com a execução técnica rigorosa através de agentes especializados.
          </p>

          <div className="flex gap-4 animate-slide-up delay-200">
            <Link 
              href="/constitution" 
              className="px-8 py-4 bg-coral hover:bg-coral-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-coral/20 flex items-center gap-2 group"
            >
              Começar Exploração
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link 
              href="/aiox" 
              className="px-8 py-4 bg-surface-800 hover:bg-surface-700 border border-surface-600 text-text-primary font-bold rounded-xl transition-all"
            >
              Core Agents
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy / Mindset Section */}
      <section className="px-12 py-20 border-b border-surface-600">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <span className="text-3xl mb-4 block">🧬</span>
            <h3 className="text-xl font-bold text-text-primary mb-3 italic tracking-tight">Vibe CEO Philosophy</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Você não é apenas um usuário; você é o Diretor. Defina a visão, delegue a execução e refine os resultados. O AIOX escala sua intenção.
            </p>
          </div>
          <div>
            <span className="text-3xl mb-4 block">🏗️</span>
            <h3 className="text-xl font-bold text-text-primary mb-3 italic tracking-tight">Task-First Architecture</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Tudo é uma tarefa. Cada workflow é uma sequência de ações validadas que garantem consistência do primeiro prompt ao deploy final.
            </p>
          </div>
          <div>
            <span className="text-3xl mb-4 block">🧪</span>
            <h3 className="text-xl font-bold text-text-primary mb-3 italic tracking-tight">DNA Injection</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Injetamos o conhecimento de experts (Hormozi, Gordon, Miner) diretamente na memória dos agentes para resultados de alta conversão.
            </p>
          </div>
        </div>
      </section>

      {/* System Components Breakdown */}
      <section className="px-12 py-20 bg-surface-800/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-text-primary mb-2">Estrutura do Sistema</h2>
          <p className="text-text-muted">Como os componentes se conectam para criar o AIOX</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {[
            { 
              title: 'Agents', 
              color: 'coral', 
              icon: '🤖', 
              desc: 'Personas especializadas com expertise técnica e comportamental única.',
              link: '/aiox'
            },
            { 
              title: 'Workflows', 
              color: 'menta', 
              icon: '🔄', 
              desc: 'Pipelines automatizados que guiam o desenvolvimento do zero ao pronto.',
              link: '/workflows'
            },
            { 
              title: 'Heuristics', 
              color: 'gold', 
              icon: '⚡', 
              desc: 'Regras práticas e atalhos mentais que aceleram a tomada de decisão.',
              link: '/constitution'
            },
            { 
              title: 'Mega Brain', 
              color: 'purple-500', 
              icon: '🧠', 
              desc: 'Biblioteca externa de DNA estratégico dos maiores mentores do mundo.',
              link: '/mega-brain'
            },
          ].map((item) => (
            <Link 
              key={item.title} 
              href={item.link}
              className={`group p-8 rounded-3xl bg-surface-900 border border-surface-700 card-hover hover:border-${item.color}/30`}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-4xl">{item.icon}</span>
                <span className="text-text-muted group-hover:text-coral transition-colors">↗</span>
              </div>
              <h4 className="text-xl font-bold text-text-primary mb-3">{item.title}</h4>
              <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to Action - The "Didactic" part */}
      <section className="px-12 py-24 border-t border-surface-600 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black mb-6 tracking-tight italic">PRONTO PARA ORQUESTRAR?</h2>
          <p className="text-text-secondary mb-10 leading-relaxed">
            Navegue pela documentação para entender como chamar cada agente, ativar workflows complexos e extrair o DNA estratégico do Mega Brain.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/constitution" className="text-coral font-bold hover:underline">Ler Constituição →</Link>
            <Link href="/commands" className="text-menta font-bold hover:underline">Ver Comandos →</Link>
          </div>
        </div>
      </section>

      {/* Footer info strip */}
      <footer className="px-12 py-8 border-t border-surface-600 bg-surface-950">
        <div className="flex justify-between items-center text-[10px] text-text-muted uppercase tracking-widest font-mono">
          <span>Synkra AIOX Protocol v4.0.0</span>
          <div className="flex gap-8">
            <span>By Lucas Graziano</span>
            <span>Est. 2026</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
