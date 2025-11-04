import { View } from 'react-native'
import { Text } from '@/components/ui/text'
import React from 'react'
import SliderCard from '@/components/SliderCard'
import useCategories from '@/hooks/useCategories'

const CategoryPicker = () => {
  const { categoriesData } = useCategories()
  console.log(typeof categoriesData)
  return (
    <View className="w-full h-screen bg-background items-center py-4">
      <Text className="text-lg font-bold">Elegí las Categorías</Text>
      <Text className="text-base text-muted-foreground">
        El presupuesto se distribuirá entre estas categorías
      </Text>
      <SliderCard categories={categoriesData} amount={1000} />
    </View>
  )
}

export default CategoryPicker
