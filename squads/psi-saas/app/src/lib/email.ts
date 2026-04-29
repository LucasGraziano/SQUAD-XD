import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? 'noreply@vinculo.app'

export async function sendWelcomeEmail(to: string, name: string) {
  if (!process.env.RESEND_API_KEY) return

  await resend.emails.send({
    from: `Vínculo <${FROM}>`,
    to,
    subject: 'Bem-vindo ao Vínculo — seu trial de 14 dias começa agora',
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 24px; color: #1a1a2e;">
        <p style="font-size: 24px; font-weight: bold; color: #1a6b6b; margin-bottom: 8px;">Vínculo</p>
        <h1 style="font-size: 20px; font-weight: 600; margin-bottom: 16px;">Olá, ${name}. Seu trial começa agora.</h1>
        <p style="font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 16px;">
          Você tem 14 dias para explorar tudo o que o Vínculo oferece — sem cartão, sem compromisso.
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 24px;">
          Comece cadastrando seu primeiro paciente e agendando uma sessão. Em menos de 5 minutos
          você terá seu prontuário criptografado configurado.
        </p>
        <a
          href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://vinculo.app'}/dashboard"
          style="display: inline-block; background-color: #1a6b6b; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;"
        >
          Acessar minha conta
        </a>
        <p style="font-size: 12px; color: #9ca3af; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          Você recebeu este e-mail porque criou uma conta no Vínculo.<br />
          Dúvidas? Responda este e-mail ou acesse <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://vinculo.app'}" style="color: #1a6b6b;">vinculo.app</a>.
        </p>
      </div>
    `,
  })
}

export async function sendTrialExpiringEmail(to: string, name: string, daysLeft: number) {
  if (!process.env.RESEND_API_KEY) return

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://vinculo.app'

  await resend.emails.send({
    from: `Vínculo <${FROM}>`,
    to,
    subject: `Seu trial expira em ${daysLeft} dia${daysLeft === 1 ? '' : 's'} — escolha seu plano`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 24px; color: #1a1a2e;">
        <p style="font-size: 24px; font-weight: bold; color: #1a6b6b; margin-bottom: 8px;">Vínculo</p>
        <div style="background: #fffbeb; border-left: 3px solid #d97706; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
          <p style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #d97706; margin: 0 0 4px;">Aviso importante</p>
          <h1 style="font-size: 18px; font-weight: 600; margin: 0; color: #1a1a2e;">Seu trial expira em ${daysLeft} dia${daysLeft === 1 ? '' : 's'}</h1>
        </div>
        <p style="font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 16px;">
          Olá, ${name}. Seu período de teste gratuito no Vínculo encerra em breve.
          Para continuar acessando prontuários, agenda e alertas de abandono, escolha um plano.
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 24px;">
          <strong>Planos a partir de R$79/mês.</strong> Cancele quando quiser, sem multa.
        </p>
        <a
          href="${appUrl}/planos"
          style="display: inline-block; background-color: #1a6b6b; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;"
        >
          Ver planos agora
        </a>
        <p style="font-size: 12px; color: #9ca3af; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          Após o vencimento, seus dados ficam disponíveis por mais 30 dias para exportação.
        </p>
      </div>
    `,
  })
}

export async function sendAbandonmentAlertEmail(
  to: string,
  psychologistName: string,
  patientName: string,
  score: number,
  patientId: string,
) {
  if (!process.env.RESEND_API_KEY) return

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://vinculo.app'

  await resend.emails.send({
    from: `Vínculo <${FROM}>`,
    to,
    subject: `Alerta: ${patientName} tem risco elevado de abandono`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 24px; color: #1a1a2e;">
        <p style="font-size: 24px; font-weight: bold; color: #1a6b6b; margin-bottom: 8px;">Vínculo</p>
        <div style="background: #fff5f5; border-left: 3px solid #e53e3e; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
          <p style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #e53e3e; margin: 0 0 4px;">Alerta de risco</p>
          <h1 style="font-size: 18px; font-weight: 600; margin: 0; color: #1a1a2e;">${patientName}</h1>
        </div>
        <p style="font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 16px;">
          Olá, ${psychologistName}. O Vínculo detectou sinais de risco de abandono para <strong>${patientName}</strong>.
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 24px;">
          Score de risco atual: <strong style="color: #e53e3e;">${score}/100</strong>.
          Confira o prontuário e considere entrar em contato antes da próxima sessão.
        </p>
        <a
          href="${appUrl}/pacientes/${patientId}"
          style="display: inline-block; background-color: #1a6b6b; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;"
        >
          Ver prontuário do paciente
        </a>
        <p style="font-size: 12px; color: #9ca3af; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          Os alertas são baseados em padrões comportamentais e não constituem diagnóstico clínico.<br />
          Para desativar notificações por e-mail, acesse <a href="${appUrl}/configuracoes" style="color: #1a6b6b;">Configurações</a>.
        </p>
      </div>
    `,
  })
}
