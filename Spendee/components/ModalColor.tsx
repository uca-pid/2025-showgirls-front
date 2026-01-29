import { Text } from '@/components/ui/text'
import usePiggy from '@/hooks/usePiggy'
import { AVAILABLE_COLORS, AppColor } from '@/theme/colors'
import useThemeColor from '@/theme/useThemeColor'
import { Lock } from 'lucide-react-native'
import { useColorScheme } from 'nativewind'
import React from 'react'
import { Modal, Pressable, View } from 'react-native'

const COLOR_KEYS = Object.keys(AVAILABLE_COLORS) as AppColor[]

interface ColorModalProps {
  visible: boolean
  onClose: () => void
}

export default function ColorModal({ visible, onClose }: ColorModalProps) {
  const { colorHex } = useThemeColor()
  const { level } = usePiggy()
  const { color, setColor } = useThemeColor()

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
            Elegí un color
          </Text>
          <Text className="mb-4 text-center text-muted-foreground">
            Subí de nivel para desbloquear más colores
          </Text>
          <View className="flex-row flex-wrap justify-center gap-1">
            {COLOR_KEYS.map((colorKey, index) => {
              const colorId = index
              const unlocked = colorId === 0 || level >= colorId
              const isSelected = colorKey === color
              return (
                <Pressable
                  key={colorKey}
                  onPress={() => {
                    if (!unlocked) return
                    setColor(colorKey)
                    onClose()
                  }}
                >
                  <View
                    className="w-[50px] h-[50px] rounded-full"
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 999,
                      backgroundColor: AVAILABLE_COLORS[colorKey],
                      borderWidth: isSelected ? 2 : 0,
                      borderColor: isSelected ? 'gray' : 'white',
                    }}
                  />
                  {!unlocked && (
                    <View className="absolute inset-0 bg-black/40 justify-center items-center rounded-full">
                      <Lock color="white" size={30} />
                    </View>
                  )}
                </Pressable>
              )
            })}
          </View>

          <Pressable
            onPress={onClose}
            style={{ backgroundColor: colorHex }}
            className="mt-6 p-3 rounded-xl"
          >
            <Text className="text-center font-bold text-white">Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}
