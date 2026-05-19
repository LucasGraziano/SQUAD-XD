import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function CotacaoDetailRedirect({ params }: Props) {
  const { id } = await params
  redirect(`/deals/${id}`)
}
