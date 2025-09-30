import { View, Text } from 'react-native'
import React from 'react'
import IconButton from './IconButton'
import { LucideIcon } from 'lucide-react-native'

export interface IconMenuProps {
  text: string
  icon: LucideIcon
  onPress?: () => void
}

const IconMenu = ({ actions }: { actions: IconMenuProps[] }) => {
  return (
    <View className="flex-row gap-4 px-2 justify-evenly items-center w-full flex-wrap">
      {actions.map((action) => (
        <IconButton
          key={action.text}
          text={action.text}
          icon={action.icon}
          onPress={action.onPress}
        />
      ))}
    </View>
  )
}

export default IconMenu
