import ItemCard from '@/components/ItemCard'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/context/AuthContext'
import { auth } from '@/firebase.config'
import userService from '@/services/user.service'
import { router } from 'expo-router'
import { LogOut, User2 } from 'lucide-react-native'
import React, { useState } from 'react'
import { Alert, FlatList, Pressable, View } from 'react-native'
import AvatarModal from '@/components/ModalAvatar'
import { TouchableOpacity } from 'react-native'
import usePiggy from '@/hooks/usePiggy'
import { Button } from '@/components/ui/button'
import ModalColor from '@/components/ModalColor'
import useThemeColor from '@/theme/useThemeColor'

export default function ProfilePage() {
  const { user } = useAuth()
  const [modalVisible, setModalVisible] = useState(false)
  const [colorModalVisible, setColorModalVisible] = useState(false)
  const { piggyData } = usePiggy()
  const { colorHex } = useThemeColor()
  const AVATAR_IMAGES: Record<number, any> = {
    1: require('@/assets/avatar/avatar1.jpg'),
    2: require('@/assets/avatar/avatar2.jpg'),
    3: require('@/assets/avatar/avatar3.jpg'),
    4: require('@/assets/avatar/avatar4.jpg'),
    5: require('@/assets/avatar/avatar5.jpg'),
    6: require('@/assets/avatar/avatar6.jpg'),
  }
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
        <Pressable
          onPress={() => setColorModalVisible(true)}
          style={{ backgroundColor: colorHex }}
          className="items-center relative border-b border-muted border-30 h-[130px] w-screen"
        >
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="w-24 h-24"
          >
            <Avatar
              alt="avatar"
              className="h-24 w-24 border-2 border-primary top-20"
            >
              <AvatarImage source={AVATAR_IMAGES[piggyData?.avatarId || 1]} />
            </Avatar>
          </TouchableOpacity>
        </Pressable>
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
      <AvatarModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <ModalColor
        visible={colorModalVisible}
        onClose={() => setColorModalVisible(false)}
      />
    </View>
  )
}
