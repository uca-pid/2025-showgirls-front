import { View } from 'react-native'
import { Text } from '@/components/ui/text'
import React from 'react'

const CategoryPicker = () => {
  return (
    <View className="w-full h-screen bg-background items-center py-4">
      <Text className="text-lg font-bold">Elegí las Categorías</Text>
      <Text className="text-base text-muted-foreground">
        El presupuesto se distribuirá entre estas categorías
      </Text>
    </View>
  )
}

export default CategoryPicker
