import { Text } from '@/components/ui/text'
import { LucideIcon } from 'lucide-react-native'
import React, { PropsWithChildren } from 'react'
import { Pressable, View } from 'react-native'
import Container from './Container'
import DollarSignSpinner from './ui/DollarSignSpinner'
import { Icon } from './ui/icon'

const Section = ({
  children,
  onActionPress,
  title,
  actionText,
  actionIcon,
  activity,
  className = '',
  showWhen = true,
}: PropsWithChildren & {
  onActionPress?: () => void
  title?: string
  actionText?: string
  actionIcon?: LucideIcon
  activity?: boolean
  className?: string
  showWhen?: boolean
}) => {
  return (
    <>
      {activity ? (
        <Container>
          <DollarSignSpinner />
        </Container>
      ) : showWhen ? (
        <View className={`gap-4 w-full ${className}`}>
          {title && (
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl text-left">{title}</Text>
              <Pressable onPress={onActionPress}>
                <View className="flex-row items-center gap-1">
                  <Text className="text-muted-foreground text-base text-right">
                    {actionText}
                  </Text>
                  {actionIcon && (
                    <Icon as={actionIcon} size={20} color="gray" />
                  )}
                </View>
              </Pressable>
            </View>
          )}
          {children}
        </View>
      ) : null}
    </>
  )
}

export default Section
