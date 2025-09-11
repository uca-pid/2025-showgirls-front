import { Stack } from "expo-router"
import "../global.css"
import { PortalHost } from "@rn-primitives/portal"
import React from "react"

export default function RootLayout() {
  return (
    <>
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="sign-in/SignInPage" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <PortalHost />
    </>
  )
}
