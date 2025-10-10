import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import { auth } from '@/firebase.config'
import '@/global.css'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { PortalHost } from '@rn-primitives/portal'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router, Stack } from 'expo-router'
import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect } from 'react'
import { useColorScheme } from 'react-native'

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
            <RootNavigator />
          </ToastProvider>
        </QueryClientProvider>
      </AuthProvider>
      <PortalHost />
    </ThemeProvider>
  )
}

function RootNavigator() {
  const { user, loading } = useAuth()
  return (
    <Stack>
      <Stack.Screen name="sign-in/index" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up/index" options={{ headerShown: false }} />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
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
        options={{ title: 'Mis Gastos', headerBackTitle: 'Home' }}
      />
      <Stack.Screen
        name="expense/modal/add"
        options={{
          headerShown: false,
          presentation: 'formSheet',
          sheetAllowedDetents: [0.5],
          sheetGrabberVisible: true,
        }}
      />
      <Stack.Screen
        name="expense/modal/categories-list"
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="expense/[id]"
        options={{ title: 'Detalle del Gasto' }}
      />
      <Stack.Screen
        name="expense/perCategorie/[id]"
        options={{ title: 'Gastos por categoría' }}
      />
      <Stack.Screen
        name="income/modal/add"
        options={{
          headerShown: false,
          presentation: 'formSheet',
          sheetAllowedDetents: [0.5],
          sheetGrabberVisible: true,
        }}
      />
      <Stack.Screen
        name="income/modal/categories-list"
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
    </Stack>
  )
}
