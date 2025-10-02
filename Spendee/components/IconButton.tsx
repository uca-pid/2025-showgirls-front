import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { LucideIcon } from 'lucide-react-native'
import { cn } from '@/lib/utils'

export interface IconButtonProps {
  text: string
  icon: LucideIcon
  onPress?: () => void
  className?: string
}

const IconButton = ({
  text,
  icon: Icon,
  onPress,
  className,
}: IconButtonProps) => {
  return (
    <View className="flex-col items-center">
      <Pressable onPress={onPress} className="items-center">
        <View className={cn('p-4 rounded-full bg-pink-100 mb-2', className)}>
          <Icon color={'#F9A8D4'} />
        </View>
        <Text>{text}</Text>
      </Pressable>
    </View>
  )
}

export default IconButton
