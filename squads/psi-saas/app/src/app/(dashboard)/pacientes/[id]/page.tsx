import { createClient } from '@/lib/supabase/server'
import { getPsychologist } from '@/lib/supabase/server-queries'
import { Header } from '@/components/layout/header'
import { PatientProfileClient } from './patient-profile-client'
import { notFound } from 'next/navigation'

interface Props { params: Promise<{ id: string }> }

export default async function PatientProfilePage({ params }: Props) {
  const { id } = await params
  const psy = await getPsychologist()
  const supabase = await createClient()

  if (!psy) return notFound()

  const [
    { data: patient },
    { count: sessionCount },
    { data: nextSession },
    { count: pendingPayments },
  ] = await Promise.all([
    supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .eq('psychologist_id', psy.id)
      .single(),

    supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('patient_id', id)
      .eq('status', 'completed'),

    supabase
      .from('sessions')
      .select('id, scheduled_at, status')
      .eq('patient_id', id)
      .in('status', ['scheduled', 'confirmed'])
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(1),

    supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('patient_id', id)
      .eq('status', 'pending'),
  ])

  if (!patient) return notFound()

  return (
    <>
      <Header
        title={patient.full_name}
        subtitle="Perfil do paciente"
      />
      <PatientProfileClient
        patient={patient}
        psyDefaults={{
          session_price_cents: psy.session_price_cents,
          billing_cycle: psy.billing_cycle,
        }}
        stats={{
          completedSessions: sessionCount ?? 0,
          nextSession: nextSession?.[0] ?? null,
          pendingPayments: pendingPayments ?? 0,
        }}
      />
    </>
  )
}
