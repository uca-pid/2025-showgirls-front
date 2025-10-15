import Container from '@/components/Container'
import DonutChart from '@/components/DonutChart'
import ItemCard from '@/components/ItemCard'
import Section from '@/components/Section'
import SectionCard from '@/components/SectionCard'
import { useAuth } from '@/context/AuthContext'
import { auth } from '@/firebase.config'
import useCategories from '@/hooks/useCategories'
import useChartData from '@/hooks/useChartData'
import useExpenses from '@/hooks/useExpenses'
import { getIcon } from '@/lib/getIcon'
import { router } from 'expo-router'
import { ChevronRight } from 'lucide-react-native'
import React from 'react'
import { FlatList, Text } from 'react-native'

const ExpensesPage = () => {
  const { user } = auth.currentUser ? useAuth() : { user: null }
  const { categoriesData, isLoading: loadingCategories } = useCategories()
  const { chartData, isLoading: loadingChartData } = useChartData()
  const { expensesData, isLoading: loadingExpenses } = useExpenses(
    user?.uid ?? '',
    0,
    'asc',
  )

  return (
    <Container>
      <Section title="Mis Gastos">
        <SectionCard activity={loadingChartData}>
          <Text className="text-muted-foreground">Mis gastos</Text>
          <DonutChart
            data={chartData}
            centerText={
              loadingChartData
                ? ''
                : `$${chartData.reduce((sum, item) => sum + item.value, 0)}`
            }
            centerTextColor="white"
            size={210}
            strokeWidth={20}
          />
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
              />
            )
          }}
        />
      </Section>
    </Container>
  )
}

export default ExpensesPage
