import { View, Pressable } from 'react-native'
import React from 'react'
import { ChevronRight, Ellipsis, LucideIcon, Pencil } from 'lucide-react-native'
import { router } from 'expo-router'
import { Badge } from './ui/badge'
import { Text } from './ui/text'

export interface ItemButtonProps {
  text: string
  background?: 'background' | 'foreground'
  badgeText?: string
  onPress?: () => void
  iconLeft?: LucideIcon
  iconLeftColor?: string
  iconRight?: LucideIcon
  iconRightColor?: string
  editable?: boolean
  borderBottom?: boolean
}

const ItemButton = ({
  text,
  background = 'foreground',
  badgeText,
  onPress,
  iconLeft: IconLeft = Ellipsis,
  iconLeftColor = 'black',
  iconRight: IconRight = ChevronRight,
  iconRightColor = 'black',
  editable,
  borderBottom = false,
}: ItemButtonProps) => {
  return (
    <Pressable onPress={onPress}>
      <View
        className={`flex-row items-center p-2 ${borderBottom ?? 'border-b-[1px] border-zinc-700'}`}
      >
        <View
          className={`pr-8 bg-${background} flex-row items-center gap-4 flex-1 `}
        >
          <IconLeft color={iconLeftColor} />
          <Text className="text-lg">{text}</Text>
          {editable && (
            <Pencil
              size={18}
              color="gray"
              onPress={() => router.push('/category/edit-category')}
            />
          )}
        </View>
        <View className="flex-row gap-2">
          {badgeText && (
            <Badge variant="secondary">
              <Text>{badgeText}</Text>
            </Badge>
          )}
          <IconRight color={iconRightColor} />
        </View>
      </View>
    </Pressable>
  )
}

export default ItemButton
