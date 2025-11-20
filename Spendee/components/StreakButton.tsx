import { Text } from '@/components/ui/text'
import { useAuth } from '@/context/AuthContext'
import useStreak from '@/hooks/useStreak'
import { getStreakAnimation } from '@/lib/streakFiles'
import { router } from 'expo-router'
import LottieView from 'lottie-react-native'
import React from 'react'
import { Pressable, View } from 'react-native'

type StreakButtonProps = {
  size?: number
  showStreak?: boolean
}

const StreakButton = ({ size = 50, showStreak = true }: StreakButtonProps) => {
  const { user } = useAuth()
  const { streakData } = useStreak(user?.uid ?? '')
  const streakAnimationFile = getStreakAnimation(streakData)
  const COMPLETE_ANIMATION_FRAME = 0.39
  return (
    <Pressable
      onPress={() => {
        router.push('/streak')
      }}
    >
      <View className="items-center">
        {streakData && (
          <>
            <LottieView
              source={streakAnimationFile}
              loop={!streakData?.isInactive}
              autoPlay={!streakData?.isInactive}
              progress={streakData.isInactive ? COMPLETE_ANIMATION_FRAME : 1}
              style={{ width: size, height: size }}
            />
            {showStreak && <Text>{streakData?.rachaActual}</Text>}
          </>
        )}
      </View>
    </Pressable>
  )
}

export default StreakButton
