import { getPsychologist } from '@/lib/supabase/server-queries'
import { Header } from '@/components/layout/header'
import { ConfiguracoesClient } from './configuracoes-client'

export default async function ConfiguracoesPage() {
  const psy = await getPsychologist()

  return (
    <>
      <Header title="Configurações" subtitle="Seu perfil e preferências da conta" />
      <ConfiguracoesClient psy={psy} />
    </>
  )
}
