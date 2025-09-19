import React, { useCallback, useEffect, useRef, useState } from "react"
import { Text } from "@/components/ui/text"
import { router, Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { PortalHost } from "@rn-primitives/portal"

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
          displayName: user.displayName ?? "",
          email: user.email ?? "",
          photoURL: user.photoURL ?? "",
        })
      } else {
        router.replace("/sign-in/SignInPage")
      }
    })

    return () => unsubscribe()
  }, [])
  const bottomSheetRef = useRef<BottomSheet>(null)

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index)
  }, [])

  return (
    <GestureHandlerRootView>
      <Tabs
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: "#c79dffff",
          tabBarInactiveTintColor: "#8e8e93",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: `Hola, ${profile?.displayName || "User"}`,
            headerTitleAlign: "left",
            headerTransparent: true,
            headerShown: true,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tabs>
      <PortalHost />
    </GestureHandlerRootView>
  )
}
