import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native'
import { useGlobalSearchParams } from 'expo-router'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import expenseService, { ExpenseResponse } from '@/services/expense.service'
import { auth } from '@/firebase.config'
import { useIsFocused } from '@react-navigation/native'
import { Trash2 } from 'lucide-react-native'
import { Pressable } from 'react-native'

const CategoryDetailPage = () => {
  const params = useGlobalSearchParams<{ id: string; name?: string | string[] }>()

  const rawName = params.name
  const categoryName = Array.isArray(rawName)
    ? rawName[0]
    : rawName ?? ''
  const categoryId = params.id
  const title = categoryName?.trim() ? categoryName : categoryId
  const numericCategoryId = categoryId ? Number(categoryId) : null

  const [expenses, setExpenses] = useState<ExpenseResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const isFocused = useIsFocused()
  const userId = auth.currentUser?.uid ?? null

  const fetchExpenses = useCallback(async () => {
    if (!userId || !numericCategoryId) {
      setExpenses([])
      setLoading(false)
      setRefreshing(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await expenseService.findByUserId(userId)
      const filtered = res.data.filter(
        (expense) => expense.categoriaId === numericCategoryId,
      )
      setExpenses(filtered)
    } catch (err: any) {
      console.error('Error fetching expenses by category', err)
      setError(
        err?.message ?? 'No se pudieron cargar los gastos de esta categoría.',
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [numericCategoryId, userId])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses, isFocused])

  const totalSpent = useMemo(
    () => expenses.reduce((acc, expense) => acc + (expense.gasto ?? 0), 0),
    [expenses],
  )

  const handleRefresh = () => {
    setRefreshing(true)
    fetchExpenses()
  }

  const handleDeleteExpense = useCallback(
    (expenseId: number) => {
      Alert.alert(
        'Eliminar gasto',
        '¿Deseas eliminar este gasto?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
              try {
                setDeletingId(expenseId)
                await expenseService.deleteExpense(expenseId)
                setExpenses((prev) =>
                  prev.filter((expense) => expense.id !== expenseId),
                )
              } catch (err: any) {
                console.error('Error deleting expense', err)
                Alert.alert(
                  'Error',
                  err?.message ??
                    'No se pudo eliminar el gasto. Intenta nuevamente.',
                )
              } finally {
                setDeletingId(null)
                fetchExpenses()
              }
            },
          },
        ],
        { cancelable: true },
      )
    },
    [fetchExpenses],
  )

  const renderExpense = ({ item }: { item: ExpenseResponse }) => {
    const formattedDate = item.fecha
      ? new Date(item.fecha).toLocaleDateString()
      : 'Sin fecha'

    return (
      <Card className="bg-foreground border border-muted rounded-2xl">
        <CardContent className="flex-row items-center justify-between py-3">
          <View className="gap-1">
            <Text className="text-base font-semibold text-foreground">
              {formattedDate}
            </Text>
            {typeof item.montoAnterior === 'number' && (
              <Text className="text-xs text-muted-foreground">
                Saldo anterior: ${item.montoAnterior.toFixed(2)}
              </Text>
            )}
          </View>
          <View className="flex-row items-center gap-3">
            <Text className="text-lg font-semibold text-destructive">
              -${Number(item.gasto ?? 0).toFixed(2)}
            </Text>
            <Pressable
              hitSlop={10}
              onPress={() => handleDeleteExpense(item.id)}
              accessibilityRole="button"
              accessibilityLabel="Eliminar gasto"
              disabled={deletingId === item.id}
            >
              {deletingId === item.id ? (
                <ActivityIndicator size="small" color="#ef4444" />
              ) : (
                <Trash2 size={20} color="#ef4444" />
              )}
            </Pressable>
          </View>
        </CardContent>
      </Card>
    )
  }

  // TODO: fetch and show category expenses using the id from params

  return (
    <View className="bg-background flex-1 px-4 py-6 gap-4">
      <Card className="w-full bg-foreground">
        <CardContent className="gap-2">
          <CardTitle>Categoría {title}</CardTitle>
          <Text className="text-sm text-muted-foreground">
            Total gastado: ${totalSpent.toFixed(2)}
          </Text>
        </CardContent>
      </Card>

      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderExpense}
          contentContainerClassName="gap-3 pb-12"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-12">
              <Text className="text-base text-muted-foreground">
                {error ?? 'No hay gastos registrados para esta categoría.'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  )
}

export default CategoryDetailPage
