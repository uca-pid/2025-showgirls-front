import { Text } from '@/components/ui/text'
import { ChartData } from '@/hooks/useChartData'
import { formatCurrency } from '@/lib/helpers/formatCurency'
import { CategoryResponse } from '@/services/category.service'
import { ExpenseResponse } from '@/services/expense.service'
import { router } from 'expo-router'
import { ChevronRight } from 'lucide-react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'
import DonutChart from '../DonutChart'
import Section from '../Section'
import SectionCard from '../SectionCard'

type ExpensesByCategorySectionProps = {
  chartData?: ChartData[]
  categories?: CategoryResponse[]
  expenses?: ExpenseResponse[]
}

type CategoryPillProps = {
  cat: CategoryResponse
  isSelected: boolean
  onToggle: (categoryId: number) => void
}

const CategoryPill = React.memo(
  ({ cat, isSelected, onToggle }: CategoryPillProps) => (
    <TouchableOpacity
      className="rounded-sm px-3 py-1 mx-1.5 flex-row items-center gap-1.5 border-2 border-black"
      onPress={() => onToggle(cat.id)}
      activeOpacity={0.7}
      style={{
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 4,
        marginHorizontal: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderWidth: isSelected ? 2 : 0,
        borderColor: isSelected ? cat.color : 'transparent',
        backgroundColor: isSelected
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(255, 255, 255, 0.05)',
      }}
    >
      <View
        className="rounded-full w-2 h-2"
        style={{ backgroundColor: cat.color }}
      />
      <Text>{cat.nombre}</Text>
    </TouchableOpacity>
  ),
)

export default function ExpensesByCategorySection({
  categories,
  chartData,
  expenses,
}: ExpensesByCategorySectionProps) {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  const monthLabel = useMemo(() => {
    const today = new Date()
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ]
    return months[today.getMonth()]
  }, [])

  const toggleCategory = useCallback((id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )
  }, [])

  const filteredChartData = useMemo(() => {
    if (!selectedCategories.length) return chartData
    return chartData?.filter((c) => selectedCategories.includes(Number(c.id)))
  }, [chartData, selectedCategories])

  const totalGastos = useMemo(
    () => filteredChartData?.reduce((sum, item) => sum + item.value, 0),
    [filteredChartData],
  )

  const formattedTotal = useMemo(
    () => `$${formatCurrency(totalGastos!)}`,
    [totalGastos],
  )

  return (
    <Section
      title={`Mis Gastos de ${monthLabel}`}
      showWhen={expenses?.length! > 0}
    >
      <SectionCard onPress={() => router.push('/expense')}>
        <FlatList
          data={categories?.filter((cat) => cat.totalGastos > 0)}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ justifyContent: 'center', gap: 8 }}
          renderItem={({ item }) => (
            <CategoryPill
              cat={item}
              isSelected={selectedCategories.includes(item.id)}
              onToggle={toggleCategory}
            />
          )}
        />

        {filteredChartData?.length! > 0 && (
          <DonutChart
            data={filteredChartData!}
            centerText={formattedTotal}
            centerTextColor="white"
            size={210}
            strokeWidth={20}
          />
        )}

        <View className="flex-row items-center mt-2">
          <Text className="text-muted-foreground">
            Ver gastos por categoría
          </Text>
          <ChevronRight color="gray" />
        </View>
      </SectionCard>
    </Section>
  )
}
