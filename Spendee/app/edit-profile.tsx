import { Keyboard, TouchableWithoutFeedback, View } from "react-native"
import Modal from "react-native-modal"
import React, { useState } from "react"
import { Text } from "@/components/ui/text"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { initializeApp } from "firebase/app"
import { deleteUser, getAuth, updateProfile } from "firebase/auth"
import Toast from "react-native-toast-message"
import { Redirect, router } from "expo-router"
import { Trash2 } from "lucide-react-native"

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

const EditProfilePage = () => {
  const [newName, setNewName] = useState<string>("")
  const [showModal, setShowModal] = useState<boolean>(false)

  const showErrorToast = (title: string, description?: string) => {
    Toast.show({
      type: "danger",
      text1: title,
      text2: description,
    })
  }
  const showSuccessToast = (title: string, description?: string) => {
    Toast.show({
      type: "success",
      text1: title,
      text2: description,
    })
  }

  function onSubmit() {
    !newName ? showErrorToast("Ingresá un nombre") : editName(newName)
  }

  function editName(newName: string) {
    if (auth.currentUser) {
      updateProfile(auth.currentUser, {
        displayName: newName,
      })
        .then(() => {
          showSuccessToast("Perfil actualizado")
          router.replace("/profile")
        })
        .catch((error) => {
          showErrorToast("Error al actualizar perfil")
        })
    }
  }

  function deleteAccount() {
    if (auth.currentUser) {
      deleteUser(auth.currentUser)
        .then(() => {
          showSuccessToast("Usuario eliminado")
          router.replace("/sign-in/SignInPage")
        })
        .catch((error) => {
          showErrorToast("Error al eliminar usuario")
        })
    }
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
                variant={"destructive"}
              >
                <Text>Estoy seguro, eliminar cuenta</Text>
              </Button>
            </View>
          </Card>
        </Modal>
        <View className="w-full ">
          <Text className="text-sm text- color-muted-foreground pl-4 ">
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
              <Button className="mt-[10px]" onPress={onSubmit}>
                <Text>Actualizar</Text>
              </Button>
            </CardContent>
          </Card>
        </View>
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
                variant={"destructive"}
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

export default EditProfilePage
