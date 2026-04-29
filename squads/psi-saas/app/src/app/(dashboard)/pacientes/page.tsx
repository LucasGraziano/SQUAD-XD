import { createClient } from '@/lib/supabase/server'
import { getPsychologistId } from '@/lib/supabase/server-queries'
import { Header } from '@/components/layout/header'
import { PatientsClient } from './patients-client'

export default async function PatientsPage() {
  const psyId = await getPsychologistId()
  const supabase = await createClient()

  const { data: patients } = await supabase
    .from('patients')
    .select('*')
    .eq('psychologist_id', psyId ?? '')
    .order('full_name', { ascending: true })

  return (
    <>
      <Header title="Pacientes" subtitle={`${patients?.length ?? 0} pacientes cadastrados`} />
      <PatientsClient patients={patients ?? []} />
    </>
  )
}
