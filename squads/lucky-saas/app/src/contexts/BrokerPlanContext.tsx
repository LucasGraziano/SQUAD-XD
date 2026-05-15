'use client'

import { createContext, useContext } from 'react'

const BrokerPlanContext = createContext<string>('starter')

export function BrokerPlanProvider({
  plan,
  children,
}: {
  plan: string
  children: React.ReactNode
}) {
  return (
    <BrokerPlanContext.Provider value={plan}>
      {children}
    </BrokerPlanContext.Provider>
  )
}

export function useBrokerPlan(): string {
  return useContext(BrokerPlanContext)
}
