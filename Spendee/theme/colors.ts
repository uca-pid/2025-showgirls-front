export const AVAILABLE_COLORS = {
  pink: '#ec4899',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  purple: '#a855f7',
  orange: '#f97316',
} as const

export type AppColor = keyof typeof AVAILABLE_COLORS
