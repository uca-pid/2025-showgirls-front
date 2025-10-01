import React, { useState } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { auth } from '@/firebase.config'
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth'
import { toastService } from '@/context/ToastContext'
import { router } from 'expo-router'
import userService from '../services/user.service'

const ChangePasswordPage = () => {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    toastService.show(message, type === 'success' ? 'success' : undefined)
  }

  const validateForm = () => {
    const { oldPassword, newPassword, confirmPassword } = form
    if (!oldPassword || !newPassword || !confirmPassword) {
      return 'Completá todos los campos'
    }
    if (newPassword !== confirmPassword) {
      return 'Las contraseñas deben coincidir'
    }
    if (newPassword.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres'
    }
    if (oldPassword === newPassword) {
      return 'La contraseña nueva debe ser distinta a la actual'
    }
    return null
  }

  const handlePasswordChange = async () => {
    const errorMsg = validateForm()
    if (errorMsg) return showToast(errorMsg)

    const user = auth.currentUser
    if (!user?.email) return showToast('Usuario no válido')

    setLoading(true)
    try {
      const credentials = EmailAuthProvider.credential(
        user.email,
        form.oldPassword,
      )
      await reauthenticateWithCredential(user, credentials)
      await updatePassword(user, form.newPassword)

      showToast(
        'Contraseña actualizada correctamente. Por favor, inicia sesión nuevamente',
        'success',
      )
      router.dismissAll()
      router.replace('/sign-in')
      userService.signOut(auth)
    } catch {
      showToast('La contraseña actual es incorrecta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="bg-background w-full h-full p-4 gap-4">
      <Text className="text-sm text-muted-foreground pl-4">
        CAMBIAR CONTRASEÑA
      </Text>

      <Card className="w-full">
        <CardContent className="gap-4">
          <Label>
            <Text>Contraseña actual</Text>
          </Label>
          <Input
            placeholder="Contraseña"
            secureTextEntry
            onChangeText={(text) => handleChange('oldPassword', text)}
          />

          <Label>
            <Text>Contraseña nueva</Text>
          </Label>
          <Input
            placeholder="Nueva contraseña"
            secureTextEntry
            onChangeText={(text) => handleChange('newPassword', text)}
          />

          <Label>
            <Text>Confirmar contraseña</Text>
          </Label>
          <Input
            placeholder="Confirmar"
            secureTextEntry
            onChangeText={(text) => handleChange('confirmPassword', text)}
          />

          <Button
            disabled={loading}
            className="mt-[10px]"
            onPress={handlePasswordChange}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text>Actualizar</Text>
            )}
          </Button>
        </CardContent>
      </Card>
    </View>
  )
}

export default ChangePasswordPage
