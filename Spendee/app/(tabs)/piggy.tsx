import ItemCard from '@/components/ItemCard'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/context/AuthContext'
import useLevel from '@/hooks/useLevel'
import LottieView from 'lottie-react-native'
import React from 'react'
import { FlatList, View } from 'react-native'

const Piggy = () => {
  const { user } = useAuth()
  const { levelData, objectiveData } = useLevel(user?.uid ?? '')
  return (
    <View className="items-center">
      <LottieView
        source={require('@/assets/lottie/Piggy Bank - Coins Out.json')}
        autoPlay
        loop={false}
        style={{ width: 250, height: 250 }}
      />
      <Text className="text-lg font-semibold">Nivel: {levelData?.level}</Text>
      <FlatList
        data={Array.isArray(objectiveData) ? (objectiveData as any[]) : []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ItemCard
            title={`Objetivo: ${item.id.toString()}`}
            description={item.descripcion}
          />
        )}
      />
    </View>
  )
}

export default Piggy
