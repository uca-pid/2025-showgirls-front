import { Stack } from 'expo-router'

export default function ModalLayout() {
  return (
    <Stack>
      <Stack.Screen name="add" options={{ headerShown: false }} />
      <Stack.Screen
        name="categories-list"
        options={{ headerShown: false, presentation: 'modal' }}
      />
    </Stack>
  )
}
