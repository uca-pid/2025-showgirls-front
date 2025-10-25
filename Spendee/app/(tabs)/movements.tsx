import Container from '@/components/Container'
import ItemCard from '@/components/ItemCard'
import Section from '@/components/Section'
import SectionCard from '@/components/SectionCard'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/context/AuthContext'
import useMovements from '@/hooks/useMovements'
import React from 'react'
import { View } from 'react-native'

const TransactionsPage = () => {
  const { user } = useAuth()
  const { movementsData } = useMovements(user?.uid || '', {
    groupBy: 'month',
    order: 'desc',
  })

  return (
    <Container>
      <Section title="Movimientos Históricos">
        {movementsData?.map((group, index) => {
          const [year, month] = group.period.split('-').map(Number)
          const date = new Date(year, month - 1)
          const monthName = date.toLocaleString('es-ES', { month: 'long' })
          const monthCap =
            monthName.charAt(0).toUpperCase() + monthName.slice(1)
          return (
            <View key={index}>
              <SectionCard className="mb-4">
                <Text className="text-xl">{monthCap}</Text>
                <View className="flex-row justify-between w-full">
                  <Text className="text-m text-muted-foreground">
                    {`Egresos: $${group.totalEgresos}`}
                  </Text>
                  <Text className="text-m text-muted-foreground">
                    {`Ingresos: $${group.totalIngresos}`}
                  </Text>
                </View>
              </SectionCard>
              {group.items.map((mov, index) => (
                <ItemCard
                  key={index}
                  title={mov.tipo === 'income' ? 'Ingreso' : 'Gasto'}
                  badgeText={`$ ${mov.monto}`}
                  badgeVariant={
                    mov.tipo === 'expense' ? 'destructive' : 'positive'
                  }
                  description={new Date(mov.fecha).toLocaleDateString('gb-GB')}
                />
              ))}
            </View>
          )
        })}
      </Section>
    </Container>
  )
}

export default TransactionsPage
