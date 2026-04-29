import { z } from 'zod'

// CRP: formato XX/XXXXXX ou XX/XXXXXXX (6-7 dígitos)
const crpRegex = /^\d{2}\/\d{6,7}$/

export const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(3, 'Nome precisa ter pelo menos 3 caracteres')
      .max(120, 'Nome muito longo'),
    crp: z
      .string()
      .regex(crpRegex, 'CRP inválido. Use o formato XX/XXXXXX (ex: 06/123456)'),
    email: z.string().email('E-mail inválido'),
    city: z.string().min(2, 'Informe sua cidade').max(80),
    specialization: z.string().optional(),
    password: z
      .string()
      .min(8, 'Senha precisa ter pelo menos 8 caracteres')
      .max(72, 'Senha muito longa'),
    confirmPassword: z.string(),
    termsAccepted: z
      .boolean()
      .refine((v) => v === true, 'Você deve aceitar os Termos de Uso e a Política de Privacidade'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Informe a senha'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
})

export const onboardingStep1Schema = z.object({
  days: z.array(z.number().min(0).max(6)).min(1, 'Selecione pelo menos um dia'),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, 'Horário inválido'),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, 'Horário inválido'),
})

export const onboardingStep2Schema = z.object({
  session_price_cents: z.number().min(1000, 'Valor mínimo: R$ 10,00'),
  billing_cycle: z.enum(['per_session', 'weekly', 'monthly']),
  session_duration_minutes: z.number().min(20).max(180),
})
