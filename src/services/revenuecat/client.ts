import { Platform } from 'react-native'
import Purchases, { LOG_LEVEL } from 'react-native-purchases'

// Must match the entitlement identifier created in RevenueCat dashboard
export const ENTITLEMENT_ID = 'pro'

const IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? ''
const ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? ''

/**
 * Call once on app start (in root _layout.tsx).
 * No-ops if the API key is not yet configured.
 */
export function initializePurchases(): void {
  const key = Platform.OS === 'ios' ? IOS_KEY : ANDROID_KEY
  if (!key || key === 'your_revenuecat_ios_key_here' || key === 'your_revenuecat_android_key_here') {
    console.warn('[RC] RevenueCat API key not configured — purchases disabled')
    return
  }
  Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR)
  Purchases.configure({ apiKey: key })
}

/**
 * Identify the user in RevenueCat using their Supabase user ID.
 * Must be called after initializePurchases() and after auth.
 */
export async function loginRC(supabaseUserId: string): Promise<void> {
  try {
    await Purchases.logIn(supabaseUserId)
  } catch (e) {
    console.warn('[RC] logIn failed', e)
  }
}

/**
 * Reset RC identity on sign-out.
 */
export async function logoutRC(): Promise<void> {
  try {
    await Purchases.logOut()
  } catch (e) {
    console.warn('[RC] logOut failed', e)
  }
}

export { Purchases }
