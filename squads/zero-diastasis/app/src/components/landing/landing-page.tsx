import Link from 'next/link';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-secondary-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-heading font-bold text-xl text-primary">Zero Diastasis™</span>
          <Link
            href="/auth/login"
            className="px-5 py-2 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-500 transition-all duration-200 active:scale-95"
          >
            Acceder
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-primary-100">
              ✨ Protocolo de recuperación abdominal
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-foreground leading-tight mb-6">
              Recupera tu centro
              <span className="block text-primary">en 28 días</span>
            </h1>
            <p className="text-lg text-foreground/60 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              El protocolo de audio guiado que miles de mamás usaron para cerrar su diástasis abdominal — desde casa, sin equipos, en 10 minutos al día.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/auth/login"
                className="px-8 py-4 rounded-2xl bg-primary text-white font-heading font-bold text-lg hover:bg-primary-500 transition-all duration-200 active:scale-95 shadow-lg shadow-primary/25"
              >
                Comenzar ahora →
              </Link>
              <Link
                href="/auth/register"
                className="px-8 py-4 rounded-2xl bg-secondary text-foreground font-heading font-bold text-lg hover:bg-secondary-300 transition-all duration-200"
              >
                Crear cuenta gratis
              </Link>
            </div>
            <p className="text-sm text-foreground/40 mt-4">
              ✓ Acceso inmediato &nbsp;·&nbsp; ✓ Sin suscripción &nbsp;·&nbsp; ✓ Garantía 7 días
            </p>
          </div>

          {/* Visual card */}
          <div className="flex-1 max-w-sm w-full animate-scale-in">
            <div className="bg-white rounded-3xl shadow-2xl shadow-primary/10 border border-secondary-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-2xl">🫀</div>
                <div>
                  <div className="font-heading font-bold text-foreground">Protocolo completo</div>
                  <div className="text-sm text-foreground/50">28 días · 3 módulos</div>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {[
                  { emoji: '🎧', text: 'Audio guiado diario (8-12 min)', done: true },
                  { emoji: '📊', text: 'Tracker de medidas y progreso', done: true },
                  { emoji: '🎁', text: 'Bonuses desbloqueables', done: true },
                  { emoji: '🛒', text: 'Tienda de productos complementarios', done: true },
                  { emoji: '📅', text: 'Planner semanal integrado', done: true },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 text-sm">
                    <span className="text-base">{item.emoji}</span>
                    <span className="text-foreground/70 flex-1">{item.text}</span>
                    <span className="text-green-500 font-bold text-xs">✓</span>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-4 text-center border border-primary-100">
                <div className="text-2xl font-heading font-black text-primary">$19.90</div>
                <div className="text-xs text-foreground/50">pago único · acceso de por vida</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-16 px-6 bg-secondary-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-12">
            {[
              { num: '2.400+', label: 'mamás transformadas' },
              { num: '28', label: 'días de protocolo' },
              { num: '97%', label: 'satisfacción' },
              { num: '4.9★', label: 'valoración media' },
            ].map((stat) => (
              <div key={stat.label} className="animate-slide-up">
                <div className="text-3xl font-heading font-black text-primary mb-1">{stat.num}</div>
                <div className="text-sm text-foreground/50">{stat.label}</div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl md:text-3xl font-heading font-bold text-center text-foreground mb-8">
            Lo que dicen nuestras mamás
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'María C.', country: '🇲🇽', days: 28,
                text: '"Después de 3 años con diástasis sin poder hacer nada, en 28 días sentí mi abdomen por primera vez. Los audios son increíbles."',
              },
              {
                name: 'Valentina R.', country: '🇨🇴', days: 21,
                text: '"Lo que más me gustó es que son solo 10 minutos. Fácil de integrar con los bebés. Vi resultados desde la segunda semana."',
              },
              {
                name: 'Carla M.', country: '🇦🇷', days: 28,
                text: '"Probé mil cosas antes. Este protocolo es diferente — científico, progresivo, y se nota en el cuerpo. Totalmente recomendado."',
              },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-secondary-100 shadow-sm">
                <div className="flex items-center gap-1 mb-3">
                  {'★★★★★'.split('').map((s, i) => (
                    <span key={i} className="text-yellow-400 text-sm">{s}</span>
                  ))}
                </div>
                <p className="text-sm text-foreground/70 italic mb-4 leading-relaxed">{t.text}</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.name} {t.country}</div>
                    <div className="text-xs text-foreground/40">Completó {t.days} días</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-center text-foreground mb-3">
          El protocolo en 3 módulos
        </h2>
        <p className="text-center text-foreground/50 mb-10 text-sm">Progresión científica semana a semana</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { num: '01', title: 'Reposicionamiento', days: 'Días 1-7', desc: 'Activación del transverso abdominal en posición acostada. Reconexión mente-músculo.', emoji: '🛏️', duration: '8 min' },
            { num: '02', title: 'Compresión', days: 'Días 8-14', desc: 'Progresión de pie + técnicas de compresión intra-abdominal. Mayor desafío postural.', emoji: '🧍', duration: '10 min' },
            { num: '03', title: 'Anclaje', days: 'Días 15-28', desc: 'Movimientos funcionales + integración postural completa. El cuerpo nuevo.', emoji: '💪', duration: '12 min' },
          ].map((mod) => (
            <div key={mod.num} className="bg-white rounded-3xl border border-secondary-100 p-6 hover:border-primary-200 hover:shadow-md transition-all duration-300">
              <div className="text-4xl mb-4">{mod.emoji}</div>
              <div className="text-xs font-semibold text-primary/60 mb-1">MÓDULO {mod.num} · {mod.days}</div>
              <h3 className="font-heading font-bold text-xl text-foreground mb-2">{mod.title}</h3>
              <p className="text-sm text-foreground/60 mb-4 leading-relaxed">{mod.desc}</p>
              <div className="inline-flex items-center gap-1.5 bg-primary-50 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                🎧 {mod.duration} / día
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary-50 via-background to-secondary-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-black text-foreground mb-4">
            Tu cuerpo puede recuperarse.<br />
            <span className="text-primary">Empieza hoy.</span>
          </h2>
          <p className="text-foreground/60 mb-8">
            Miles de mamás ya lo hicieron. Tú eres la siguiente.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-primary text-white font-heading font-bold text-xl hover:bg-primary-500 transition-all duration-200 active:scale-95 shadow-xl shadow-primary/30"
          >
            Comenzar mi protocolo →
          </Link>
          <p className="text-sm text-foreground/40 mt-4">
            Acceso inmediato · Pago único · Sin mensualidades
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-secondary-100 text-center text-sm text-foreground/30">
        © 2026 Zero Diastasis™ · Todos los derechos reservados
        <span className="mx-2">·</span>
        <Link href="/auth/login" className="hover:text-foreground/60 transition-colors">Acceder</Link>
      </footer>
    </div>
  );
}
