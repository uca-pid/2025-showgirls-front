import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { PortalHost } from '@rn-primitives/portal'
import { useAuth } from '@/context/AuthContext'

export default function TabsLayout() {
  const { user, loading } = useAuth()

  return (
    <GestureHandlerRootView>
      <Tabs
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: '#c79dffff',
          tabBarInactiveTintColor: '#8e8e93',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: `Hola ${!loading ? user?.displayName : 'Cargando...'}`,
            tabBarLabel: 'Home',
            headerTitleAlign: 'left',
            headerTransparent: true,
            headerShown: true,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile/index"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile/index/change-password"
          options={{
            title: 'Cambiar Contraseña',
          }}
        />
      </Tabs>
      <PortalHost />
    </GestureHandlerRootView>
  )
}
