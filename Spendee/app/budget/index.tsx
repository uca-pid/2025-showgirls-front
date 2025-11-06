import Container from '@/components/Container'
import IconButton from '@/components/IconButton'
import Section from '@/components/Section'
import SectionCard from '@/components/SectionCard'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/context/AuthContext'
import useBudgets from '@/hooks/useBudget'
import useCategories from '@/hooks/useCategories'
import { getIcon } from '@/lib/getIcon'
import { BudgetResponse } from '@/services/budget.service'
import { router } from 'expo-router'
import { ChevronRight } from 'lucide-react-native'
import React from 'react'
import { View } from 'react-native'

const Budget = () => {
  const { user } = useAuth()
  const {
    currentBudget,
    futureBudgets,
    pastBudgets,
    budgetDates,
    deleteBudget,
    modifyBudget,
  } = useBudgets(user ? user.uid : '')
  const { categoriesData } = useCategories()
  const montoPresupuestado = currentBudget?.monto
  const montoTotalGastado = currentBudget?.PresupuestoCategoria.reduce(
    (acc, presupuestoCategoria) => acc + (presupuestoCategoria.gastado ?? 0),
    0,
  )
  const montoRestante = (
    (montoPresupuestado ?? 0) - (montoTotalGastado ?? 0)
  ).toLocaleString('es-AR')
  const fechaInicio = new Date(currentBudget?.fechaInicio!).toLocaleDateString(
    'es-ES',
    new Date(currentBudget?.fechaInicio!).getFullYear() ===
      new Date().getFullYear()
      ? { day: 'numeric', month: 'long' }
      : {},
  )
  const fechaFin = new Date(currentBudget?.fechaFin!).toLocaleDateString(
    'es-ES',
    new Date(currentBudget?.fechaInicio!).getFullYear() ===
      new Date().getFullYear()
      ? { day: 'numeric', month: 'long' }
      : {},
  )
  const porcentajePresupuesto =
    ((montoTotalGastado ?? 0) / (montoPresupuestado ?? 0)) * 100
  return (
    <Container>
      <Section>
        <SectionCard className="bg-transparent">
          <Text className="text-muted-foreground text-lg">Llevás gastado</Text>
          <Text className="text-4xl">
            ${montoTotalGastado?.toLocaleString('GB-gb')}
          </Text>
          <Text className="text-muted-foreground">
            {fechaInicio} - {fechaFin}
          </Text>
        </SectionCard>
      </Section>
      <Section>
        <SectionCard>
          <View className="flex-row justify-between w-full">
            <View>
              <Text className="text-muted-foreground">Restante</Text>
              <Text
                className={`${porcentajePresupuesto >= 100 && 'text-red-800'}`}
              >
                ${montoRestante}
              </Text>
            </View>
            <View>
              <Text className="text-muted-foreground">Presupuesto</Text>
              <Text>${montoPresupuestado?.toLocaleString('GB-gb')}</Text>
            </View>
          </View>
          <Progress value={porcentajePresupuesto} />
        </SectionCard>
        {currentBudget?.PresupuestoCategoria.map(
          (presupuestoCategoria, index) => {
            const categoriaId = presupuestoCategoria.categoriaId
            const montoCategoriaPresupuestado = presupuestoCategoria.monto
            const montoCategoriaGastado = presupuestoCategoria.gastado
            const porcentaje = presupuestoCategoria.porcentaje
            const categoria = categoriesData.find((c) => c.id === categoriaId)

            return (
              <SectionCard key={index}>
                <View className="flex-row items-center justify-between w-full flex-1">
                  <View className="flex-row items-center gap-2 flex-1">
                    <IconButton
                      text=""
                      icon={getIcon(categoria?.icono || 'ellipsis')}
                      iconColor={categoria?.color}
                    />
                    <Text
                      className="text-lg flex-1 max-w-[150px]"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {categoria?.nombre}
                    </Text>
                  </View>

                  <View className="items-end">
                    <Text className="text-lg text-muted-foreground">
                      ${montoCategoriaPresupuestado.toLocaleString('es-AR')}
                    </Text>
                  </View>
                </View>
                <View className="w-full gap-2">
                  <View className="flex-row justify-between">
                    <Text className="font-semibold">
                      ${montoCategoriaGastado.toLocaleString('es-AR')}
                    </Text>
                    <Text className="font-semibold">
                      $
                      {(
                        montoCategoriaPresupuestado - montoCategoriaGastado
                      ).toLocaleString('es-AR')}
                    </Text>
                  </View>
                  <Progress value={porcentaje} color={categoria?.color} />
                </View>
              </SectionCard>
            )
          },
        )}
      </Section>
      <Section
        title="Historial"
        actionText="Añadir presupuesto"
        actionIcon={ChevronRight}
        onActionPress={() => router.push('/budget/modal/add')}
      >
        <SectionCard></SectionCard>
      </Section>
    </Container>
  )
}

export default Budget
