import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AVAILABLE_COLORS, AppColor } from './colors'

const STORAGE_KEY = 'APP_THEME_COLOR'

interface ThemeContextProps {
  color: AppColor
  setColor: (color: AppColor) => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [color, setColorState] = useState<AppColor>('pink')

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved && saved in AVAILABLE_COLORS) setColorState(saved as AppColor)
    })
  }, [])

  const setColor = async (newColor: AppColor) => {
    setColorState(newColor)
    await AsyncStorage.setItem(STORAGE_KEY, newColor)
  }

  return (
    <ThemeContext.Provider value={{ color, setColor }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext debe usarse dentro de ThemeProvider')
  }
  return context
}
