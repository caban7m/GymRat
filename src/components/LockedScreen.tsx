import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

type Props = {
  feature: string
  description?: string
}

export function LockedScreen({ feature, description }: Props) {
  return (
    <View className="flex-1 bg-bg items-center justify-center px-8">
      <View className="bg-surface rounded-2xl p-8 items-center border border-border w-full">
        <View className="bg-primary/10 rounded-full p-4 mb-4">
          <Ionicons name="lock-closed" size={32} color="#f97316" />
        </View>

        <Text className="text-text text-xl font-bold mb-2 text-center">
          {feature} is Pro
        </Text>

        <Text className="text-text-muted text-sm text-center mb-6 leading-5">
          {description ?? `Unlock ${feature} and everything else with GymRat Pro.`}
        </Text>

        <TouchableOpacity
          className="w-full bg-primary rounded-xl py-3 items-center"
          onPress={() => router.push('/(app)/paywall')}
        >
          <Text className="text-white font-bold text-base">Upgrade to Pro</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
