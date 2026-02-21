import { View, Text, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'

export default function Welcome() {
  return (
    <View className="flex-1 bg-bg items-center justify-center px-6">
      <Text className="text-text text-4xl font-bold mb-2">GymRat</Text>
      <Text className="text-text-muted text-lg mb-12">Train harder. Track smarter.</Text>

      <TouchableOpacity
        className="w-full bg-primary rounded-xl py-4 items-center mb-4"
        onPress={() => router.push('/(auth)/login')}
      >
        <Text className="text-white font-semibold text-base">Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full border border-primary rounded-xl py-4 items-center"
        onPress={() => router.push('/(auth)/signup')}
      >
        <Text className="text-primary font-semibold text-base">Create Account</Text>
      </TouchableOpacity>
    </View>
  )
}
