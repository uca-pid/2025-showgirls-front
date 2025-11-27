import React from 'react'
import { Modal, View, Pressable } from 'react-native'
import { Text } from '@/components/ui/text'
import { Lock } from 'lucide-react-native'
import usePiggy from '@/hooks/usePiggy'
import { useColorScheme } from 'nativewind'
import { AVAILABLE_COLORS, AppColor } from '@/theme/colors'
import useThemeColor from '@/theme/useThemeColor'

const COLORS = AVAILABLE_COLORS
const COLOR_KEYS = Object.keys(COLORS) as AppColor[]

interface ColorModalProps {
  visible: boolean
  onClose: () => void
}

export default function ColorModal({ visible, onClose }: ColorModalProps) {
  const { colorHex } = useThemeColor()
  const { piggyData, level, refetch } = usePiggy()
  const selectedColor = 0
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
          <View className="flex-row flex-wrap justify-between">
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
                      backgroundColor: COLORS[colorKey],
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
