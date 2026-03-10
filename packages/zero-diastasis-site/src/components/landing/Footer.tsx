import { SUPPORT_EMAIL } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="px-5 py-10 md:py-14 bg-warm border-t border-nude-dark/20" role="contentinfo">
      <div className="content-width text-center space-y-5">
        {/* Logo */}
        <p className="font-serif text-h3 font-bold text-text">
          Zero Diastasis&trade;
        </p>

        <p className="text-small text-text-light max-w-sm mx-auto">
          Protocolo de bienestar abdominal postparto
        </p>

        {/* Disclaimer */}
        <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
          Los resultados varían según cada persona. Este es un programa de
          bienestar, no un tratamiento médico. Consulta a un profesional de
          salud antes de comenzar cualquier programa de ejercicios.
        </p>

        {/* Links */}
        <nav aria-label="Enlaces legales" className="flex items-center justify-center gap-4 text-small text-text-muted">
          <a href="/privacidad" className="hover:text-blush-strong transition-colors underline-offset-2 hover:underline">
            Privacidad
          </a>
          <span className="text-nude-dark" aria-hidden="true">|</span>
          <a href="/terminos" className="hover:text-blush-strong transition-colors underline-offset-2 hover:underline">
            Términos
          </a>
          <span className="text-nude-dark" aria-hidden="true">|</span>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-blush-strong transition-colors underline-offset-2 hover:underline">
            Contacto
          </a>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-text-muted">
          &copy; {new Date().getFullYear()} Zero Diastasis&trade; — Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
