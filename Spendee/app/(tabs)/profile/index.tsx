import React from 'react'
import { View, FlatList, Alert, Pressable } from 'react-native'
import { Text } from '@/components/ui/text'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { router } from 'expo-router'
import { ChevronRight, LogOut, User2 } from 'lucide-react-native'
import { auth } from '@/firebase.config'
import userService from '@/services/user.service'
import { useAuth } from '@/context/AuthContext'
import IconButton from '@/components/IconButton'
import ItemCard from '@/components/ItemCard'

export default function ProfilePage() {
  const { user } = useAuth()

  const menuItems = [
    {
      title: 'Editar Perfil',
      description: user !== null && user.email ? user.email : '',
      icon: User2,
      action: () => router.push('../edit-profile'),
    },

    {
      title: 'Cerrar Sesión',
      description: 'Salir de la cuenta',
      icon: LogOut,
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
        <View className="items-center relative border-b border-muted border-30 h-[130px] w-screen">
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
          <ItemCard
            title={item.title}
            description={item.description}
            icon={item.icon}
            onPress={item.action}
          />
        )}
      />
    </View>
  )
}
