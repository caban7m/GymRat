import { View, Text } from 'react-native'
import { useEntitlement } from '@/providers/EntitlementProvider'
import { LockedScreen } from '@/components/LockedScreen'

export default function Community() {
  const { isActive } = useEntitlement()

  if (!isActive) {
    return (
      <LockedScreen
        feature="Community"
        description="Join challenges, climb leaderboards, and share your progress with a community of serious lifters."
      />
    )
  }

  return (
    <View className="flex-1 bg-bg items-center justify-center">
      <Text className="text-text text-2xl font-bold">Community</Text>
      <Text className="text-text-muted mt-2">Social features coming soon</Text>
    </View>
  )
}
