import { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import type { PurchasesPackage } from 'react-native-purchases'
import { PACKAGE_TYPE } from 'react-native-purchases'
import { Purchases, ENTITLEMENT_ID } from '@/services/revenuecat/client'
import { useEntitlement } from '@/providers/EntitlementProvider'
import { supabase } from '@/services/supabase/client'
import { colors } from '@/theme/colors'

const FEATURES = [
  { icon: 'barbell', label: 'Unlimited workout plans & tracking' },
  { icon: 'restaurant', label: 'Full macro & calorie tracking' },
  { icon: 'people', label: 'Community challenges & leaderboards' },
  { icon: 'analytics', label: 'Advanced progress analytics' },
  { icon: 'trophy', label: 'Personalised training programs' },
] as const

type Plan = {
  key: string
  label: string
  period: string
  price: string
  pricePerWeek?: string
  badge?: string
  pkg?: PurchasesPackage
}

const FALLBACK_PLANS: Plan[] = [
  { key: 'annual', label: 'Annual', period: 'year', price: '$59.99', pricePerWeek: '$1.15/wk', badge: 'BEST VALUE' },
  { key: 'monthly', label: 'Monthly', period: 'month', price: '$9.99' },
  { key: 'weekly', label: 'Weekly', period: 'week', price: '$3.99' },
]

function buildPlans(packages: PurchasesPackage[]): Plan[] {
  const order = [PACKAGE_TYPE.ANNUAL, PACKAGE_TYPE.MONTHLY, PACKAGE_TYPE.WEEKLY]
  const sorted = [...packages].sort(
    (a, b) => order.indexOf(a.packageType) - order.indexOf(b.packageType),
  )

  return sorted.map((pkg) => {
    const isAnnual = pkg.packageType === PACKAGE_TYPE.ANNUAL
    const priceStr = pkg.product.priceString

    let pricePerWeek: string | undefined
    if (isAnnual) {
      const weekly = (pkg.product.price / 52).toFixed(2)
      pricePerWeek = `$${weekly}/wk`
    }

    const periodMap: Record<string, string> = {
      [PACKAGE_TYPE.ANNUAL]: 'year',
      [PACKAGE_TYPE.MONTHLY]: 'month',
      [PACKAGE_TYPE.WEEKLY]: 'week',
    }

    return {
      key: pkg.identifier,
      label: pkg.packageType === PACKAGE_TYPE.ANNUAL
        ? 'Annual'
        : pkg.packageType === PACKAGE_TYPE.MONTHLY
        ? 'Monthly'
        : 'Weekly',
      period: periodMap[pkg.packageType] ?? '',
      price: priceStr,
      pricePerWeek,
      badge: isAnnual ? 'BEST VALUE' : undefined,
      pkg,
    }
  })
}

export default function Paywall() {
  const { refresh } = useEntitlement()
  const [plans, setPlans] = useState<Plan[]>(FALLBACK_PLANS)
  const [selectedKey, setSelectedKey] = useState<string>('annual')
  const [offeringsLoaded, setOfferingsLoaded] = useState(false)
  const [purchasing, setPurchasing] = useState(false)
  const [restoring, setRestoring] = useState(false)

  const loadOfferings = useCallback(async () => {
    try {
      const offerings = await Purchases.getOfferings()
      const pkgs = offerings.current?.availablePackages ?? []
      if (pkgs.length > 0) {
        const built = buildPlans(pkgs)
        setPlans(built)
        setSelectedKey(built[0]?.key ?? 'annual')
      }
    } catch (e) {
      // No RC key configured or network error — fallback plans remain
      console.warn('[Paywall] Could not load offerings', e)
    } finally {
      setOfferingsLoaded(true)
    }
  }, [])

  useEffect(() => {
    loadOfferings()
  }, [loadOfferings])

  const selectedPlan = plans.find((p) => p.key === selectedKey) ?? plans[0]

  const handlePurchase = async () => {
    if (!selectedPlan?.pkg) {
      Alert.alert('Not Available', 'Subscription plans are not available right now. Please try again later.')
      return
    }

    setPurchasing(true)
    try {
      const { customerInfo } = await Purchases.purchasePackage(selectedPlan.pkg)
      const active = !!customerInfo.entitlements.active[ENTITLEMENT_ID]

      if (active) {
        await refresh()
        router.replace('/(app)/(tabs)/home')
      } else {
        Alert.alert('Purchase Incomplete', 'Your purchase could not be verified. Please restore purchases or contact support.')
      }
    } catch (e: unknown) {
      const err = e as { userCancelled?: boolean; message?: string }
      if (!err.userCancelled) {
        Alert.alert('Purchase Failed', err.message ?? 'An unknown error occurred.')
      }
    } finally {
      setPurchasing(false)
    }
  }

  const handleRestore = async () => {
    setRestoring(true)
    try {
      const customerInfo = await Purchases.restorePurchases()
      const active = !!customerInfo.entitlements.active[ENTITLEMENT_ID]

      if (active) {
        await refresh()
        router.replace('/(app)/(tabs)/home')
      } else {
        Alert.alert('Nothing to Restore', "We couldn't find any active subscriptions linked to your account.")
      }
    } catch (e: unknown) {
      const err = e as { message?: string }
      Alert.alert('Restore Failed', err.message ?? 'An unknown error occurred.')
    } finally {
      setRestoring(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const isBusy = purchasing || restoring

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row justify-end px-4 pt-2 pb-2">
          <TouchableOpacity onPress={handleSignOut} className="py-2 px-3">
            <Text className="text-text-muted text-sm">Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View className="items-center px-6 pt-4 pb-8">
          <View className="bg-primary rounded-2xl w-16 h-16 items-center justify-center mb-4">
            <Ionicons name="barbell" size={32} color="white" />
          </View>
          <Text className="text-primary text-sm font-bold tracking-widest uppercase mb-2">
            GymRat Pro
          </Text>
          <Text className="text-text text-3xl font-bold text-center leading-tight mb-3">
            Unlock Your{'\n'}Full Potential
          </Text>
          <Text className="text-text-muted text-base text-center leading-6">
            Join thousands of athletes crushing their goals with the all-in-one fitness platform built for serious lifters.
          </Text>
        </View>

        {/* Features */}
        <View className="px-6 mb-8">
          {FEATURES.map(({ icon, label }) => (
            <View key={label} className="flex-row items-center mb-3">
              <View className="bg-primary/15 rounded-full w-8 h-8 items-center justify-center mr-3">
                <Ionicons name={icon as never} size={16} color={colors.primary} />
              </View>
              <Text className="text-text text-sm flex-1">{label}</Text>
            </View>
          ))}
        </View>

        {/* Plan selector */}
        <View className="px-6 mb-6">
          {!offeringsLoaded ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 24 }} />
          ) : (
            plans.map((plan) => {
              const selected = plan.key === selectedKey
              return (
                <TouchableOpacity
                  key={plan.key}
                  className={`rounded-xl border p-4 mb-3 flex-row items-center ${
                    selected
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-surface'
                  }`}
                  onPress={() => setSelectedKey(plan.key)}
                >
                  {/* Radio */}
                  <View
                    className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                      selected ? 'border-primary' : 'border-border'
                    }`}
                  >
                    {selected && (
                      <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </View>

                  {/* Label */}
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className={`font-semibold text-base ${selected ? 'text-text' : 'text-text-muted'}`}>
                        {plan.label}
                      </Text>
                      {plan.badge && (
                        <View className="bg-primary rounded px-2 py-0.5">
                          <Text className="text-white text-xs font-bold">{plan.badge}</Text>
                        </View>
                      )}
                    </View>
                    {plan.pricePerWeek && (
                      <Text className="text-text-muted text-xs mt-0.5">{plan.pricePerWeek}</Text>
                    )}
                  </View>

                  {/* Price */}
                  <View className="items-end">
                    <Text className={`font-bold text-base ${selected ? 'text-text' : 'text-text-muted'}`}>
                      {plan.price}
                    </Text>
                    <Text className="text-text-muted text-xs">/{plan.period}</Text>
                  </View>
                </TouchableOpacity>
              )
            })
          )}
        </View>

        {/* CTA */}
        <View className="px-6">
          <TouchableOpacity
            className="w-full bg-primary rounded-xl py-4 items-center mb-4"
            style={{ opacity: isBusy ? 0.6 : 1 }}
            onPress={handlePurchase}
            disabled={isBusy}
          >
            {purchasing ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-white font-bold text-base">
                {selectedPlan?.pkg
                  ? `Start ${selectedPlan.label} Plan`
                  : 'Plans Unavailable'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center py-2"
            style={{ opacity: isBusy ? 0.6 : 1 }}
            onPress={handleRestore}
            disabled={isBusy}
          >
            {restoring ? (
              <ActivityIndicator color={colors.textMuted} size="small" />
            ) : (
              <Text className="text-text-muted text-sm">Restore Purchases</Text>
            )}
          </TouchableOpacity>

          <Text className="text-text-muted text-xs text-center mt-4 leading-4">
            Subscriptions auto-renew. Cancel any time in your device settings.{'\n'}
            By continuing you agree to our{' '}
            <Text className="text-primary">Terms of Service</Text>
            {' '}and{' '}
            <Text className="text-primary">Privacy Policy</Text>.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
