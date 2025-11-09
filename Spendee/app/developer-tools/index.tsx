import {
  ActivityIndicator,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import Modal from 'react-native-modal'
import React, { useState } from 'react'
import * as Clipboard from 'expo-clipboard'
import { Text } from '@/components/ui/text'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Toast from 'react-native-toast-message'
import { Trash2 } from 'lucide-react-native'
import userService from '../../services/user.service'
import { auth } from '../../firebase.config'
import { router } from 'expo-router'

export default function EditProfilePage() {
  const [newName, setNewName] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const [apiId, setApiId] = useState<string>('')
  const [apiSecret, setApiSecret] = useState<string>('')
  const [hasAPISecret, setHasAPISecret] = useState<boolean>(false)

  const copySecretToClipboard = async () => {
    if (!apiSecret) return
    try {
      await Clipboard.setStringAsync(apiSecret)
      // clear the secret so it cannot be seen anymore
      setApiSecret('')
      Toast.show({ type: 'success', text1: 'Copiado al portapapeles' })
    } catch (e: any) {
      showErrorToast('Error copiando', e?.message)
    }
  }

  const copyIdToClipboard = async () => {
    if (!apiId) return
    try {
      await Clipboard.setStringAsync(apiId)
      Toast.show({ type: 'success', text1: 'Copiado al portapapeles' })
    } catch (e: any) {
      showErrorToast('Error copiando', e?.message)
    }
  }

  const showErrorToast = (title: string, description?: string) => {
    Toast.show({
      type: 'danger',
      text1: title,
      text2: description,
    })
  }

  async function generateSecret() {
    setLoading(true)
    try {
      const secret = await userService.generateApiSecret(auth)
      const getSecretText = (s: any): string => {
        if (s == null) return ''
        if (typeof s === 'string') return s
        // prefer s.data when available
        const data = s.data
        if (typeof data === 'string') return data
        if (typeof data?.apiSecret === 'string') return data.apiSecret
        return ''
      }

      const secretText = getSecretText(secret)
      console.log('Generated API Secret:', secretText)
      setApiSecret(secretText)
      setHasAPISecret(true)
      Toast.show({
        text1: 'API Secret generado',
        text2: secretText,
      })
    } catch (error: any) {
      showErrorToast('Error al generar API Secret', error.message)
    } finally {
      setLoading(false)
    }
  }


  const handleDeleteSecret = () => {
    Alert.alert(
      'Eliminar Secret',
      'Esta acción es irreversible \n¿Seguro que deseas continuar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar Secret',
          style: 'destructive',
          onPress: async () => {
            setLoading(true)
            const res = await userService.deleteApiSecret(auth)
            if (res) {
              setApiSecret('')
              setHasAPISecret(false)
              Toast.show({
                type: 'success',
                text1: 'API Secret eliminado',
              })
            }
            setLoading(false)
          },
        },
      ],
    )
  }

  //Funcion que se dispara cuando se carga la pantalla para verificar si el usuario tiene un API Secret
  React.useEffect(() => {
    const checkApiSecret = async () => {
      try {
        const response = await userService.hasApiSecret(auth)
        setHasAPISecret(response.data.hasSecret)
      } catch (error: any) {
        showErrorToast('Error al verificar API Secret', error.message)
      }
    }

    const getApiId = async () => {
      try {
        const response = await userService.getAPIId(auth)
        setApiId(response.data.apiId)
      } catch (error: any) {
        showErrorToast('Error al obtener API ID', error.message)
      }
    }

    getApiId()

    checkApiSecret()
  }, [])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="bg-background h-full w-full items-center gap-4 p-4">
        <View className="w-full">
          <Text className="text-sm color-muted-foreground pl-4 ">
            OBTENER API SECRET
          </Text>
          {loading && <ActivityIndicator color="#000000" />}
          <Card className="w-full h-auto">
            <CardContent className="gap-4">
              <Label htmlFor="newName">
                <Text>API Id</Text>
              </Label>
              <View className="w-full flex-row items-center justify-between">
                  <Text className="text-sm text-muted-foreground font-mono px-2 py-1 bg-muted rounded flex-1 mr-2">
                    {apiId}
                  </Text>
                  <Button onPress={copyIdToClipboard} variant={undefined}>
                    <Text>Copiar</Text>
                  </Button>
                </View>
              <Label htmlFor="newName">
                <Text>Generar Secret</Text>
              </Label>
              {hasAPISecret ? (
                <View className="w-full flex-row items-center justify-between">
                  <Text className="text-sm text-muted-foreground font-mono px-2 py-1 bg-muted rounded flex-1 mr-2">
                    {apiSecret || '***************'}
                  </Text>
                  <Button onPress={copySecretToClipboard} variant={undefined} disabled={!apiSecret}>
                    <Text>Copiar</Text>
                  </Button>
                </View>
              ) : null}
              <Button
                disabled={loading}
                className="mt-[10px]"
                onPress={generateSecret}
              >
                {loading ? (
                  <ActivityIndicator color="#000000" />
                ) : (
                  <Text>{hasAPISecret? "Regenerar Secret" : "Generar Secret"}</Text>
                )}
              </Button>
              <Button onPress={handleDeleteSecret} variant={'destructive'}>
                <Trash2 size={20} color="white" />
                <Text>Eliminar Secret</Text>
              </Button>
            </CardContent>
          </Card>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
