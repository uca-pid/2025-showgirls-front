import { router, Stack } from 'expo-router'
import '@/global.css'
import { PortalHost } from '@rn-primitives/portal'
import React, { useEffect } from 'react'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { useColorScheme } from 'react-native'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase.config'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/')
      } else {
        router.replace('./sign-in')
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <ToastProvider>
      <AuthProvider>
        <ThemeProvider value={theme}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
              animationDuration: 200,
            }}
          >
            <Stack.Screen name="sign-in/index" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          <PortalHost />
        </ThemeProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
