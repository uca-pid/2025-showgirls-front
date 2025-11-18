import { View } from 'react-native'
import { Text } from '@/components/ui/text'
import React from 'react'
import { useAuth } from '@/context/AuthContext'
import useStreak from '@/hooks/useStreak'

const Streak = () => {
  const { user } = useAuth()
  const streak = useStreak(user?.uid ?? '')
  return (
    <View>
      <Text>Streak</Text>
    </View>
  )
}

export default Streak
