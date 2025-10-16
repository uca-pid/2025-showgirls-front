import Container from '@/components/Container'
import DonutChart from '@/components/DonutChart'
import ItemCard from '@/components/ItemCard'
import Section from '@/components/Section'
import SectionCard from '@/components/SectionCard'
import { Select } from '@/components/ui/select'
import { useAuth } from '@/context/AuthContext'
import { auth } from '@/firebase.config'
import useCategories from '@/hooks/useCategories'
import useChartData from '@/hooks/useChartData'
import { getIcon } from '@/lib/getIcon'
import { Button } from '@react-navigation/elements'
import { router } from 'expo-router'
import { ChevronRight } from 'lucide-react-native'
import React, { useMemo, useState } from 'react'
import { FlatList, Pressable, Text, TouchableOpacity, View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'

const ExpensesPage = () => {
  const { user } = auth.currentUser ? useAuth() : { user: null }
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [openDropdown, setOpenDropdown] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = new Date()
    date.setDate(1)
    date.setHours(0, 0, 0, 0)
    return date
  })
  const todayMonth = useMemo(() => {
    const date = new Date()
    date.setDate(1)
    date.setHours(0, 0, 0, 0)
    return date
  }, [])
  const monthNames = useMemo(
    () => [
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
    ],
    [],
  )

  const monthLabel = useMemo(() => {
    const monthIndex = currentMonth.getMonth()
    const year = currentMonth.getFullYear()
    return `${monthNames[monthIndex]} ${year}`
  }, [currentMonth, monthNames])

  const handleMonthChange = (direction: 1 | -1) => {
    setCurrentMonth((prev) => {
      const next = new Date(prev)
      next.setDate(1)
      next.setMonth(prev.getMonth() + direction)

      if (
        direction > 0 &&
        (next.getFullYear() > todayMonth.getFullYear() ||
          (next.getFullYear() === todayMonth.getFullYear() &&
            next.getMonth() > todayMonth.getMonth()))
      ) {
        return prev
      }

      return next
    })
  }

  const filterMonth = currentMonth.getMonth() + 1
  const filterYear = currentMonth.getFullYear()

  const filterParams = useMemo(
    () => ({ month: filterMonth, year: filterYear }),
    [filterMonth, filterYear],
  )

  const { categoriesData, isLoading: loadingCategories } =
    useCategories(filterParams)
  const { chartData, isLoading: loadingChartData } = useChartData(filterParams)

  const isNextDisabled = useMemo(() => {
    return (
      currentMonth.getFullYear() === todayMonth.getFullYear() &&
      currentMonth.getMonth() === todayMonth.getMonth()
    )
  }, [currentMonth, todayMonth])

  function toggleCategory(categoryId: number) {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    )
  }

  const filteredChartData =
    selectedCategories.length > 0
      ? chartData.filter((c) => selectedCategories.includes(Number(c.id)))
      : chartData

  return (
    <Container>
      <Section title="Mis Gastos">
        <SectionCard activity={loadingChartData}>
          <View className="flex-row items-center justify-between w-full">
            <Pressable
              hitSlop={10}
              onPress={() => handleMonthChange(-1)}
              accessibilityLabel="Mes anterior"
              className="px-2 py-1"
            >
              <Text className="text-2xl text-muted-foreground">{'<'}</Text>
            </Pressable>
            <Text className="text-muted-foreground text-lg font-medium">
              {monthLabel}
            </Text>
            <Pressable
              hitSlop={10}
              onPress={() => handleMonthChange(1)}
              accessibilityLabel="Mes siguiente"
              className="px-2 py-1"
              disabled={isNextDisabled}
            >
              <Text
                className="text-2xl text-muted-foreground"
                style={isNextDisabled ? { opacity: 0.3 } : undefined}
              >
                {'>'}
              </Text>
            </Pressable>
          </View>
          <DonutChart
            data={filteredChartData}
            centerText={
              loadingChartData
                ? ''
                : `$${filteredChartData.reduce((sum, item) => sum + item.value, 0)}`
            }
            centerTextColor="white"
            size={210}
            strokeWidth={20}
          />
          <SectionCard flex="row" className="width-full">
            <FlatList
              data={categoriesData}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                justifyContent: 'center',
                gap: 8,
              }}
              renderItem={({ item: cat }) => {
                const isSelected = selectedCategories.includes(cat.id)
                return (
                  <TouchableOpacity
                    onPress={() => toggleCategory(cat.id)}
                    activeOpacity={0.7}
                    style={{
                      backgroundColor: isSelected ? cat.color : '#f2f2f2',
                      borderRadius: 8,
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      marginHorizontal: 6,
                    }}
                  >
                    <Text
                      style={{
                        color: isSelected ? 'white' : '#333',
                        fontWeight: isSelected ? '600' : '500',
                        fontSize: 14,
                      }}
                    >
                      {cat.nombre}
                    </Text>
                  </TouchableOpacity>
                )
              }}
            />
          </SectionCard>
          <View className="flex-row items-center">
            <Pressable
              className="flex-row items-center"
              onPress={() => router.push('/expense/historical-view')}
            >
              <Text className="text-muted-foreground">
                Ver evolución mensual
              </Text>
              <ChevronRight color="gray" />
            </Pressable>
          </View>
        </SectionCard>
      </Section>

      <Section
        title="Categorías"
        actionText="Ver categorías"
        actionIcon={ChevronRight}
      >
        <FlatList
          scrollEnabled={false}
          data={categoriesData}
          renderItem={({ item }) => {
            return (
              <ItemCard
                title={item.nombre}
                description={item.descripcion}
                icon={getIcon(item.icono)}
                iconColor={item.color}
                onPress={() =>
                  router.push({
                    pathname: '/expense/perCategory/[id]',
                    params: { id: item.id },
                  })
                }
                editable={item.editable}
                onEdit={() =>
                  router.push({
                    pathname: '../category/edit-category',
                    params: {
                      categoryIdr: item.id,
                      categoryName: item.nombre,
                      categoryDescription: item.descripcion ?? '',
                      categoryIcon: item.icono,
                    },
                  })
                }
              />
            )
          }}
        />
      </Section>
    </Container>
  )
}

export default ExpensesPage
