import { View, Text, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
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
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confNewPassword, setConfNewPassword] = useState('')

  const showErrorToast = (message: string) => {
    toastService.show(message)
  }
  const showSuccessToast = (message: string) => {
    toastService.show(message, 'success')
  }

  const user = auth.currentUser
  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confNewPassword) {
      showErrorToast('Completá todos los campos')
    } else if (newPassword !== confNewPassword) {
      showErrorToast('Las contraseñas deben coincidir')
    } else if (newPassword.length < 8) {
      showErrorToast('La contraseña debe tener al menos 8 caracteres')
    } else if (oldPassword === newPassword) {
      showErrorToast('La contraseña nueva debe ser distinta a la actual')
    } else if (user && user.email) {
      const credentials = EmailAuthProvider.credential(user.email, oldPassword)
      setLoading(true)
      await reauthenticateWithCredential(user, credentials)
        .then(() =>
          updatePassword(user, newPassword).then(() => {
            showSuccessToast(
              'Contraseña actualizada correctamente. Por favor, inicia sesión nuevamente',
            )
            router.dismissAll()
            router.replace('/sign-in')
            userService.signOut(auth)
          }),
        )
        .catch((error) => {
          showErrorToast('La contraseña es incorrecta')
        })
      setLoading(false)
    }
  }

  return (
    <View className="bg-background w-full h-full p-4 gap-4">
      <View className="w-full">
        <Text className="text-sm color-muted-foreground pl-4 ">
          CAMBIAR CONTRASEÑA
        </Text>
        <Card className="w-full h-auto">
          <CardContent className="gap-4">
            <Label htmlFor="newName">
              <Text>Contraseña actual</Text>
            </Label>
            <Input
              id="newName"
              placeholder="Contraseña"
              secureTextEntry
              onChangeText={setOldPassword}
            />
            <Label htmlFor="newName">
              <Text>Contraseña nueva</Text>
            </Label>
            <Input
              id="newName"
              placeholder="Nueva contraseña"
              secureTextEntry
              onChangeText={setNewPassword}
            />
            <Label htmlFor="newName">
              <Text>Confirmar contraseña</Text>
            </Label>
            <Input
              id="newName"
              placeholder="Confirmar"
              secureTextEntry
              onChangeText={setConfNewPassword}
            />
            <Button
              disabled={loading}
              className="mt-[10px]"
              onPress={handlePasswordChange}
            >
              {loading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text>Actualizar</Text>
              )}
            </Button>
          </CardContent>
        </Card>
      </View>
    </View>
  )
}

export default ChangePasswordPage
