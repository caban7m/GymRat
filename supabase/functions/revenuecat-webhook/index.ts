// RevenueCat → Supabase webhook
// Deploy: supabase functions deploy revenuecat-webhook
// Configure RC: Dashboard → Integrations → Webhooks → POST to your function URL
// Set Authorization header value in RC to match REVENUECAT_WEBHOOK_SECRET

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// RevenueCat event types that mean the user has an active entitlement
const ACTIVE_EVENTS = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'NON_RENEWING_PURCHASE',
  'UNCANCELLATION',
  // CANCELLATION: user cancelled but is still within paid period — keep active
  'CANCELLATION',
])

// Event types that definitively revoke access
const INACTIVE_EVENTS = new Set([
  'EXPIRATION',
  'BILLING_ISSUE',
  'SUBSCRIBER_ALIAS', // identity event — no entitlement change
])

Deno.serve(async (req: Request) => {
  // Only accept POST
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  // Verify webhook secret (set in RC dashboard and stored as a Supabase secret)
  const webhookSecret = Deno.env.get('REVENUECAT_WEBHOOK_SECRET')
  if (webhookSecret) {
    const authHeader = req.headers.get('Authorization') ?? ''
    if (authHeader !== `Bearer ${webhookSecret}`) {
      return new Response('Unauthorized', { status: 401 })
    }
  }

  let payload: Record<string, unknown>
  try {
    payload = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const event = payload.event as Record<string, unknown> | undefined
  if (!event) {
    return new Response('Missing event', { status: 400 })
  }

  const eventType = event.type as string
  const appUserId = event.app_user_id as string | undefined

  // app_user_id must be the Supabase user UUID (set via Purchases.logIn in the app)
  if (!appUserId) {
    console.warn('RC webhook missing app_user_id', { eventType })
    return new Response('Missing app_user_id', { status: 400 })
  }

  // Skip events that don't affect entitlements
  if (!ACTIVE_EVENTS.has(eventType) && !INACTIVE_EVENTS.has(eventType)) {
    console.log('Ignoring event type', eventType)
    return new Response('OK', { status: 200 })
  }

  // Determine if entitlement is active
  let isActive: boolean
  if (ACTIVE_EVENTS.has(eventType)) {
    if (eventType === 'CANCELLATION') {
      // Still active until period end — check expiration
      const expirationMs = event.expiration_at_ms as number | undefined
      isActive = expirationMs ? new Date(expirationMs) > new Date() : false
    } else {
      isActive = true
    }
  } else {
    isActive = false
  }

  const expirationMs = event.expiration_at_ms as number | undefined
  const purchasedAtMs = event.purchased_at_ms as number | undefined

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const { error } = await supabase
    .from('user_entitlements')
    .upsert(
      {
        user_id: appUserId,
        is_active: isActive,
        product_id: (event.product_id as string) ?? null,
        purchase_date: purchasedAtMs ? new Date(purchasedAtMs).toISOString() : null,
        expiration_date: expirationMs ? new Date(expirationMs).toISOString() : null,
        revenuecat_event_id: (event.id as string) ?? null,
        revenuecat_event_type: eventType,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )

  if (error) {
    console.error('Supabase upsert error', error)
    return new Response('Database error', { status: 500 })
  }

  console.log(`Entitlement updated: user=${appUserId} active=${isActive} event=${eventType}`)
  return new Response('OK', { status: 200 })
})
