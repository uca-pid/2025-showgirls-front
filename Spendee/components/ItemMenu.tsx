import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { ChevronRight, LucideIcon, Pencil } from 'lucide-react-native'
import { Button } from './ui/button'
import { router } from 'expo-router'

export interface IconButtonProps {
  text: string
  icon: LucideIcon
  onPress?: () => void
  color: string
  editable?: boolean
  gasto?: number
}

const ItemMenu = ({
  text,
  icon: Icon,
  onPress,
  color,
  editable,
  gasto,
}: IconButtonProps) => {
  return (
    <Pressable onPress={onPress}>
      <View className="flex-row items-center">
        <View className="pr-8 bg-foreground flex-row items-center gap-4 flex-1">
          <Icon color={color} />
          <Text className="text-lg">{text}</Text>
          {editable && <Pencil size={18} color="gray" onPress={onPress} />}
          <Text>${gasto}</Text>
        </View>
        <ChevronRight size={22} color="black" />
      </View>
    </Pressable>
  )
}

export default ItemMenu
