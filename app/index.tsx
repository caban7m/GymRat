import { useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '@/providers/AuthProvider'
import { colors } from '@/theme/colors'

export default function Index() {
  const { session, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    if (session) {
      router.replace('/(app)/(tabs)/home')
    } else {
      router.replace('/(auth)/welcome')
    }
  }, [session, loading])

  return (
    <View className="flex-1 bg-bg items-center justify-center">
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  )
}
