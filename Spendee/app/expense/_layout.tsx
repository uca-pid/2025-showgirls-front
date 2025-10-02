import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function ExpenseLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <Stack
        screenOptions={{
          animation: 'fade',
          animationDuration: 200,
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Gastos' }} />
        <Stack.Screen name="[id]" options={{ title: 'Detalle del Gasto' }} />
      </Stack>
    </GestureHandlerRootView>
  )
}
