import React, { PropsWithChildren } from 'react'
import { RefreshControl, ScrollView } from 'react-native'
import DollarSignSpinner from './ui/DollarSignSpinner'

const Container = ({
  children,
  refreshControl,
  activity = false,
  scrollEnabled = true,
}: PropsWithChildren & {
  refreshControl?: React.ReactElement<
    React.ComponentProps<typeof RefreshControl>
  >
  activity?: boolean
  scrollEnabled?: boolean
}) => {
  return (
    <ScrollView
      scrollEnabled={scrollEnabled}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      className="w-screen h-screen"
      contentContainerClassName="align-center items-center gap-8 p-6 pb-[100px]"
    >
      {activity ? <DollarSignSpinner /> : children}
    </ScrollView>
  )
}

export default Container
