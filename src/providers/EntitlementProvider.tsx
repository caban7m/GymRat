import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { PropsWithChildren } from 'react'
import type { CustomerInfo } from 'react-native-purchases'
import { Purchases } from '@/services/revenuecat/client'
import { ENTITLEMENT_ID, loginRC, logoutRC } from '@/services/revenuecat/client'
import { supabase } from '@/services/supabase/client'
import { useAuth } from '@/providers/AuthProvider'

type EntitlementContextType = {
  /** Server-verified entitlement state */
  isActive: boolean
  loading: boolean
  /** Re-fetch from Supabase — call after a purchase completes */
  refresh: () => Promise<void>
}

const EntitlementContext = createContext<EntitlementContextType>({
  isActive: false,
  loading: true,
  refresh: async () => {},
})

export function EntitlementProvider({ children }: PropsWithChildren) {
  const { session } = useAuth()
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(true)

  /**
   * Fetch entitlement row from Supabase (server-verified truth).
   * A missing row = not subscribed.
   */
  const fetchServerEntitlement = useCallback(async () => {
    if (!session) {
      setIsActive(false)
      return
    }

    const { data, error } = await supabase
      .from('user_entitlements')
      .select('is_active, expiration_date')
      .maybeSingle()

    if (error) {
      console.warn('[Entitlement] Supabase fetch error', error.message)
      return
    }

    if (!data) {
      setIsActive(false)
      return
    }

    const notExpired =
      !data.expiration_date || new Date(data.expiration_date) > new Date()

    setIsActive(data.is_active && notExpired)
  }, [session])

  /**
   * Public refresh — call after purchase/restore so the UI updates
   * even before the webhook lands.
   */
  const refresh = useCallback(async () => {
    await fetchServerEntitlement()
  }, [fetchServerEntitlement])

  /**
   * When the RC customer info updates (e.g., immediately after purchase),
   * use it as an optimistic signal so the gate opens instantly.
   * The webhook will eventually write the server-verified truth.
   */
  const handleCustomerInfoUpdate = useCallback(
    (info: CustomerInfo) => {
      const rcActive = !!info.entitlements.active[ENTITLEMENT_ID]
      if (rcActive) {
        // Optimistic: grant access immediately
        setIsActive(true)
        // Then re-verify with server in background
        fetchServerEntitlement()
      }
    },
    [fetchServerEntitlement],
  )

  useEffect(() => {
    if (!session) {
      setIsActive(false)
      setLoading(false)
      return
    }

    let cancelled = false

    const init = async () => {
      // Identify user in RevenueCat
      await loginRC(session.user.id)

      if (cancelled) return

      // Check server entitlement
      await fetchServerEntitlement()

      if (!cancelled) setLoading(false)
    }

    init()

    // Subscribe to RC real-time updates (fires immediately after purchase/restore)
    const listener = (info: CustomerInfo) => handleCustomerInfoUpdate(info)
    Purchases.addCustomerInfoUpdateListener(listener)

    return () => {
      cancelled = true
      Purchases.removeCustomerInfoUpdateListener(listener)
      logoutRC()
    }
  }, [session, fetchServerEntitlement, handleCustomerInfoUpdate])

  return (
    <EntitlementContext.Provider value={{ isActive, loading, refresh }}>
      {children}
    </EntitlementContext.Provider>
  )
}

export function useEntitlement() {
  return useContext(EntitlementContext)
}
