import BudgetCard from '@/components/BudgetCard'
import Container from '@/components/Container'
import Section from '@/components/Section'
import SectionCard from '@/components/SectionCard'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/context/AuthContext'
import useBudgets from '@/hooks/useBudget'
import React from 'react'
import { View } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'

export default function BudgetHistory() {
  const { user } = useAuth()
  const {
    pastBudgets,
    futureBudgets,
    currentBudget,
    isFetching,
    isRefetching,
  } = useBudgets(user ? user.uid : '')

  const pastChartData =
    pastBudgets?.map((budget) => {
      const fecha = new Date(budget.fechaInicio).toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'numeric',
      })
      const totalGastado = budget.PresupuestoCategoria?.reduce(
        (sum: number, cat: any) => sum + Number(cat.gastado),
        0,
      )

      const label = fecha

      return {
        value: totalGastado / 1000,
        label,
        frontColor: '#4F46E5',
      }
    }) || []

  const promedioGastado =
    pastChartData.length > 0
      ? pastChartData.reduce((sum, d) => sum + d.value * 1000, 0) /
        pastChartData.length
      : 0

  const promedioPresupuestado =
    pastBudgets !== undefined
      ? pastBudgets.reduce((sum, d) => sum + d.monto, 0) / pastBudgets.length
      : 0

  return (
    <Container activity={isFetching || isRefetching}>
      <Section>
        <SectionCard items="center">
          <Text className="text-xl">Gasto total por presupuesto</Text>
          <BarChart
            data={pastChartData}
            hideRules
            barWidth={26}
            spacing={30}
            yAxisThickness={0}
            xAxisThickness={0}
            xAxisLabelTextStyle={{ color: 'gray', fontSize: 12 }}
            yAxisTextStyle={{ color: 'gray', fontSize: 12 }}
            yAxisLabelSuffix="K"
            disableScroll
            roundedTop
            roundedBottom
            noOfSections={5}
            showReferenceLine1
            referenceLine1Position={promedioGastado / 1000}
            referenceLine1Config={{
              color: 'gray',
              dashWidth: 6,
              dashGap: 4,
              thickness: 2,
            }}
            showReferenceLine2
            referenceLine2Position={promedioPresupuestado / 1000}
            referenceLine2Config={{
              color: 'darkred',
              dashWidth: 6,
              dashGap: 4,
              thickness: 2,
            }}
          />
        </SectionCard>
      </Section>
      <Section>
        <SectionCard>
          <Text className="text-2xl">
            Gastaste un{' '}
            {((promedioGastado / promedioPresupuestado) * 100).toFixed(2)}% de
            lo presupuestado en promedio
          </Text>
          <View>
            <Text className="text-base text-muted-foreground">
              Promedio total gastado: $
              {promedioGastado.toLocaleString('es-AR', {
                maximumFractionDigits: 0,
              })}
            </Text>
            <Text className="text-base text-muted-foreground">
              Promedio total presupuestado: $
              {promedioPresupuestado.toLocaleString('es-AR', {
                maximumFractionDigits: 0,
              })}
            </Text>
          </View>
        </SectionCard>
      </Section>
      <Section title="Historial">
        <BudgetCard />
      </Section>
    </Container>
  )
}
