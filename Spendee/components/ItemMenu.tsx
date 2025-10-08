import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { LucideIcon, Pencil } from 'lucide-react-native'

export interface IconButtonProps {
  text: string
  icon: LucideIcon
  onPress?: () => void
  color: string
  editable?: boolean
  gasto?: number
  onEdit?: () => void
}

const ItemMenu = ({
  text,
  icon: Icon,
  onPress,
  color,
  editable,
  gasto,
  onEdit,
}: IconButtonProps) => {
  return (
    <View className="flex-row items-center bg-foreground px-4 py-3 rounded-2xl gap-3">
      <Pressable onPress={onPress} className="flex-1">
        <View className="flex-row items-center gap-2">
          <Icon color={color} />
          <View className="flex-1 flex-row items-center gap-2">
            <Text className="text-lg flex-1" numberOfLines={1}>
              {text}
            </Text>
            {editable && (
              <Pressable
                onPress={(event) => {
                  event.stopPropagation?.()
                  onEdit?.()
                }}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={`Editar ${text}`}
              >
                <Pencil size={18} color="gray" />
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
      <View className="px-3 py-1 rounded-full bg-secondary/20 min-w-[70px] items-end">
        <Text className="text-base font-medium">${gasto ?? 0}</Text>
      </View>
    </View>
  )
}

export default ItemMenu
