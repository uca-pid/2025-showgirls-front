import { AVAILABLE_COLORS } from './colors'
import { useThemeContext } from './themeContext'

export default function useThemeColor() {
  const { color, setColor } = useThemeContext()

  return {
    color,
    setColor,
    colorHex: AVAILABLE_COLORS[color],
  }
}
