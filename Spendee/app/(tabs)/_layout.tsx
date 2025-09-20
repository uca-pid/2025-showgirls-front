import React, { useEffect, useState } from 'react'
import { router, Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { PortalHost } from '@rn-primitives/portal'

export default function TabsLayout() {
  const [profile, setProfile] = useState<{
    uid?: string
    displayName?: string
    email?: string
    photoURL?: string
  } | null>(null)

  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setProfile({
          uid: user.uid,
          displayName: user.displayName ?? '',
          email: user.email ?? '',
          photoURL: user.photoURL ?? '',
        })
      } else {
        router.replace('./sign-in')
      }
    })

    return () => unsubscribe()
  }, [])

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
            title: `Hola, ${profile?.displayName}`,
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
          name="profile/edit-profile/index"
          options={{ href: null, headerTitle: 'Editar Perfil' }}
        />
      </Tabs>
      <PortalHost />
    </GestureHandlerRootView>
  )
}
