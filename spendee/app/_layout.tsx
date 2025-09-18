import { Stack } from "expo-router"
import "@/global.css"
import { PortalHost } from "@rn-primitives/portal"
import React from "react"
import Toast, {
  ToastConfig,
  BaseToast,
  BaseToastProps,
} from "react-native-toast-message"
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native"
import { useColorScheme } from "react-native"
import { Info, OctagonAlert } from "lucide-react-native"

export default function RootLayout() {
  const toastConfig = {
    danger: (props: BaseToastProps) => (
      <BaseToast
        {...props}
        renderLeadingIcon={() => (
          <OctagonAlert color={"rgba(194, 3, 3, 1)"} size={20} />
        )}
        style={{
          marginTop: 30,
          borderLeftColor: "rgba(194, 3, 3, 1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme === DarkTheme ? "black" : "white",
          paddingLeft: 20,
        }}
        contentContainerStyle={{
          display: "flex",
          alignItems: "center",
          alignSelf: "center",
        }}
        text1Style={{
          fontSize: 17,
          fontWeight: "300",
          color: "rgba(194, 3, 3, 1)",
        }}
        text2Style={{
          fontSize: 15,
          fontWeight: "400",
          color: "white",
        }}
        text1NumberOfLines={2}
      />
    ),
  }
  const colorScheme = useColorScheme()
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme
  return (
    <ThemeProvider value={theme}>
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          animation: "fade",
          animationDuration: 200,
        }}
      >
        <Stack.Screen name="index" options={{ headerTransparent: true }} />
        <Stack.Screen name="sign-in/SignInPage" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="edit-profile"
          options={{
            headerShown: true,
            title: "Editar Perfil",
            headerBackTitle: "Perfil",
          }}
        />
      </Stack>
      <Toast config={toastConfig as any as ToastConfig} />
      <PortalHost />
    </ThemeProvider>
  )
}
