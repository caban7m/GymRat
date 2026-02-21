import { View, Text } from 'react-native'
import { useEntitlement } from '@/providers/EntitlementProvider'
import { LockedScreen } from '@/components/LockedScreen'

export default function Training() {
  const { isActive } = useEntitlement()

  if (!isActive) {
    return (
      <LockedScreen
        feature="Training"
        description="Access unlimited workout plans, log your sets and reps, and track your strength progress over time."
      />
    )
  }

  return (
    <View className="flex-1 bg-bg items-center justify-center">
      <Text className="text-text text-2xl font-bold">Training</Text>
      <Text className="text-text-muted mt-2">Workout tracking coming soon</Text>
    </View>
  )
}
