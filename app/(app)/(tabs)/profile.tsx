import { useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { supabase } from '@/services/supabase/client'
import { useAuth } from '@/providers/AuthProvider'
import { colors } from '@/theme/colors'

export default function Profile() {
  const { session } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setLoading(false)
  }

  return (
    <View className="flex-1 bg-bg px-6 pt-16">
      <Text className="text-text text-2xl font-bold mb-1">Profile</Text>
      <Text className="text-text-muted text-sm mb-8">
        {session?.user.email ?? ''}
      </Text>

      <View className="flex-1" />

      <TouchableOpacity
        className="w-full border border-red-500 rounded-xl py-4 items-center mb-8"
        style={{ opacity: loading ? 0.6 : 1 }}
        onPress={handleLogout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} size="small" />
        ) : (
          <Text className="text-red-500 font-semibold text-base">Sign Out</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}
