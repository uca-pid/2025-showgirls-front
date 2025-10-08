import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import '@/global.css'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { PortalHost } from '@rn-primitives/portal'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import React from 'react'
import { useColorScheme } from 'react-native'

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme
  const queryClient = new QueryClient()
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
      <Stack.Screen name="expense/index" options={{ title: 'Mis Gastos' }} />
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
