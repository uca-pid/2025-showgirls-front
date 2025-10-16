import Container from '@/components/Container'
import ItemCard from '@/components/ItemCard'
import Section from '@/components/Section'
import DollarSignSpinner from '@/components/ui/DollarSignSpinner'
import { useAuth } from '@/context/AuthContext'
import useCategories from '@/hooks/useCategories'
import useExpenses from '@/hooks/useExpenses'
import { getIcon } from '@/lib/getIcon'
import { router } from 'expo-router'
import React from 'react'
import { FlatList, RefreshControl, Text as RNText, View } from 'react-native'

const ExpensesList = () => {
  const { user } = useAuth()
  const { expensesData, isLoading, isRefetching, refetch } = useExpenses(
    user ? user.uid : '',
    999, //Temporal, will be replaced by an infinite query in a future
    'desc',
  )
  const { categoriesData } = useCategories()

  const groupedByMonth = expensesData.reduce(
    (groups, expense) => {
      const date = new Date(expense.fecha)
      const monthYear = date
        .toLocaleString('es-ES', {
          month: 'long',
        })
        .toUpperCase()

      if (!groups[monthYear]) {
        groups[monthYear] = []
      }
      groups[monthYear].push(expense)

      return groups
    },
    {} as Record<string, typeof expensesData>,
  )

  const sections = Object.entries(groupedByMonth).map(([month, expenses]) => ({
    month,
    expenses,
  }))

  return (
    <Container
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      <Section title="Mis Gastos Históricos">
        <FlatList
          scrollEnabled={false}
          data={sections}
          renderItem={({ item }) => (
            <View className="mt-2">
              <RNText className="text-muted-foreground px-4 pb-2">
                {item.month}
              </RNText>

              {item.expenses.map((expense) => {
                const category = categoriesData.find(
                  (cat) => cat.id === expense.categoriaId,
                )
                const title = 'Gasto en ' + category?.nombre
                const icon = getIcon(category?.icono ?? '')
                const color = category?.color ?? 'white'
                const date = new Date(expense.fecha).toLocaleDateString('es-ES')
                const amount = `-$${expense.gasto}`

                return (
                  <ItemCard
                    key={expense.id}
                    title={title}
                    description={date}
                    badgeText={amount}
                    icon={icon}
                    iconColor={color}
                    onPress={() =>
                      router.push({
                        pathname: '/expense/[id]',
                        params: { id: expense.id },
                      })
                    }
                  />
                )
              })}
            </View>
          )}
          ListEmptyComponent={
            <Container>
              <DollarSignSpinner />
            </Container>
          }
        />
      </Section>
    </Container>
  )
}

export default ExpensesList
