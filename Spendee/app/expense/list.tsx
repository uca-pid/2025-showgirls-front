import Container from '@/components/Container'
import ItemCard from '@/components/ItemCard'
import { useAuth } from '@/context/AuthContext'
import useExpenses from '@/hooks/useExpenses'
import { router } from 'expo-router'
import React, { useMemo } from 'react'
import { FlatList, RefreshControl, Text, View } from 'react-native'

const ExpensesList = () => {
  const { user } = useAuth()
  const {
    expensesData,
    isLoading,
    isRefetching,
    refetch,
  } = useExpenses(user ? user.uid : '', 20, 'desc')

  const expenses = useMemo(() => expensesData ?? [], [expensesData])
  const renderItem = ({ item }: { item: typeof expenses[number] }) => {
    const formattedDate = item.fecha
      ? new Date(item.fecha).toLocaleDateString()
      : 'Sin fecha'

    const badgeLabel = String(item.categoriaId ?? 'Sin categoría')

    return (
      <ItemCard
        title={formattedDate}
        description={`Monto: $${Number(item.gasto ?? 0).toFixed(2)}`}
        badgeText={badgeLabel}
        badgeVariant="secondary"
        onPress={() =>
          router.push({
            pathname: '/expense/[id]',
            params: { id: String(item.id) },
          })
        }
      />
    )
  }

  return (
    <Container
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      <FlatList
        data={expenses}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerClassName="gap-2 py-4"
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-muted-foreground">
              {isLoading ? 'Cargando gastos...' : 'No hay gastos registrados.'}
            </Text>
          </View>
        }
      />
    </Container>
  )
}

export default ExpensesList
