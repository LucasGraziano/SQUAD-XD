import { Bell, Search } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="h-16 border-b border-neutral-border bg-white flex items-center justify-between px-6">
      <div>
        <h1 className="text-lg font-semibold text-neutral-charcoal leading-none">{title}</h1>
        {subtitle && <p className="text-xs text-neutral-secondary mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg text-neutral-secondary hover:text-neutral-charcoal hover:bg-neutral-mist transition-all duration-fast">
          <Search size={18} strokeWidth={1.5} />
        </button>
        <button className="relative p-2 rounded-lg text-neutral-secondary hover:text-neutral-charcoal hover:bg-neutral-mist transition-all duration-fast">
          <Bell size={18} strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-semantic-danger rounded-full" />
        </button>
      </div>
    </header>
  )
}
