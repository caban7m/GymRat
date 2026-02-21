export const colors = {
  bg: '#0a0a0a',
  surface: '#1a1a1a',
  primary: '#f97316',
  primaryDark: '#ea580c',
  text: '#ffffff',
  textMuted: '#6b7280',
  border: '#2a2a2a',
} as const

export type ColorKey = keyof typeof colors
