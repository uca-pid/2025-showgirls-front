import { FlatList, Pressable, View } from 'react-native'
import React, { useRef } from 'react'
import LottieView from 'lottie-react-native'
import { Text } from '@/components/ui/text'
import ItemCard from '@/components/ItemCard'
import usePiggy from '@/hooks/usePiggy'

const Piggy = () => {
  const { piggyData } = usePiggy()
  const animationRef = useRef<any>(null)
  const level = piggyData?.xp ? Math.floor(piggyData.xp / 5) : 0

  const playAnimation = () => {
    animationRef.current?.reset()
    animationRef.current?.play()
  }
  return (
    <View className="items-center">
      <Pressable onPress={playAnimation}>
        <LottieView
          ref={animationRef}
          source={require('@/assets/lottie/Piggy Bank - Coins Out.json')}
          autoPlay={false}
          loop={false}
          style={{ width: 250, height: 250 }}
        />
      </Pressable>
      <Text className="text-lg font-semibold">{piggyData?.nombre}</Text>
      <Text className="text-lg font-semibold">XP: {piggyData?.xp}</Text>
      <Text className="text-lg font-semibold">Nivel: {level}</Text>
      <FlatList
        data={piggyData?.objetivos || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ItemCard
            title={`Objetivo: ${item?.objetivo.descripcion}`}
            description={`Progreso: ${((item.progreso / item?.objetivo.maxProgreso) * 100).toFixed(2)}%`}
          />
        )}
      />
    </View>
  )
}

export default Piggy
