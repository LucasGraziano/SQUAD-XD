import { notFound } from 'next/navigation'
import { getDeal } from '@/app/actions/deals'
import { DealWorkspace } from '@/components/deals/DealWorkspace'

interface Props {
  params: Promise<{ id: string }>
}

export default async function DealPage({ params }: Props) {
  const { id } = await params
  const deal = await getDeal(id)
  if (!deal) notFound()
  return <DealWorkspace initialDeal={deal} />
}
