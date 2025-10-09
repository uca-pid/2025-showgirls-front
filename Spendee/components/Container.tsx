import React, { PropsWithChildren } from 'react'
import { ScrollView } from 'react-native'

const Container = ({ children }: PropsWithChildren) => {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      className="w-screen h-screen"
      contentContainerClassName="align-center items-center gap-4 p-6 pb-[100px]"
    >
      {children}
    </ScrollView>
  )
}

export default Container
