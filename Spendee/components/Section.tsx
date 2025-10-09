import { LucideIcon } from 'lucide-react-native'
import React, { PropsWithChildren } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import SectionCard from './SectionCard'
import { Icon } from './ui/icon'

const Section = ({
  children,
  onActionPress,
  title,
  actionText,
  actionIcon,
  activity,
  className = '',
}: PropsWithChildren & {
  onActionPress?: () => void
  title?: string
  actionText?: string
  actionIcon?: LucideIcon
  activity?: boolean
  className?: string
}) => {
  return (
    <>
      {activity ? (
        <SectionCard>
          <ActivityIndicator size={24} color="gray" />
        </SectionCard>
      ) : (
        <View className={`gap-4 w-full ${className}`}>
          {title && (
            <View className="flex-row items-center justify-between">
              <Text className="text-white text-2xl text-left">{title}</Text>
              <Pressable onPress={onActionPress}>
                <View className="flex-row items-center gap-1">
                  <Text className="text-muted-foreground text-base text-right">
                    {actionText}
                  </Text>
                  {actionIcon && (
                    <Icon as={actionIcon} size={22} color="gray" />
                  )}
                </View>
              </Pressable>
            </View>
          )}
          {children}
        </View>
      )}
    </>
  )
}

export default Section
