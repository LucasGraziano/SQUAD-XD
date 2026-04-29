export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-off-white flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient flex-col justify-between p-12">
        <div>
          <span className="text-white font-serif text-2xl tracking-tight">Vínculo</span>
        </div>

        <div className="text-white">
          <blockquote className="font-serif text-display-md leading-snug mb-6">
            "Você cuida das pessoas.<br />
            A gente cuida de você."
          </blockquote>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            Prontuário inteligente, agenda automatizada e alertas de risco de abandono
            para psicólogos clínicos que querem focar no que importa: seus pacientes.
          </p>
        </div>

        <div className="flex gap-6 text-white/50 text-xs">
          <span>LGPD Compliant</span>
          <span>·</span>
          <span>CFP Res. 001/2009</span>
          <span>·</span>
          <span>AES-256 Encryption</span>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <span className="font-serif text-2xl text-brand-teal">Vínculo</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
