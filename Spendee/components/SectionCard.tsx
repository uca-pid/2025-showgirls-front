import React, { PropsWithChildren } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { Card } from './ui/card'

const SectionCard = ({
  children,
  activity,
  onPress,
  justify = 'center',
  flex = 'col',
  className,
}: PropsWithChildren & {
  activity?: boolean
  onPress?: () => void
  justify?: 'center' | 'between' | 'around' | 'evenly' | 'end'
  flex?: 'row' | 'col'
  className?: string
}) => {
  return (
    <Card
      className="w-full border-0 rounded-[30px] p-6 justify-center"
      onPress={onPress}
    >
      {activity ? (
        <ActivityIndicator className="self-center" size={48} color="white" />
      ) : (
        <View
          className={`flex-${flex} items-center justify-${justify} gap-4 ${className}`}
        >
          {children}
        </View>
      )}
    </Card>
  )
}

export default SectionCard
