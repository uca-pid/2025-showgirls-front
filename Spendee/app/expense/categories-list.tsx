import ItemButton from '@/components/ItemButton'
import { Text } from '@/components/ui/text'
import { toastService } from '@/context/ToastContext'
import useCategories from '@/hooks/useCategories'
import useExpenseDetail from '@/hooks/useExpenseDetail'
import usePiggy from '@/hooks/usePiggy'
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
  const { categoriesData } = useCategories()
  const { expenseId } = useLocalSearchParams()
  const { updateExpense } = useExpenseDetail(Number(expenseId))
  const { updateObjective } = usePiggy()

  return (
    <View className="w-full h-screen bg-background items-center py-4">
      <Text className="text-lg font-bold">Elegí una categoría</Text>
      <Text className="text-base text-muted-foreground">
        El gasto se guardará en la categoría que elijas
      </Text>
      <View className="w-full h-screen p-4">
        <FlatList
          data={categoriesData}
          renderItem={({ item, index }) => (
            <ItemButton
              borderBottom={index !== (categoriesData?.length ?? 0) - 1}
              editable={false}
              iconLeft={iconNameToEmoji[item.icono]}
              iconLeftColor={item.color}
              iconRight={ChevronRight}
              iconRightColor="white"
              background="background"
              text={item.nombre}
              badgeText={`$ ${item.totalGastos.toString()}`}
              onPress={async () => {
                await updateExpense({
                  id: Number(expenseId),
                  toCategoryId: item.id,
                })
                await updateObjective('expense_edit')
                  .then(() => {
                    toastService.show('Gasto actualizado con éxito', 'success')
                    router.back()
                  })
                  .catch(() =>
                    toastService.show('Error al actualizar gasto', 'error'),
                  )
              }}
            />
          )}
        />
      </View>
    </View>
  )
}

export default CategoriesList
