import { Text } from '@/components/ui/text'
import { getStreakAnimation } from '@/lib/streakFiles'
import { StreakResponse } from '@/services/streak.service'
import { router } from 'expo-router'
import LottieView from 'lottie-react-native'
import React from 'react'
import { ActivityIndicator, Pressable, View } from 'react-native'

type StreakButtonProps = {
  streak: StreakResponse | undefined
  size?: number
  showStreak?: boolean
  speed?: number
}

const StreakButton = ({
  size = 50,
  showStreak = true,
  speed = 1,
  streak,
}: StreakButtonProps) => {
  const COMPLETE_ANIMATION_FRAME = 0.39
  if (streak) {
    var streakAnimation = getStreakAnimation(streak)
    return (
      <Pressable
        onPress={() => {
          router.push('/streak')
        }}
      >
        <View className="items-center">
          {streak && (
            <>
              <LottieView
                renderMode="HARDWARE"
                speed={speed}
                source={streakAnimation?.animation}
                loop={!streak?.isInactive}
                autoPlay={!streak?.isInactive}
                progress={streak.isInactive ? COMPLETE_ANIMATION_FRAME : 1}
                style={{ width: size, height: size }}
              />
              {showStreak && <Text>{streak?.rachaActual}</Text>}
            </>
          )}
        </View>
      </Pressable>
    )
  } else {
    return <ActivityIndicator />
  }
}

export default StreakButton
