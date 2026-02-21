import { View, ActivityIndicator } from 'react-native'
import { useEntitlement } from '@/providers/EntitlementProvider'
import { LockedScreen } from '@/components/LockedScreen'
import { PlanWizard } from '@/components/training/PlanWizard'
import { PlanViewer } from '@/components/training/PlanViewer'
import { useTrainingPlan } from '@/hooks/useTrainingPlan'
import { colors } from '@/theme/colors'

export default function Training() {
  const { isActive } = useEntitlement()
  const { plan, loading, assigning, error, assign, reset } = useTrainingPlan()

  if (!isActive) {
    return (
      <LockedScreen
        feature="Training"
        description="Access unlimited workout plans, log your sets and reps, and track your strength progress over time."
      />
    )
  }

  if (loading) {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (!plan) {
    return (
      <PlanWizard
        onAssign={assign}
        assigning={assigning}
        error={error}
      />
    )
  }

  return (
    <PlanViewer
      plan={plan}
      onChangePlan={reset}
    />
  )
}
