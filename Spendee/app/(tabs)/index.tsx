import BudgetCard from '@/components/BudgetCard'
import Container from '@/components/Container'
import DonutChart from '@/components/DonutChart'
import IconButton from '@/components/IconButton'
import ItemCard from '@/components/ItemCard'
import Section from '@/components/Section'
import SectionCard from '@/components/SectionCard'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/context/AuthContext'
import useBalance from '@/hooks/useBalance'
import useBudgets from '@/hooks/useBudget'
import useCategories from '@/hooks/useCategories'
import useChartData from '@/hooks/useChartData'
import useExpenses from '@/hooks/useExpenses'
import { getIcon } from '@/lib/getIcon'
import { router } from 'expo-router'
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  ChevronRight,
  Info,
} from 'lucide-react-native'
import { useMemo, useState } from 'react'
import {
  FlatList,
  Pressable,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native'

const actions = [
  {
    text: 'Ingreso',
    textColor: 'white',
    icon: BanknoteArrowUp,
    onPress: () => {
      router.push('/income/modal/add')
    },
  },
  {
    text: 'Egreso',
    textColor: 'white',
    icon: BanknoteArrowDown,
    onPress: () => {
      router.push('/expense/modal/add')
    },
  },
]

export default function HomePage() {
  const { user } = useAuth()
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const {
    futureBudgets,
    currentBudget,
    pastBudgets,
    isFetching,
    isRefetching,
  } = useBudgets(user?.uid ?? '')
  const monthNames = useMemo(
    () => [
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
    ],
    [],
  )

  const today = useMemo(() => new Date(), [])
  const currentMonthIndex = today.getMonth()
  const currentYear = today.getFullYear()
  const monthLabel = `${monthNames[currentMonthIndex]}`
  const {
    categoriesData,
    isFetching: fetchingCategories,
    refetch: refetchCategories,
  } = useCategories()

  const {
    balanceData,
    isFetching: fetchingBalance,
    refetch: refetchBalance,
  } = useBalance(user?.uid ?? '')

  const {
    expensesData,
    isFetching: fetchingExpenses,
    refetch: refetchExpenses,
  } = useExpenses(user?.uid ?? '', { limit: 5, order: 'desc' })

  const {
    chartData,
    isFetching: fetchingChart,
    refetch: refetchChart,
  } = useChartData({ month: currentMonthIndex + 1, year: currentYear })

  const formattedBalance = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balanceData.balance)

  const refreshing =
    fetchingBalance || fetchingCategories || fetchingExpenses || fetchingChart

  function handleRefresh() {
    refetchBalance()
    refetchCategories()
    refetchExpenses()
    refetchChart()
  }

  function toggleCategory(categoryId: number) {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    )
  }

  const filteredChartData =
    selectedCategories.length > 0
      ? chartData.filter((c) => selectedCategories.includes(Number(c.id)))
      : chartData

  return (
    <Container
      activity={refreshing}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={!refreshing ? 'gray' : 'black'}
        />
      }
    >
      <Section>
        <SectionCard justify="between" flex="row">
          <View>
            <Pressable onPress={() => router.push('/movements')}>
              <Text className="text-muted-foreground">Tu balance</Text>
              <Text
                className={
                  balanceData.balance.toString().length > 8
                    ? 'text-2xl'
                    : 'text-4xl'
                }
                numberOfLines={1}
              >
                {'$ ' + formattedBalance}
              </Text>
            </Pressable>
          </View>
          <Avatar
            alt="avatar"
            className="size-16"
            onTouchEnd={() => router.push('/profile')}
          >
            <AvatarImage
              source={{
                uri: 'https://avatars.githubusercontent.com/u/128428130?s=400&u=154b02377441fc7a0291585f397c42ec976eebb0&v=4 ',
              }}
            />
          </Avatar>
        </SectionCard>
      </Section>

      {expensesData.length === 0 && (
        <SectionCard flex="row" className="px-4">
          <Info size={24} color={'gray'} />
          <Text className="text-m text-muted-foreground">
            Para comenzar, añadí un egreso en la sección Acciones Rápidas
          </Text>
        </SectionCard>
      )}
      <Section
        title="Acciones Rápidas"
        /*actionIcon={Pencil}
        actionText="Editar"
        onActionPress={() => {}}*/
      >
        <SectionCard flex="row">
          <FlatList
            contentContainerStyle={{ justifyContent: 'space-between' }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={actions}
            renderItem={({ item }) => (
              <IconButton
                text={item.text}
                textColor={item.textColor}
                icon={item.icon}
                onPress={item.onPress}
              />
            )}
          />
        </SectionCard>
      </Section>

      <Section
        title="Presupuesto Actual"
        actionText="Ver más"
        actionIcon={ChevronRight}
        onActionPress={() => router.push('/budget')}
        activity={isFetching || isRefetching}
      >
        {currentBudget ? (
          <BudgetCard budget={currentBudget} />
        ) : (
          <Text className="text-center text-muted-foreground text-lg mt-4">
            No tenés un presupuesto activos
          </Text>
        )}
      </Section>
      <Section
        title={`Mis Gastos de ${monthLabel}`}
        showWhen={expensesData.length > 0}
      >
        <SectionCard onPress={() => router.push('/expense')}>
          <SectionCard flex="row" className="width-full">
            <FlatList
              data={categoriesData.filter((cat) => cat.totalGastos > 0)}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                justifyContent: 'center',
                gap: 8,
              }}
              renderItem={({ item: cat }) => {
                const isSelected = selectedCategories.includes(cat.id)
                return (
                  <TouchableOpacity
                    onPress={() => toggleCategory(cat.id)}
                    activeOpacity={0.7}
                    style={{
                      borderRadius: 8,
                      paddingHorizontal: 14,
                      paddingVertical: 4,
                      marginHorizontal: 6,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      borderWidth: isSelected ? 2 : 0,
                      borderColor: isSelected ? cat.color : 'transparent',
                      backgroundColor: isSelected
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <View
                      className="rounded-full w-2 h-2"
                      style={{ backgroundColor: cat.color }}
                    />
                    <Text
                      style={{
                        color: isSelected ? 'white' : 'white',
                        fontWeight: isSelected ? '600' : '500',
                        fontSize: 14,
                      }}
                    >
                      {cat.nombre}
                    </Text>
                  </TouchableOpacity>
                )
              }}
            />
          </SectionCard>
          <DonutChart
            showWhen={
              filteredChartData.filter((item) => item.value > 0).length >= 0
            }
            data={filteredChartData}
            centerText={`$${new Intl.NumberFormat('es-AR').format(
              filteredChartData.reduce((sum, item) => sum + item.value, 0),
            )}`}
            centerTextColor="white"
            size={210}
            strokeWidth={20}
          />

          <View className="flex-row items-center">
            <Text className="text-muted-foreground">
              Ver gastos por categoría
            </Text>
            <ChevronRight color="gray" />
          </View>
        </SectionCard>
      </Section>

      <Section
        title="Últimos gastos"
        actionText="Ver gastos"
        actionIcon={ChevronRight}
        onActionPress={() => router.push('/expense/list')}
        showWhen={expensesData.length > 0}
      >
        <FlatList
          scrollEnabled={false}
          data={expensesData}
          renderItem={({ item }) => {
            const category = categoriesData.find(
              (cat) => cat.id === item.categoriaId,
            )
            const title = 'Gasto en ' + category?.nombre
            const icon = getIcon(category?.icono ?? '')
            const color = category?.color ?? 'white'
            const date = new Date(item.fecha).toLocaleDateString('en-GB')
            const amount = `-$${item.gasto}`

            return (
              <ItemCard
                title={title}
                description={date}
                badgeText={amount}
                icon={icon}
                iconColor={color}
                onPress={() =>
                  router.push({
                    pathname: '/expense/[id]',
                    params: { id: item.id },
                  })
                }
              />
            )
          }}
        />
      </Section>
    </Container>
  )
}
