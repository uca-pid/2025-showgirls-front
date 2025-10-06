import { router, Stack } from 'expo-router'
import '@/global.css'
import { PortalHost } from '@rn-primitives/portal'
import React, { use, useEffect } from 'react'
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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme
  const queryClient = new QueryClient()

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
    <ThemeProvider value={theme}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <Stack>
              <Stack.Screen
                name="sign-in/index"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="sign-up/index"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="edit-profile/index"
                options={{ title: 'Editar Perfil', headerBackTitle: 'Perfil' }}
              />
              <Stack.Screen
                name="edit-profile/change-password"
                options={{
                  title: 'Cambiar Contraseña',
                  headerBackTitle: 'Volver',
                }}
              />
              <Stack.Screen
                name="expense/index"
                options={{ title: 'Mis Gastos' }}
              />
              <Stack.Screen
                name="expense/modal"
                options={{ headerShown: false, presentation: 'modal' }}
              />
              <Stack.Screen
                name="expense/[id]"
                options={{ title: 'Detalle del Gasto' }}
              />
            </Stack>
          </ToastProvider>
        </QueryClientProvider>
      </AuthProvider>
      <PortalHost />
    </ThemeProvider>
  )
}
