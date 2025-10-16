import Container from '@/components/Container'
import Section from '@/components/Section'
import SectionCard from '@/components/SectionCard'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/context/AuthContext'
import useExpenses from '@/hooks/useExpenses'
import { BarChart } from 'react-native-gifted-charts'
import React, { useMemo, useState } from 'react'
import { Pressable, RefreshControl, View } from 'react-native'

const monthNames = [
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

const shortMonthNames = [
  'E',
  'F',
  'M',
  'A',
  'M',
  'J',
  'J',
  'A',
  'S',
  'O',
  'N',
  'D',
]

const HistoricalExpenseView = () => {
  const { user } = useAuth()
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear())

  const { expensesData, isLoading, isRefetching, refetch } = useExpenses(
    user?.uid ?? '',
    undefined,
    'asc',
  )

  const filteredExpenses = useMemo(() => {
    if (!expensesData) return []
    return expensesData.filter((expense) => {
      if (!expense?.fecha) return false
      const expenseDate = new Date(expense.fecha)
      return expenseDate.getFullYear() === currentYear
    })
  }, [expensesData, currentYear])

  const monthlyTotals = useMemo(() => {
    const totals = Array(12).fill(0)
    filteredExpenses.forEach((expense) => {
      if (!expense?.fecha) return
      const date = new Date(expense.fecha)
      const monthIndex = date.getMonth()
      totals[monthIndex] += Number(expense.gasto ?? 0)
    })
    return totals
  }, [filteredExpenses])

  const totalYearlyExpenses = useMemo(
    () => monthlyTotals.reduce((sum, value) => sum + value, 0),
    [monthlyTotals],
  )

  const barData = useMemo(
    () =>
      monthlyTotals.map((value, index) => ({
        value: Number(value.toFixed(2)),
        label: shortMonthNames[index],
        frontColor: '#F472B6',
        topLabelComponent: () =>
          value > 0 ? (
            <Text className="text-xs text-muted-foreground">
              ${Number(value.toFixed(0))}
            </Text>
          ) : null,
      })),
    [monthlyTotals],
  )

  const todayYear = useMemo(() => new Date().getFullYear(), [])
  const isNextDisabled = currentYear >= todayYear

  const handleYearChange = (direction: 1 | -1) => {
    setCurrentYear((prev) => {
      const next = prev + direction
      if (direction > 0 && next > todayYear) {
        return prev
      }
      return next
    })
  }

  const hasData = barData.some((item) => item.value > 0)

  const currentMonth = new Date().getMonth()

  return (
    <Container
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
      activity={isLoading}
    >
      <Section title="Evolución de gastos">
        <SectionCard className="gap-6">
          <View className="flex-row items-center justify-between">
            <Pressable
              hitSlop={10}
              onPress={() => handleYearChange(-1)}
              accessibilityLabel="Año anterior"
              className="px-3 py-2"
            >
              <Text className="text-2xl text-muted-foreground">{'<'}</Text>
            </Pressable>
            <View className="items-center">
              <Text className="text-lg font-semibold text-foreground">
                {`Gastos de ${currentYear}`}
              </Text>
              <Text className="text-sm text-muted-foreground">
                Total anual: ${totalYearlyExpenses.toFixed(2)}
              </Text>
            </View>
            <Pressable
              hitSlop={10}
              onPress={() => handleYearChange(1)}
              accessibilityLabel="Año siguiente"
              className="px-3 py-2"
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

          {hasData ? (
            <BarChart
              data={barData}
              hideRules
              barWidth={28}
              spacing={24}
              frontColor="#F472B6"
              scrollToIndex={currentMonth}
              yAxisThickness={0}
              xAxisLabelTextStyle={{
                color: '#6B7280',
                fontSize: 12,
              }}
              xAxisThickness={0}
              yAxisTextStyle={{ color: '#6B7280', fontSize: 12 }}
              renderTooltip={(barItem: any) => (
                <View className="bg-background px-3 py-2 rounded-xl border border-border">
                  <Text className="text-xs text-muted-foreground">
                    {monthNames[barItem.index]}: ${barItem.value.toFixed(2)}
                  </Text>
                </View>
              )}
            />
          ) : (
            <View className="py-16 items-center">
              <Text className="text-muted-foreground text-base">
                No hay gastos registrados para este año.
              </Text>
            </View>
          )}
        </SectionCard>
      </Section>
    </Container>
  )
}

export default HistoricalExpenseView
