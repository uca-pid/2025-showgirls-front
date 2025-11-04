import { View } from 'react-native'
import { Text } from '@/components/ui/text'
import React from 'react'
import SliderCard from '@/components/SliderCard'
import useCategories from '@/hooks/useCategories'

const CategoryPicker = () => {
  const { categoriesData } = useCategories()
  return (
    <View className="w-full h-screen bg-background items-center py-4">
      <SliderCard categories={categoriesData} amount={1000} />
    </View>
  )
}

export default CategoryPicker
