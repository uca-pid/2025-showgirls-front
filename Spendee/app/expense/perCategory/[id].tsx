import Container from '@/components/Container'
import ItemCard from '@/components/ItemCard'
import Section from '@/components/Section'
import SectionCard from '@/components/SectionCard'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/context/AuthContext'
import useCategories from '@/hooks/useCategories'
import useExpenses from '@/hooks/useExpenses'
import useExpensesByCategory from '@/hooks/useExpensesByCategory'
import { getIcon } from '@/lib/getIcon'
import { ExpenseResponse } from '@/services/expense.service'
import { Link, useGlobalSearchParams, useNavigation } from 'expo-router'
import { ChevronRight, Trash2, X } from 'lucide-react-native'
import React, { useLayoutEffect, useState } from 'react'

import { Alert, FlatList, RefreshControl, View } from 'react-native'

const CategoryDetailPage = () => {
  const params = useGlobalSearchParams<{
    id: string
    name?: string | string[]
  }>()

  const { user } = useAuth()
  const { expensesByCategory, isRefetching, refetch } = useExpensesByCategory(
    user ? user.uid : '',
    Number(params.id),
  )
  const { deleteExpense } = useExpenses(user ? user.uid : '', 0, 'asc')
  const { categoriesData } = useCategories()
  const category = categoriesData.find((cat) => cat.id === Number(params.id))

  const navigation = useNavigation()
  useLayoutEffect(() => {
    if (category?.nombre) {
      navigation.setOptions({
        title: 'Gastos de ' + category.nombre,
      })
    }
  }, [category])

  const [deleteMode, setDeleteMode] = useState(false)

  function handleDelete(expense: ExpenseResponse) {
    Alert.alert(
      '¿Estás seguro que deseas eliminar este gasto?',
      'Esta acción es IRREVERSIBLE',
      [
        {
          text: 'Cancelar',
          style: 'destructive',
          onPress: () => setDeleteMode(false),
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await deleteExpense(expense.id)
            } catch (error) {
              console.log(error)
            }
          },
        },
      ],
    )
  }

  return (
    <Container
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      <Section>
        <SectionCard>
          <Text className="text-2xl">Categoría {category?.nombre}</Text>
          <Icon
            as={getIcon(category ? category.icono : 'ellipsis')}
            size={40}
            color={category?.color}
          />
          <Text className="text-m text-muted-foreground">
            Total gastado: ${category?.totalGastos.toFixed(2)}
          </Text>
        </SectionCard>
      </Section>

      {expensesByCategory.length > 0 ? (
        <Section
          title="Gastos de la categoría"
          actionText={deleteMode ? 'Cancelar' : 'Eliminar'}
          actionIcon={deleteMode ? X : Trash2}
          onActionPress={() => setDeleteMode(!deleteMode)}
        >
          <FlatList
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            data={expensesByCategory}
            keyExtractor={(item) => String(item.id)}
            contentContainerClassName="h-full"
            renderItem={({ item }) => (
              <ItemCard
                title={`Gasto en ${category?.nombre}`}
                description={`${new Date(item.fecha).toLocaleDateString('gb-GB')}\nSaldo anterior: $${item.montoAnterior.toFixed(2)}`}
                badgeText={`-$${item.gasto}`}
                badgeVariant="destructive"
                icon={deleteMode ? Trash2 : undefined}
                iconColor="gray"
                onPress={deleteMode ? () => handleDelete(item) : undefined}
              />
            )}
          />
        </Section>
      ) : (
        <SectionCard className="items-center">
          <Text className="text-xl">No hay gastos en esta categoría</Text>
          <Link href="/" replace>
            <View className="flex-row items-center">
              <Text className="text-base text-muted-foreground">
                Volver al inicio
              </Text>
              <ChevronRight size={20} color="gray" />
            </View>
          </Link>
        </SectionCard>
      )}
    </Container>
  )
}

export default CategoryDetailPage
