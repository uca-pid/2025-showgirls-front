import { View, Text } from 'react-native'
import React from 'react'
import { ChevronRight, LucideIcon, Pencil } from 'lucide-react-native'
import { Button } from './ui/button'

export interface IconButtonProps {
  text: string
  icon: LucideIcon
  onPress?: () => void
  color: string
  selected: boolean
}

const ItemMenu = ({
  text,
  icon: Icon,
  onPress,
  color,
  selected,
}: IconButtonProps) => {
  return selected ? (
    <View className="flex-row items-center">
      <View className="pr-8 bg-foreground flex-row items-center gap-4 flex-1">
        <Button>
          <Pencil size={18} color="gray" />
        </Button>
        <Icon color={color} />
        <Text className="text-lg">{text}</Text>
      </View>
      <ChevronRight size={22} color="black" />
    </View>
  ) : (
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
