import { createContext, useContext } from 'react'
import type { PropsWithChildren } from 'react'
import { supabase } from '@/services/supabase/client'

const SupabaseContext = createContext({ supabase })

export function SupabaseProvider({ children }: PropsWithChildren) {
  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  return useContext(SupabaseContext)
}
