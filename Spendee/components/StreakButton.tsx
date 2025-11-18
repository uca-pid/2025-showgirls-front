import { View, Pressable } from 'react-native'
import { Text } from '@/components/ui/text'
import React, { use } from 'react'
import { router } from 'expo-router'
import LottieView from 'lottie-react-native'
import useStreak from '@/hooks/useStreak'
import { useAuth } from '@/context/AuthContext'

const StreakButton = () => {
  const { user } = useAuth()
  const { streakData, refetch, isLoading } = useStreak(user?.uid ?? '')
  const rachaActual = streakData?.data.rachaActual ?? 0
  return (
    <View>
      <Pressable
        onPress={() => {
          router.push('/streak')
        }}
      >
        <View className="items-center">
          <LottieView
            source={require('@/assets/lottie/Fire animation.json')}
            autoPlay
            loop
            style={{ width: 50, height: 50 }}
          />
          <Text>{rachaActual}</Text>
        </View>
      </Pressable>
    </View>
  )
}

export default StreakButton
