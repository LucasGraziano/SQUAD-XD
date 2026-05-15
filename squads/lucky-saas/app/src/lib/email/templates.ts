export function buildBirthdayEmailHtml(params: {
  clientName: string
  age: number
  brokerName: string
  brokerPhone?: string
  suggestion: string
}) {
  const { clientName, age, brokerName, brokerPhone, suggestion } = params
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family: -apple-system, sans-serif; background: #F8F8F8; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; border: 1px solid #E5E5E5;">
    <div style="background: #0D0D0D; padding: 24px 32px;">
      <p style="color: #0BD904; font-size: 18px; font-weight: 700; margin: 0;">Premia</p>
    </div>
    <div style="padding: 32px;">
      <p style="font-size: 22px; text-align: center; margin: 0 0 16px 0;">🎂</p>
      <p style="font-size: 16px; font-weight: 600; color: #0D0D0D; margin: 0 0 12px 0;">Parabéns, ${clientName}!</p>
      <p style="font-size: 14px; color: #6B7280; margin: 0 0 20px 0;">
        Hoje você completa ${age} anos. Em nome de toda a equipe, desejamos a você um dia maravilhoso cheio de alegria e saúde!
      </p>
      <div style="background: #F9FFF9; border: 1px solid #0BD904; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0; font-size: 13px; color: #0D0D0D;">
          💡 <strong>Dica do seu corretor:</strong> ${suggestion}
        </p>
      </div>
      <p style="font-size: 14px; color: #6B7280; margin: 0 0 20px 0;">
        Caso queira conversar sobre sua proteção ou atualizar sua apólice, estou à disposição!
      </p>
      <p style="font-size: 14px; color: #0D0D0D; margin: 0 0 4px 0;">Com carinho,</p>
      <p style="font-size: 14px; font-weight: 600; color: #0D0D0D; margin: 0;">${brokerName}</p>
      ${brokerPhone ? `<p style="font-size: 13px; color: #6B7280; margin: 4px 0 0 0;">${brokerPhone}</p>` : ''}
    </div>
    <div style="padding: 16px 32px; border-top: 1px solid #E5E5E5; background: #FAFAFA;">
      <p style="font-size: 11px; color: #9CA3AF; margin: 0; text-align: center;">
        Enviado com ❤️ via Premia — Sistema de Gestão para Corretores
      </p>
    </div>
  </div>
</body>
</html>`
}

export function buildRenewalEmailHtml(params: {
  clientName: string
  seguradora: string
  ramo: string
  endDate: string
  brokerName: string
  customText: string | null
  daysBeforeExpiry: number
  optOutToken: string
}) {
  const { clientName, seguradora, ramo, endDate, brokerName, customText, daysBeforeExpiry, optOutToken } = params
  const formatted = new Intl.DateTimeFormat('pt-BR').format(new Date(endDate + 'T12:00:00'))

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family: -apple-system, sans-serif; background: #F8F8F8; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; border: 1px solid #E5E5E5;">
    <div style="background: #0D0D0D; padding: 24px 32px;">
      <p style="color: #0BD904; font-size: 18px; font-weight: 700; margin: 0;">Premia</p>
    </div>
    <div style="padding: 32px;">
      <p style="font-size: 16px; font-weight: 600; color: #0D0D0D; margin: 0 0 8px 0;">Olá, ${clientName}!</p>
      ${customText ? `<p style="font-size: 14px; color: #6B7280; margin: 0 0 20px 0;">${customText}</p>` : ''}
      <p style="font-size: 14px; color: #6B7280; margin: 0 0 20px 0;">
        Seu seguro <strong>${seguradora} — ${ramo}</strong> vence em <strong>${daysBeforeExpiry} dias</strong> (${formatted}).
        Entre em contato comigo para renovarmos e manter sua proteção em dia.
      </p>
      <div style="background: #F9FFF9; border: 1px solid #0BD904; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0; font-size: 13px; color: #0D0D0D;">
          <strong>Seguradora:</strong> ${seguradora}<br>
          <strong>Tipo:</strong> ${ramo}<br>
          <strong>Vencimento:</strong> ${formatted}
        </p>
      </div>
      <p style="font-size: 14px; color: #0D0D0D; margin: 0 0 4px 0;">Atenciosamente,</p>
      <p style="font-size: 14px; font-weight: 600; color: #0D0D0D; margin: 0;">${brokerName}</p>
    </div>
    <div style="padding: 16px 32px; border-top: 1px solid #E5E5E5; background: #FAFAFA;">
      <p style="font-size: 11px; color: #9CA3AF; margin: 0; text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://premia.app'}/api/email/optout?token=${optOutToken}"
           style="color: #9CA3AF;">Não quero mais receber e-mails</a>
      </p>
    </div>
  </div>
</body>
</html>`
}
