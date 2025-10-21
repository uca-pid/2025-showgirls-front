import Container from '@/components/Container'
import Dropdown, { DropdownRef } from '@/components/Dropdown'
import Section from '@/components/Section'
import SectionCard from '@/components/SectionCard'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { toastService } from '@/context/ToastContext'
import useCategories from '@/hooks/useCategories'
import useExpenseDetail from '@/hooks/useExpenseDetail'
import { getIcon } from '@/lib/getIcon'
import { Link, router, useGlobalSearchParams, useNavigation } from 'expo-router'
import { ChevronRight, Pencil, Trash2 } from 'lucide-react-native'
import React, { useLayoutEffect, useRef } from 'react'
import { Alert, View } from 'react-native'

const ExpenseDetailPage = () => {
  const { id, toCategoryId } = useGlobalSearchParams()
  const { expenseDetailData, updateExpense, deleteExpense, isFetching } =
    useExpenseDetail(Number(id))
  const { categoriesData } = useCategories()

  const category = categoriesData.find(
    (cat) => cat.id === expenseDetailData.categoriaId,
  )

  const dropdownRef = useRef<DropdownRef>(null)

  const navigation = useNavigation()
  useLayoutEffect(() => {
    if (category?.nombre) {
      navigation.setOptions({
        headerRight: () => (
          <Dropdown
            width={200}
            data={[
              {
                value: 'edit',
                label: 'Editar gasto',
                icon: Pencil,
                onPress: () => handleEditExpense(),
              },
              {
                value: 'delete',
                label: 'Eliminar gasto',
                icon: Trash2,
                destructive: true,
                onPress: () => handleDeleteExpense(),
              },
            ]}
            onChange={() => {}}
            type="button"
          />
        ),
      })
    }
  }, [category])

  async function handleEditExpense() {
    dropdownRef.current?.close
    router.push({
      pathname: '/expense/categories-list',
      params: { expenseId: id },
    })
  }

  async function handleDeleteExpense() {
    Alert.alert(
      '¿Estás seguro que deseas eliminar este gasto?',
      'Esta acción es IRREVERSIBLE',
      [
        { text: 'Cancelar' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(Number(id))
              router.back()
            } catch (error) {
              console.log(error)
              toastService.show('Error al eliminar gasto', 'error')
            }
          },
        },
      ],
    )
  }

  return (
    <Container activity={isFetching}>
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
            <Link href="/expense" asChild>
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
