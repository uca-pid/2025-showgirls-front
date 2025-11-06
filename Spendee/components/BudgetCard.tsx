import { BudgetResponse } from '@/services/budget.service'
import React from 'react'
import { View } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import SectionCard from './SectionCard'
import { Text } from './ui/text'

interface BudgetCardProps {
  budget?: BudgetResponse
}

export default function BudgetCard({
  budget = {
    usuarioId: '',
    fechaInicio: new Date(),
    fechaFin: new Date(),
    monto: 0,
    PresupuestoCategoria: [],
  },
}: BudgetCardProps) {
  const montoPresupuestado = budget?.monto
  const montoTotalGastado = budget?.PresupuestoCategoria.reduce(
    (acc, presupuestoCategoria) => acc + (presupuestoCategoria.gastado ?? 0),
    0,
  )
  const montoRestante = (
    (montoPresupuestado ?? 0) - (montoTotalGastado ?? 0)
  ).toLocaleString('es-AR')
  const fechaInicio = new Date(budget?.fechaInicio!).toLocaleDateString(
    'es-ES',
    new Date(budget?.fechaInicio!).getFullYear() === new Date().getFullYear()
      ? { day: 'numeric', month: 'short' }
      : {},
  )
  const fechaFin = new Date(budget?.fechaFin!).toLocaleDateString(
    'es-ES',
    new Date(budget?.fechaInicio!).getFullYear() === new Date().getFullYear()
      ? { day: 'numeric', month: 'short' }
      : {},
  )
  const diasRestantes =
    new Date(budget?.fechaFin).getDate() -
    new Date(budget?.fechaInicio).getDate()
  const porcentajePresupuesto =
    ((montoTotalGastado ?? 0) / (montoPresupuestado ?? 0)) * 100

  return (
    <SectionCard
      items="center"
      className="gap-[5px]"
      flex="row"
      justify="between"
    >
      <View>
        <Text className="text-2xl font-semibold">
          ${montoPresupuestado.toLocaleString('es-AR')}
        </Text>
        <Text className="text-lg text-muted-foreground">
          {fechaInicio} - {fechaFin}
        </Text>
        <Text className="text-base text-muted-foreground">
          {diasRestantes} días restantes
        </Text>
      </View>
      <View className="items-center gap-2">
        <AnimatedCircularProgress
          fill={porcentajePresupuesto}
          size={90}
          width={10}
          rotation={270}
          tintColor={porcentajePresupuesto >= 100 ? 'darkred' : 'white'}
          backgroundColor="#FFFFFF30"
          lineCap="round"
          children={() => (
            <Text
              className={`${porcentajePresupuesto >= 100 ? 'text-red-600' : ' text-primary'} text-lg`}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {porcentajePresupuesto.toFixed(0)}%
            </Text>
          )}
        />
      </View>
    </SectionCard>
  )
}
