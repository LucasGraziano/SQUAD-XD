import { getDeals } from '@/app/actions/deals'
import { PipelineBoard } from '@/components/pipeline/PipelineBoard'
import { PIPELINE_STAGES } from '@/lib/constants/deal-stages'

export default async function PipelinePage() {
  const deals = await getDeals({ stages: PIPELINE_STAGES })

  return <PipelineBoard initialDeals={deals} />
}
