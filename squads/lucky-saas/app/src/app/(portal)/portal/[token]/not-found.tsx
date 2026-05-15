export default function PortalNotFound() {
  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center px-4">
      <div className="text-center max-w-[360px]">
        <div className="w-14 h-14 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h1 className="text-[20px] font-bold text-[#0D0D0D] mb-2">Link inválido ou expirado</h1>
        <p className="text-[14px] text-[#6B7280] leading-relaxed">
          Este link de acesso ao portal não é mais válido. Entre em contato com seu corretor para solicitar um novo link.
        </p>
      </div>
    </div>
  )
}
