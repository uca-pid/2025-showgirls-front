import {
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import Modal from 'react-native-modal'
import React, { useState } from 'react'
import { Text } from '@/components/ui/text'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Toast from 'react-native-toast-message'
import { Trash2 } from 'lucide-react-native'
import userService from '../services/user.service'
import { auth } from '../../firebase.config'

export default function EditProfilePage() {
  const [newName, setNewName] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)

  const showErrorToast = (title: string, description?: string) => {
    Toast.show({
      type: 'danger',
      text1: title,
      text2: description,
    })
  }

  function onSubmit() {
    !newName ? showErrorToast('Ingresá un nombre') : editName(newName)
  }

  async function editName(newName: string) {
    setLoading(true)
    await userService.update(auth, newName)
    setLoading(false)
  }

  async function deleteAccount() {
    setLoading(true)
    await userService.delete(auth)
    setLoading(false)
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="bg-background h-full w-full items-center gap-4 p-4">
        <Modal
          isVisible={showModal}
          animationIn="fadeIn"
          animationOut="fadeOut"
          useNativeDriver
          useNativeDriverForBackdrop
          onBackdropPress={() => setShowModal(false)}
          backdropTransitionOutTiming={1}
        >
          <Card className="justify-between items-center h-auto m-auto w-[90%] p-4">
            <Text className="text-2xl font-bold self-start">
              Eliminar cuenta
            </Text>
            <Text className="text-m text-muted-foreground self-start">
              Esta acción es irreversible, ¿estás seguro que querés eliminar tu
              cuenta?
            </Text>
            <View className="gap-2 w-full">
              <Button
                onPress={() => {
                  setShowModal(false)
                  deleteAccount()
                }}
                variant={'destructive'}
              >
                <Text>Estoy seguro, eliminar cuenta</Text>
              </Button>
            </View>
          </Card>
        </Modal>
        <View className="w-full">
          <Text className="text-sm color-muted-foreground pl-4 ">
            CAMBIAR NOMBRE
          </Text>
          <Card className="w-full h-auto">
            <CardContent className="gap-4">
              <Label htmlFor="newName">
                <Text>Nuevo nombre</Text>
              </Label>
              <Input
                id="newName"
                placeholder="Nombre"
                onChangeText={setNewName}
              />
              <Button
                disabled={loading}
                className="mt-[10px]"
                onPress={onSubmit}
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
        {/**
         * 
        <View className="w-full ">
          <Text className="text-sm text- color-muted-foreground pl-4 ">
            COLORES
          </Text>
          <Card className="w-full h-auto p-4">
            <CardContent className="flex-row gap-x-3 flex-wrap gap-y-4 justify-center">
              <View className="h-[50px] w-[50px] bg-[#b28bcb] rounded-xl" />
              <View className="h-[50px] w-[50px] bg-[#6ca2da] rounded-xl" />
              <View className="h-[50px] w-[50px] bg-[#51b399] rounded-xl" />
              <View className="h-[50px] w-[50px] bg-[#4f46e5] rounded-xl" />
              <View className="h-[50px] w-[50px] bg-[#7caf74] rounded-xl" />
              <View className="h-[50px] w-[50px] bg-[#aca153] rounded-xl" />
              <View className="h-[50px] w-[50px] bg-[#ce8e5f] rounded-xl" />
              <View className="h-[50px] w-[50px] bg-[#d2849c] rounded-xl" />
            </CardContent>
          </Card>
        </View>
              */}
        <View className="w-full ">
          <Text className="text-sm text- color-muted-foreground pl-4 ">
            ELIMINAR CUENTA
          </Text>
          <Card className="w-full h-auto">
            <CardContent className="gap-4">
              <Text className="text-m text-muted-foreground">
                Esta acción es irreversible
              </Text>
              <Button
                onPress={() => setShowModal(true)}
                variant={'destructive'}
              >
                <Trash2 size={20} color="white" />
                <Text>Eliminar cuenta</Text>
              </Button>
            </CardContent>
          </Card>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
