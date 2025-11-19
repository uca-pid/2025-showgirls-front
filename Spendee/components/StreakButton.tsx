import { Text } from '@/components/ui/text'
import { useAuth } from '@/context/AuthContext'
import useStreak from '@/hooks/useStreak'
import { getStreakAnimation } from '@/lib/streakFiles'
import { router } from 'expo-router'
import LottieView from 'lottie-react-native'
import React from 'react'
import { Pressable, View } from 'react-native'

const StreakButton = () => {
  const { user } = useAuth()
  const { streakData } = useStreak(user?.uid ?? '')
  const streakAnimationFile = getStreakAnimation(streakData)

  return (
    <Pressable
      onPress={() => {
        router.push('/streak')
      }}
    >
      <View className="items-center">
        <LottieView
          source={streakAnimationFile}
          autoPlay
          loop
          style={{ width: 50, height: 50 }}
          colorFilters={[]}
        />
        <Text>{streakData?.rachaActual ?? 0}</Text>
        <Text>{streakData?.lastActiveDate}</Text>
      </View>
    </Pressable>
  )
}

export default StreakButton
