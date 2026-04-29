import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { getAuthUser, getPsychologistId } from '@/lib/supabase/server-queries'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/sidebar'
import { WelcomeModal } from '@/components/ui/welcome-modal'
import { DashboardSkeleton } from '@/components/ui/skeleton'
import { getSubscriptionStatus } from '@/lib/subscription'

// Routes exempt from subscription gating
const SUB_EXEMPT = ['/planos', '/onboarding', '/configuracoes']

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // getAuthUser is React.cache() — deduplicated if page also calls it
  const user = await getAuthUser()
  if (!user) redirect('/login')

  // Subscription gate — redirect expired users to /planos (except exempt routes)
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''
  const isExempt = SUB_EXEMPT.some(p => pathname.startsWith(p))

  // Ensure psychologist record exists — redirect to onboarding if missing
  const psyId = await getPsychologistId()
  if (!psyId && !pathname.startsWith('/onboarding')) {
    redirect('/onboarding')
  }

  if (!isExempt && psyId) {
    const supabase = await createClient()
    const subStatus = await getSubscriptionStatus(supabase, psyId)
    if (!subStatus.active) redirect('/planos')
  }

  return (
    <div className="flex min-h-screen bg-neutral-off-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Suspense fallback={<DashboardSkeleton />}>
          {children}
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <WelcomeModal />
      </Suspense>
    </div>
  )
}
