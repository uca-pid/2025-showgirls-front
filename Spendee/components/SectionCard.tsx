import { cn } from '@/lib/utils'
import React, { PropsWithChildren } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { Card } from './ui/card'

const SectionCard = ({
  children,
  activity,
  onPress,
  justify = 'center',
  items = 'center',
  flex = 'col',
  className,
  containerClassName,
}: PropsWithChildren & {
  activity?: boolean
  onPress?: () => void
  justify?: 'center' | 'between' | 'around' | 'evenly' | 'end'
  items?: 'center' | 'start' | 'end'
  flex?: 'row' | 'col'
  className?: string
  containerClassName?: string
}) => {
  return (
    <Card
      className={cn(
        'w-full border-0 rounded-[30px] p-6 justify-center',
        className,
      )}
      onPress={onPress}
    >
      {activity ? (
        <ActivityIndicator className="self-center" size={48} color="white" />
      ) : (
        <View
          className={cn(
            `flex-${flex} items-${items} justify-${justify} gap-4 flex-wrap`,
            containerClassName,
          )}
          style={{ width: '100%', flexShrink: 1, flexGrow: 1 }}
        >
          {children}
        </View>
      )}
    </Card>
  )
}

export default SectionCard
