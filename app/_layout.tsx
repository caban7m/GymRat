import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { AuthProvider } from '@/providers/AuthProvider'
import { EntitlementProvider } from '@/providers/EntitlementProvider'
import { initializePurchases } from '@/services/revenuecat/client'
import '../global.css'

export default function RootLayout() {
  useEffect(() => {
    // Initialize RevenueCat once on app start
    initializePurchases()
  }, [])

  return (
    <AuthProvider>
      <EntitlementProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(app)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </EntitlementProvider>
    </AuthProvider>
  )
}
