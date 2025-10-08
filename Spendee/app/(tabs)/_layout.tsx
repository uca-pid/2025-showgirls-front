import { TabBar } from '@/components/TabBar'
import { useAuth } from '@/context/AuthContext'
import { Tabs } from 'expo-router'
import React from 'react'

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
