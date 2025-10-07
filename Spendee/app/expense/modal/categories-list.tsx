import ItemButton from '@/components/ItemButton'
import { Text } from '@/components/ui/text'
import useCategories from '@/hooks/useCategories'
import { router, useLocalSearchParams } from 'expo-router'
import {
  BookOpen,
  Bus,
  ChevronRight,
  Ellipsis,
  Gamepad2,
  Heart,
  House,
  LucideIcon,
  Paperclip,
  Popcorn,
  Shield,
  Shuffle,
  Sigma,
  Sprout,
  Sun,
  TestTube,
  TreePalm,
  Users,
  Utensils,
  Wine,
  Wrench,
} from 'lucide-react-native'
import React from 'react'
import { FlatList, View } from 'react-native'

const iconNameToEmoji: Record<string, LucideIcon> = {
  bus: Bus,
  utensils: Utensils,
  home: House,
  heart: Heart,
  gamepad: Gamepad2,
  book: BookOpen,
  Wrench: Wrench,
  Wine: Wine,
  Sprout: Sprout,
  Users: Users,
  TreePalm: TreePalm,
  TestTube: TestTube,
  Sun: Sun,
  Sigma: Sigma,
  Popcorn: Popcorn,
  Shuffle: Shuffle,
  Shield: Shield,
  Paperclip: Paperclip,
  '': Ellipsis,
  'ellipsis-h': Ellipsis,
}

const CategoriesList = () => {
  const { categories } = useCategories()
  const { expense } = useLocalSearchParams()

  return (
    <View className="w-full h-screen bg-background items-center py-4">
      <Text className="text-lg font-bold">Elegí una categoría</Text>
      <Text className="text-base text-muted-foreground">
        El gasto se guardará en la categoría que elijas
      </Text>
      <View className="w-full h-screen p-4">
        <FlatList
          data={categories}
          renderItem={({ item, index }) => (
            <ItemButton
              borderBottom={index !== (categories?.length ?? 0) - 1}
              editable={false}
              iconLeft={iconNameToEmoji[item.icono]}
              iconLeftColor={item.color}
              iconRight={ChevronRight}
              iconRightColor="white"
              background="background"
              text={item.nombre}
              badgeText={`$ ${item.totalGastos.toString()}`}
              onPress={() => {
                router.dismissTo({
                  pathname: '/expense/modal/add',
                  params: { categoryId: item.id, expense: expense },
                })
              }}
            />
          )}
        />
      </View>
    </View>
  )
}

export default CategoriesList
