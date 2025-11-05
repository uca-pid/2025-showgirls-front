import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react-native'
import React from 'react'
import { Pressable, Text, View } from 'react-native'

export interface IconButtonProps {
  text?: string
  textColor?: string
  icon: LucideIcon
  iconColor?: string
  onPress?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const IconButton = ({
  text,
  textColor = 'black',
  icon: Icon,
  iconColor = '#F9A8D4',
  onPress,
  className,
  size = 'lg',
}: IconButtonProps) => {
  return (
    <View className={`flex-col items-center ${text ? 'w-[100px]' : ''}`}>
      <Pressable onPress={onPress} className="items-center">
        <View
          className={cn(
            `${size === 'sm' || size === 'md' ? 'p-3' : 'p-4'} rounded-full ${text && 'mb-2'}`,
            className,
          )}
          style={{ backgroundColor: `${iconColor}30` }}
        >
          <Icon
            color={iconColor}
            size={size === 'sm' ? 15 : size === 'md' ? 22 : 26}
          />
        </View>
        {text && (
          <Text className={`text-${textColor}`} numberOfLines={1}>
            {text}
          </Text>
        )}
      </Pressable>
    </View>
  )
}

export default IconButton
