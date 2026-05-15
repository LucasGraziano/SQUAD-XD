export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

export function daysUntil(date: string | Date): number {
  const target = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function daysSince(date: string | Date): number {
  return -daysUntil(date)
}

export function isExpiringSoon(endDate: string | Date, days = 30): boolean {
  const d = daysUntil(endDate)
  return d >= 0 && d <= days
}

export function isOverdue(endDate: string | Date): boolean {
  return daysUntil(endDate) < 0
}

export function formatRelative(date: string | Date): string {
  const days = daysSince(date)
  if (days === 0) return 'hoje'
  if (days === 1) return 'ontem'
  if (days < 7) return `há ${days} dias`
  if (days < 30) return `há ${Math.floor(days / 7)} semana${Math.floor(days / 7) > 1 ? 's' : ''}`
  return formatDate(date)
}
