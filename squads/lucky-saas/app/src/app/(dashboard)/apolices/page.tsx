'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { ApolicesTable } from '@/components/apolices/ApolicesTable'
import { ImportPoliciesModal } from '@/components/apolices/ImportPoliciesModal'
import { ApolicaModal } from '@/components/apolices/ApolicaModal'
import { fetchPolicies } from './actions'
import type { Policy } from '@/types/policy'
import { EmptyState } from '@/components/ui/EmptyState'

function ApolicesPageInner() {
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') ?? 'todas'
  const search = searchParams.get('search') ?? ''
  const ramo = searchParams.get('ramo') ?? ''
  const page = parseInt(searchParams.get('page') ?? '1', 10)
  const sortBy = searchParams.get('sort') ?? 'end_date'
  const sortDir = (searchParams.get('dir') ?? 'asc') as 'asc' | 'desc'

  const [policies, setPolicies] = useState<Policy[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [csvOpen, setCsvOpen] = useState(false)
  const [newModalOpen, setNewModalOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchPolicies({ tab, search, ramo, page, sortBy, sortDir })
      .then(({ data, count: c }) => {
        setPolicies(data)
        setCount(c)
      })
      .catch(() => {
        setPolicies([])
        setCount(0)
      })
      .finally(() => setLoading(false))
  }, [tab, search, ramo, page, sortBy, sortDir])

  function reloadPolicies() {
    setLoading(true)
    fetchPolicies({ tab, search, ramo, page, sortBy, sortDir })
      .then(({ data, count: c }) => { setPolicies(data); setCount(c) })
      .catch(() => { setPolicies([]); setCount(0) })
      .finally(() => setLoading(false))
  }

  return (
    <>
      <PageHeader
        title="Apólices"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setCsvOpen(true)}>Importar Apólices</Button>
            <Button size="sm" onClick={() => setNewModalOpen(true)}>Nova Apólice</Button>
          </div>
        }
      />
      <ImportPoliciesModal open={csvOpen} onOpenChange={setCsvOpen} onDone={reloadPolicies} />
      <ApolicaModal
        open={newModalOpen}
        onOpenChange={setNewModalOpen}
        onCreated={(p) => { setPolicies(prev => [p, ...prev]); setCount(c => c + 1) }}
      />
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[13px] text-[#9CA3AF]">Carregando...</p>
        </div>
      ) : count === 0 && !search && !ramo ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            illustration="apolices"
            title="Nenhuma apólice cadastrada"
            description="Importe suas apólices em massa ou cadastre a primeira manualmente."
            primaryCta={{ label: 'Importar Apólices', onClick: () => setCsvOpen(true) }}
            secondaryCta={{ label: 'Nova apólice', onClick: () => setNewModalOpen(true) }}
          />
        </div>
      ) : (
        <ApolicesTable
          initialPolicies={policies}
          totalCount={count}
          currentPage={page}
          brokerName="Corretor"
          sortBy={sortBy}
          sortDir={sortDir}
        />
      )}
    </>
  )
}

export default function ApolicesPage() {
  return (
    <Suspense fallback={
      <>
        <PageHeader title="Apólices" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[13px] text-[#9CA3AF]">Carregando...</p>
        </div>
      </>
    }>
      <ApolicesPageInner />
    </Suspense>
  )
}
