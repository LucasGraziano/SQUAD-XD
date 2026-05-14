export function getCrossSellSuggestionByAge(age: number): string {
  if (age >= 18 && age <= 25) return 'Seguro Auto'
  if (age > 25 && age <= 40) return 'Seguro de Vida'
  if (age > 40 && age <= 60) return 'Seguro Saúde'
  if (age > 60) return 'Seguro de Vida Vitalício'
  return 'uma proposta personalizada'
}

export function getAgeFromBirthDate(birthDate: string): number {
  const birth = new Date(birthDate + 'T00:00:00')
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export function buildBirthdayWhatsAppMessage(clientName: string, suggestion: string): string {
  return `Olá ${clientName}, feliz aniversário! 🎉 Aproveite a data especial para conhecer ${suggestion}. Posso apresentar uma proposta personalizada para você?`
}
