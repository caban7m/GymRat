import { View, ActivityIndicator } from 'react-native'
import { Stack, Redirect } from 'expo-router'
import { useAuth } from '@/providers/AuthProvider'
import { colors } from '@/theme/colors'

export default function AppLayout() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (!session) {
    return <Redirect href="/(auth)/welcome" />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="paywall" />
    </Stack>
  )
}
