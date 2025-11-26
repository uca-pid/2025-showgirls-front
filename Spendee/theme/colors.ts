export const AVAILABLE_COLORS = {
  rose: '#fda4af',
  pink: '#f9a8d4',
  fuchsia: '#f0abfc',
  purple: '#d8b4fe',
  violet: '#c4b5fd',
  indigo: '#a5b4fc',
  blue: '#93c5fd',
  lightBlue: '#7dd3fc',
  cyan: '#67e8f9',
  teal: '#5eead4',
  emerald: '#6ee7b7',
  green: '#86efac',
  lime: '#bef264',
  yellow: '#fde047',
  amber: '#fcd34d',
  orange: '#fdba74',
  red: '#ef4444',
  warmGray: '#d6d3d1',
} as const

export type AppColor = keyof typeof AVAILABLE_COLORS
