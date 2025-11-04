import { View } from 'react-native'
import { Text } from '@/components/ui/text'
import React from 'react'
import SliderCard from '@/components/SliderCard'
import useCategories from '@/hooks/useCategories'
import { useLocalSearchParams } from 'expo-router'

const CategoryPicker = () => {
  const { categoriesData } = useCategories()
  const { expense } = useLocalSearchParams()
  return (
    <View className="w-full h-screen bg-background items-center py-4">
      <SliderCard categories={categoriesData} amount={Number(expense)} />
    </View>
  )
}

export default CategoryPicker
