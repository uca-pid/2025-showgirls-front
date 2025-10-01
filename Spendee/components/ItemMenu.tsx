import { View, Text } from 'react-native'
import React from 'react'
import { ChevronRight, LucideIcon } from 'lucide-react-native'

export interface IconButtonProps {
  text: string
  icon: LucideIcon
  onPress?: () => void
  color: string
}

const ItemMenu = ({ text, icon: Icon, onPress, color }: IconButtonProps) => {
  return (
    <View className="flex-row items-center">
      <View className="pr-8 bg-foreground flex-row items-center gap-4 flex-1">
        <Icon color={color} />
        <Text className="text-lg">{text}</Text>
      </View>
      <ChevronRight size={22} color="black" />
    </View>
  )
}

export default ItemMenu
