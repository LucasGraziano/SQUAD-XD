export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2).replace('.', ',')}%`
}

export function parseBRL(value: string): number {
  return parseFloat(value.replace(/\./g, '').replace(',', '.').replace(/[^0-9.]/g, ''))
}
