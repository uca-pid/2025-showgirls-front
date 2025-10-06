import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { PortalHost } from '@rn-primitives/portal'
import { useAuth } from '@/context/AuthContext'
import { TabBar } from '@/components/TabBar'

export default function TabsLayout() {
  const { user, loading } = useAuth()

  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: `Hola ${!loading ? user?.displayName : 'Cargando...'}`,
          tabBarLabel: 'Home',
          headerTitleAlign: 'left',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#F9A8D4' },
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Perfil',
        }}
      />
    </Tabs>
  )
}
