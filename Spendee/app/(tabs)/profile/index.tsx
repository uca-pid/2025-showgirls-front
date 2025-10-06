import React from 'react'
import { View, FlatList, Alert, Pressable } from 'react-native'
import { Text } from '@/components/ui/text'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { router } from 'expo-router'
import { ChevronRight, LogOut, User2 } from 'lucide-react-native'
import { auth } from '@/firebase.config'
import userService from '@/services/user.service'

export default function ProfilePage() {
  const user = auth.currentUser

  const menuItems = [
    {
      title: 'Editar Perfil',
      description: user?.email,
      icon: <User2 size={25} color="white" />,
      action: () => router.push('../edit-profile'),
    },
    /**
     * 
    {
      title: "Notificaciones",
      description: "Mute",
      icon: <BellDot size={25} color="white" />,
    },
    {
      title: "Configuración",
      description: "Seguridad, Privacidad",
      icon: <Settings size={25} color="white" />,
    },
    */
    {
      title: 'Cerrar Sesión',
      description: 'Salir de la cuenta',
      icon: <LogOut size={25} color="white" />,
      action: () => handleSignOut(),
      variant: 'destructive',
    },
  ]

  const handleSignOut = () => {
    Alert.alert('Cerrar sesión', '¿Querés cerrar tu sesión?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: () => userService.signOut(auth),
      },
    ])
  }

  return (
    <View className="items-center justify-center bg-background h-full">
      {user ? (
        <View className="items-center bg-primary relative h-[130px] w-screen">
          <Avatar
            alt={`${user?.displayName}'s Avatar`}
            className="h-24 w-24 border-2 border-primary bg-black absolute top-[60%]"
          >
            <AvatarImage
              source={{
                uri: user.photoURL
                  ? user.photoURL
                  : 'https://github.com/mrzachnugent.png',
              }}
            />
            <AvatarFallback>
              <Text className="color-white">{user.displayName?.charAt(0)}</Text>
            </AvatarFallback>
          </Avatar>
        </View>
      ) : (
        <Text>No hay datos de perfil almacenados.</Text>
      )}
      <Text className="text-lg font-semibold mt-[55px] boder-2 border-red-700">
        {user?.displayName || 'Sin nombre'}
      </Text>
      <FlatList
        className="w-screen p-4"
        data={menuItems}
        renderItem={({ item, index }) => (
          <Pressable onPress={item.action}>
            <Card
              className="rounded-none border-0 relative"
              style={
                index === 0 && menuItems.length > 1
                  ? {
                      borderTopLeftRadius: 30,
                      borderTopRightRadius: 30,
                      borderTopWidth: 0,
                    }
                  : index === menuItems.length - 1 && menuItems.length > 1
                    ? {
                        borderBottomLeftRadius: 30,
                        borderBottomRightRadius: 30,
                      }
                    : menuItems.length === 1
                      ? { borderRadius: 30 }
                      : {}
              }
              key={index}
            >
              {index !== 0 && menuItems.length > 1 ? (
                <View className="absolute border-t-[1.2px] border-secondary w-[90%] top-0 left-[5%]"></View>
              ) : (
                <></>
              )}
              <CardContent className="flex-row justify-between items-center">
                {item.icon}
                <View className="w-4/5 pl-4">
                  <Text className="text-lg font-medium">{item.title}</Text>
                  <Text className="color-gray-500">{item.description}</Text>
                </View>
                <ChevronRight size={22} color="white" />
              </CardContent>
            </Card>
          </Pressable>
        )}
      />
    </View>
  )
}
