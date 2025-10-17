import { LucideIcon } from 'lucide-react-native'
import React from 'react'
import { View } from 'react-native'
import IconButton from './IconButton'

export interface IconMenuProps {
  text: string
  textColor: string
  icon: LucideIcon
  onPress?: () => void
}

const IconMenu = ({ actions }: { actions: IconMenuProps[] }) => {
  return (
    <View className="flex-col gap-4 px-2 justify-evenly items-center w-full flex-wrap">
      {actions.map((action) => (
        <IconButton
          key={action.text}
          text={action.text}
          textColor={action.textColor}
          icon={action.icon}
          onPress={action.onPress}
        />
      ))}
    </View>
  )
}

export default IconMenu
