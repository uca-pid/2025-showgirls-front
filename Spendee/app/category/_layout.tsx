import { Stack } from 'expo-router'
import { Platform } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function ExpenseLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <Stack
        screenOptions={
          Platform.OS === 'ios'
            ? {
                animation: 'fade',
                animationDuration: 200,
              }
            : {}
        }
      >
        <Stack.Screen name="index" options={{ title: 'Categoría Nueva' }} />
        <Stack.Screen
          name="edit-category"
          options={{
            title: 'Editar Categoría',
            headerBackTitle: 'Atrás',
            headerBackVisible: true,
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  )
}
