import { View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'
import { Text } from '@/components/ui/text'

const Level = () => {
  return (
    <View className="items-center">
      <LottieView
        source={require('@/assets/lottie/Piggy Bank - Coins Out.json')}
        autoPlay
        loop={false}
        style={{ width: 250, height: 250 }}
      />
      <Text className="text-lg font-semibold">Nivel: </Text>
    </View>
  )
}

export default Level
