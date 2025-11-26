import React from 'react'
import { Modal, View, Pressable, Image } from 'react-native'
import { Text } from '@/components/ui/text'
import { Lock } from 'lucide-react-native'
import usePiggy from '@/hooks/usePiggy'
import piggyService from '@/services/piggy.service'
import { useColorScheme } from 'nativewind'
import useThemeColor from '@/theme/useThemeColor'

const AVATARS = [
  require('@/assets/avatar/avatar1.jpg'),
  require('@/assets/avatar/avatar2.jpg'),
  require('@/assets/avatar/avatar3.jpg'),
  require('@/assets/avatar/avatar4.jpg'),
  require('@/assets/avatar/avatar5.jpg'),
  require('@/assets/avatar/avatar6.jpg'),
]

interface AvatarModalProps {
  visible: boolean
  onClose: () => void
}

export default function AvatarModal({ visible, onClose }: AvatarModalProps) {
  const { colorHex } = useThemeColor()
  const { piggyData, level, refetch } = usePiggy()
  const selectedAvatar = piggyData?.avatarId || 0

  const handleSelectAvatar = async (avatarId: number, unlocked: boolean) => {
    if (!unlocked) return

    try {
      await piggyService.updateAvatar(avatarId)
      await refetch()
      onClose()
    } catch (err) {
      console.log('Error updating avatar', err)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-primary p-6 rounded-2xl w-11/12">
          <Text
            style={{
              color:
                useColorScheme().colorScheme === 'dark' ? 'black' : 'white',
            }}
            className="text-xl text-center mb-4 text-black"
          >
            Elegí tu avatar
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {AVATARS.map((img, index) => {
              const avatarId = index
              const unlocked = avatarId === 0 || level >= avatarId
              const isSelected = avatarId === selectedAvatar
              return (
                <Pressable
                  key={index}
                  className="w-[30%] aspect-square m-1"
                  onPress={() => handleSelectAvatar(avatarId, unlocked)}
                >
                  <View
                    style={
                      isSelected
                        ? { borderWidth: 4, borderColor: colorHex }
                        : {}
                    }
                    className={`rounded-xl overflow-hidden justify-center items-center ${
                      unlocked ? 'opacity-100' : 'opacity-40'
                    }`}
                  >
                    <Image
                      source={img}
                      className="w-full h-full"
                      resizeMode="contain"
                    />

                    {!unlocked && (
                      <View className="absolute inset-0 bg-black/40 justify-center items-center">
                        <Lock color="white" size={30} />
                      </View>
                    )}
                  </View>
                </Pressable>
              )
            })}
          </View>

          <Pressable
            onPress={onClose}
            style={{ backgroundColor: colorHex }}
            className="mt-6 p-3 rounded-xl"
          >
            <Text className="text-center font-bold text-black">Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}
