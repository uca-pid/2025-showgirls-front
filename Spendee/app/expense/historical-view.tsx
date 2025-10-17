import Container from '@/components/Container'
import Section from '@/components/Section'
import SectionCard from '@/components/SectionCard'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/context/AuthContext'
import useExpenses from '@/hooks/useExpenses'
import React, { useState } from 'react'
import { Pressable, RefreshControl, View } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'

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
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
]

export default function HistoricalExpenseView() {
  const { user } = useAuth()
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth(),
  )
  const { expensesData, isLoading, isRefetching, refetch } = useExpenses(
    user?.uid ?? '',
    999, //Temporal, will be replaced by filters
    'asc',
  )

  const monthlyTotals = Array(12).fill(0)
  expensesData.forEach((expense) => {
    const date = new Date(expense.fecha)
    if (date.getFullYear() === currentYear) {
      monthlyTotals[date.getMonth()] += Number(expense.gasto || 0)
    }
  })

  const barData = monthlyTotals.map((value, i) => ({
    value,
    label: shortMonthNames[i],
    frontColor: i % 2 === 0 ? 'rgb(38, 96, 172)' : 'rgb(38, 96, 172,0.7)',
    onPress: () => {
      setSelectedMonth(i)
    },
  }))
  const totalYear = monthlyTotals.reduce((a, b) => a + b, 0)
  const todayYear = new Date().getFullYear()
  const isNextDisabled = currentYear >= todayYear

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
              onPress={() => setCurrentYear((y) => y - 1)}
              className="px-3 py-2"
            >
              <Text className="text-2xl text-muted-foreground">{'<'}</Text>
            </Pressable>
            <View className="items-center">
              <Text className="text-lg font-semibold">
                Gastos de {currentYear}
              </Text>
              <Text className="text-sm text-muted-foreground">
                Total anual: ${totalYear}
              </Text>
            </View>
            <Pressable
              disabled={isNextDisabled}
              onPress={() => setCurrentYear((y) => y + 1)}
              className="px-3 py-2"
            >
              <Text
                className="text-2xl text-muted-foreground"
                style={isNextDisabled ? { opacity: 0.3 } : undefined}
              >
                {'>'}
              </Text>
            </Pressable>
          </View>

          <BarChart
            scrollToIndex={currentMonth}
            data={barData}
            hideRules
            xAxisLabelTextStyle={{ color: 'gray' }}
            yAxisTextStyle={{ color: 'gray' }}
            barWidth={24}
            spacing={20}
            yAxisThickness={0}
            xAxisThickness={0}
            roundedTop
            roundedBottom
            // autoCenterTooltip
            // renderTooltip={(barItem: any) => (
            //   <View className="bg-background px-3 py-2 rounded-xl border border-border">
            //     <Text className="text-xs text-muted-foreground">
            //       {monthNames[barItem.index]}: ${barItem.value.toFixed(2)}
            //     </Text>
            //   </View>
            // )}
          />
        </SectionCard>
        <SectionCard className="items-center">
          <View className="flex-col items-center gap-0">
            <Text className="text-lg font-semibold">
              Gastos de {monthNames[selectedMonth]} de {currentYear}:
            </Text>
            <Text className="text-lg text-muted-foreground">
              ${monthlyTotals[selectedMonth]}
            </Text>
          </View>
        </SectionCard>
      </Section>
    </Container>
  )
}
