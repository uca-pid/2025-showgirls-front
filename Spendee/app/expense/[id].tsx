import Container from '@/components/Container'
import Section from '@/components/Section'
import SectionCard from '@/components/SectionCard'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import useCategories from '@/hooks/useCategories'
import useExpenseDetail from '@/hooks/useExpenseDetail'
import { getIcon } from '@/lib/getIcon'
import { Link, router, useGlobalSearchParams } from 'expo-router'
import { ChevronRight } from 'lucide-react-native'
import React from 'react'
import { View } from 'react-native'
import expenseService from '../../services/expense.service'

const ExpenseDetailPage = () => {
  const { id } = useGlobalSearchParams()
  const { expenseDetailData } = useExpenseDetail(Number(id))
  const { categoriesData } = useCategories()

  const category = categoriesData.find(
    (cat) => cat.id === expenseDetailData.categoriaId,
  )

  async function handleDeleteExpense() {
    if (!id) return

    const confirmed =
      typeof (global as any).confirm === 'function'
        ? (global as any).confirm('¿Desea eliminar este gasto?')
        : true
    if (!confirmed) return

    try {
      const svc: any = expenseService

      if (typeof svc.deleteExpense === 'function') {
        await svc.deleteExpense(Number(id))
      } else if (typeof svc.delete === 'function') {
        await svc.delete(Number(id))
      } else if (typeof svc.remove === 'function') {
        await svc.remove(Number(id))
      } else if (typeof svc.deleteByExpenseId === 'function') {
        await svc.deleteByExpenseId(Number(id))
      } else {
        throw new Error('Delete method not available on expenseService')
      }

      router.back()
    } catch (error) {
      console.error('Failed to delete expense:', error)
    }
  }

  return (
    <Container>
      <Section>
        <SectionCard>
          <Text className="text-muted-foreground">
            {new Date(expenseDetailData.fecha).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          <Text className="text-2xl font-semibold">
            {'-$ ' + expenseDetailData.gasto}
          </Text>
        </SectionCard>
      </Section>

      <Section>
        <SectionCard>
          <View className="items-center flex-row">
            <Text className="text-muted-foreground">Gasto en </Text>
            <Text>{category?.nombre}</Text>
          </View>
          <Icon
            as={getIcon(category ? category?.icono : 'ellipsis')}
            size={24}
            color={category?.color}
          />
          <View className="items-center flex-row gap-1">
            <Link href="/category" asChild>
              <Text className="text-muted-foreground">
                Ver todas las categorías
              </Text>
            </Link>
            <ChevronRight color="gray" size={20} />
          </View>
        </SectionCard>
      </Section>

      <Section>
        <SectionCard>
          <Text className="text-muted-foreground">Resultado del balance</Text>
          <View className="flex-row w-full items-center justify-evenly">
            <View className="items-center">
              <Text className="text-muted-foreground">Antes</Text>
              <Text adjustsFontSizeToFit>
                {'$' + expenseDetailData.montoAnterior}
              </Text>
            </View>
            <View className="flex-row">
              <ChevronRight size={24} color={'gray'} />
              <ChevronRight size={24} color={'gray'} />
              <ChevronRight size={24} color={'gray'} />
            </View>
            <View className="items-center">
              <Text className="text-muted-foreground">Después</Text>
              <Text adjustsFontSizeToFit>
                {'$' +
                  (expenseDetailData.montoAnterior - expenseDetailData.gasto)}
              </Text>
            </View>
          </View>
        </SectionCard>
      </Section>
    </Container>
  )
}

export default ExpenseDetailPage
