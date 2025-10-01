import { Stack } from 'expo-router'
import { Platform } from 'react-native'

export default function EditProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Editar Perfil',
          headerBackTitle: 'Perfil',
        }}
      />
      <Stack.Screen
        name="change-password"
        options={{
          title: 'Cambiar contraseña',
          headerBackTitle: 'Editar',
        }}
      />
    </Stack>
  )
}
