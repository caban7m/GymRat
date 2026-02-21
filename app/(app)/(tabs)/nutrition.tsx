import { View, Text } from 'react-native'
import { useEntitlement } from '@/providers/EntitlementProvider'
import { LockedScreen } from '@/components/LockedScreen'

export default function Nutrition() {
  const { isActive } = useEntitlement()

  if (!isActive) {
    return (
      <LockedScreen
        feature="Nutrition"
        description="Log meals, track macros, and hit your calorie targets with our full nutrition database."
      />
    )
  }

  return (
    <View className="flex-1 bg-bg items-center justify-center">
      <Text className="text-text text-2xl font-bold">Nutrition</Text>
      <Text className="text-text-muted mt-2">Meal tracking coming soon</Text>
    </View>
  )
}
