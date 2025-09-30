import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { LucideIcon } from 'lucide-react-native'

export interface IconButtonProps {
  text: string
  icon: LucideIcon
  onPress?: () => void
}

const IconButton = ({ text, icon: Icon, onPress }: IconButtonProps) => {
  return (
    <View className="flex-col items-center">
      <Pressable onPress={onPress} className="items-center">
        <View className="p-4 rounded-full bg-pink-100 mb-2">
          <Icon color={'#F9A8D4'} />
        </View>
        <Text>{text}</Text>
      </Pressable>
    </View>
  )
}

export default IconButton
