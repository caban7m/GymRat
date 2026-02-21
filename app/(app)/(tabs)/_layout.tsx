import type { ComponentProps } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { Tabs, Redirect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useEntitlement } from '@/providers/EntitlementProvider'
import { colors } from '@/theme/colors'

type IoniconsName = ComponentProps<typeof Ionicons>['name']

type TabConfig = {
  name: string
  title: string
  icon: IoniconsName
  iconFocused: IoniconsName
}

const tabs: TabConfig[] = [
  { name: 'home', title: 'Home', icon: 'home-outline', iconFocused: 'home' },
  { name: 'training', title: 'Training', icon: 'barbell-outline', iconFocused: 'barbell' },
  { name: 'nutrition', title: 'Nutrition', icon: 'restaurant-outline', iconFocused: 'restaurant' },
  { name: 'community', title: 'Community', icon: 'people-outline', iconFocused: 'people' },
  { name: 'profile', title: 'Profile', icon: 'person-outline', iconFocused: 'person' },
]

export default function TabsLayout() {
  const { isActive, loading } = useEntitlement()

  if (loading) {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  // Entitlement gate — mandatory paywall if not subscribed
  if (!isActive) {
    return <Redirect href="/(app)/paywall" />
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? tab.iconFocused : tab.icon}
                color={color}
                size={size}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  )
}
