import { createClient } from '@/lib/supabase/server'
import { PipelineBoard } from '@/components/pipeline/PipelineBoard'
import type { Lead } from '@/types/lead'

export default async function PipelinePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  let leads: Lead[] = []

  if (user) {
    const brokerResult = await supabase
      .from('brokers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    const broker = brokerResult.data as { id: string } | null
    if (broker) {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .eq('broker_id', broker.id)
        .order('created_at', { ascending: false })

      leads = (data as Lead[]) ?? []
    }
  }

  return <PipelineBoard initialLeads={leads} />
}
