import { LucideIcon } from 'lucide-react-native'
import React, { useEffect } from 'react'
import { useColorScheme, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { Text } from './ui/text'

export interface AppToastProps {
  message: string
  icon: LucideIcon
  type?: 'error' | 'success' | 'info'
}

const AppToast = ({ message, icon: Icon, type = 'error' }: AppToastProps) => {
  const colorScheme = useColorScheme()
  const top = useSharedValue(-100)
  const color =
    type === 'error' ? 'red' : type === 'success' ? 'green' : '#2F86EB'

  useEffect(() => {
    top.value = withSequence(
      withTiming(55, { duration: 300 }),
      withDelay(3000, withTiming(-100, { duration: 500 })),
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    top: top.value,
  }))

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: '5%',
          width: '90%',
          height: 75,
          padding: 16,
          borderRadius: 8,
          borderLeftWidth: 6,
          borderLeftColor: color,
          backgroundColor: colorScheme === 'dark' ? '#161616' : 'white',
          shadowColor: colorScheme === 'dark' ? 'black' : undefined,
          shadowRadius: 5,
          shadowOpacity: 0.2,
          justifyContent: 'center',
          zIndex: 9999,
          elevation: 9999,
        },
        animatedStyle,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Icon color={color} />
        <Text
          className="w-[90%] h-full"
          numberOfLines={2}
          variant="p"
          style={{
            color: color,
            fontWeight: 300,
          }}
        >
          {message}
        </Text>
      </View>
    </Animated.View>
  )
}

export default AppToast
