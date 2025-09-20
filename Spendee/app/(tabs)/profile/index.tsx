import React, { useEffect, useState } from 'react'
import { View, FlatList, Alert, Pressable } from 'react-native'
import { Text } from '@/components/ui/text'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  BellDot,
  ChevronRight,
  Icon,
  LogOut,
  Settings,
  User2,
} from 'lucide-react-native'

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<{
    uid?: string
    displayName?: string
    email?: string
    photoURL?: string
  } | null>(null)

  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setProfile({
          uid: user.uid,
          displayName: user.displayName ?? '',
          email: user.email ?? '',
          photoURL: user.photoURL ?? '',
        })
      } else {
        router.replace('/sign-in')
      }
    })

    return () => unsubscribe()
  }, [])

  const DATA = [
    {
      title: 'Editar Perfil',
      description: profile?.email,
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
    // Real sign-out: clear storage, sign out from firebase if available, then navigate
    Alert.alert('Cerrar sesión', '¿Querés cerrar tu sesión?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          try {
            await SecureStore.deleteItemAsync('jwt')
            await AsyncStorage.removeItem('userProfile')
            // try firebase sign out if auth initialized
            try {
              const auth = getAuth()
              await auth.signOut()
            } catch (e) {
              // ignore if firebase not configured in this runtime
              console.warn('Firebase signOut threw:', e)
            }
          } catch (err) {
            console.error('Error clearing auth storage', err)
          } finally {
            router.replace('/sign-in')
          }
        },
      },
    ])
  }

  return (
    <View className="items-center justify-center bg-background h-full">
      {profile ? (
        <View className="items-center bg-primary relative h-[130px] w-screen">
          <Avatar
            alt={`${profile?.displayName}'s Avatar`}
            className="h-24 w-24 border-2 border-primary bg-black absolute top-[60%]"
          >
            <AvatarImage
              source={{
                uri: profile.photoURL
                  ? profile.photoURL
                  : 'https://github.com/mrzachnugent.png',
              }}
            />
            <AvatarFallback>
              <Text className="color-white">
                {profile.displayName?.charAt(0)}
              </Text>
            </AvatarFallback>
          </Avatar>
        </View>
      ) : (
        <Text>No hay datos de perfil almacenados.</Text>
      )}
      <Text className="text-lg font-semibold mt-[55px] boder-2 border-red-700">
        {profile?.displayName || 'Sin nombre'}
      </Text>
      <FlatList
        className="w-screen p-4"
        data={DATA}
        renderItem={({ item, index }) => (
          <Pressable onPress={item.action}>
            <Card
              className="rounded-none border-0 relative"
              style={
                index === 0 && DATA.length > 1
                  ? {
                      borderTopLeftRadius: 30,
                      borderTopRightRadius: 30,
                      borderTopWidth: 0,
                    }
                  : index === DATA.length - 1 && DATA.length > 1
                    ? {
                        borderBottomLeftRadius: 30,
                        borderBottomRightRadius: 30,
                      }
                    : DATA.length === 1
                      ? { borderRadius: 30 }
                      : {}
              }
              key={index}
            >
              {index !== 0 && DATA.length > 1 ? (
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
