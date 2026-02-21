import { useState, useEffect, useCallback } from 'react'
import { getUserPlan, assignPlan, resetPlan } from '@/services/training/trainingService'
import { useAuth } from '@/providers/AuthProvider'
import type { UserPlan, PlanAssignmentInput } from '@/types/training'

type UseTrainingPlanResult = {
  plan: UserPlan | null
  loading: boolean
  assigning: boolean
  error: string | null
  assign: (input: PlanAssignmentInput) => Promise<void>
  reset: () => Promise<void>
}

export function useTrainingPlan(): UseTrainingPlanResult {
  const { session } = useAuth()
  const [plan, setPlan] = useState<UserPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const userId = session?.user.id

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    const data = await getUserPlan(userId)
    setPlan(data)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    load()
  }, [load])

  const assign = useCallback(
    async (input: PlanAssignmentInput) => {
      if (!userId) return
      setAssigning(true)
      setError(null)
      const result = await assignPlan(userId, input)
      if (!result) {
        setError('Could not assign plan. Please try again.')
      } else {
        setPlan(result)
      }
      setAssigning(false)
    },
    [userId],
  )

  const reset = useCallback(async () => {
    if (!userId) return
    await resetPlan(userId)
    setPlan(null)
  }, [userId])

  return { plan, loading, assigning, error, assign, reset }
}
