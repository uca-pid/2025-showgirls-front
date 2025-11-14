import { MovementsResponse } from '@/services/balance.service'
import { Section } from 'lucide-react-native'
import React from 'react'
import { Text, View } from 'react-native'
import ItemCard from '../ItemCard'
import SectionCard from '../SectionCard'

type MovementsSectionProps = {
  movementsData: MovementsResponse[]
}

const MovementsSection = ({ movementsData }: MovementsSectionProps) => {
  return (
    <Section title="Movimientos Históricos">
      {movementsData?.map((group, index) => {
        const [year, month] = group.period.split('-').map(Number)
        const date = new Date(year, month - 1)
        const monthName = date.toLocaleString('es-ES', { month: 'long' })
        const monthCap = monthName.charAt(0).toUpperCase() + monthName.slice(1)
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
  )
}

export default MovementsSection
