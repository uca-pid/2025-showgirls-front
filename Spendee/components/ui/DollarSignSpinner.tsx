import { CircleDollarSign } from 'lucide-react-native'
import React from 'react'
import { View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

export default function DollarSignSpinner() {
  const rotation = useSharedValue(0)

  React.useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(720, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withDelay(1000, withTiming(0, { duration: 0 })),
      ),
      -1,
      false,
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value % 360}deg` }],
  }))

  return (
    <View>
      <Animated.View style={animatedStyle}>
        <CircleDollarSign size={48} color="gray" />
      </Animated.View>
    </View>
  )
}
