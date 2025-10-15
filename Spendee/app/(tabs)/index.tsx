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
  Pencil,
} from 'lucide-react-native'
import { useMemo } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'

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
  } = useExpenses(user?.uid ?? '', 5, 'desc')

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
        actionIcon={Pencil}
        actionText="Editar"
        onActionPress={() => {}}
      >
        <SectionCard flex="row">
          <FlatList
            contentContainerClassName="justify-between"
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
        title={`Mis Gastos de ${monthLabel}`}
        showWhen={expensesData.length > 0}
      >
        <SectionCard onPress={() => router.push('/expense')}>
          {chartData.filter((item) => item.value > 0).length >= 3 && (
            <FlatList
              contentContainerClassName="flex-row items-center gap-2 w-full justify-center flex-wrap"
              horizontal
              scrollEnabled={false}
              data={chartData.sort((a, b) => b.value - a.value).slice(0, 3)}
              renderItem={({ item }) => {
                const category = categoriesData.find(
                  (category) => category.id === item.id,
                )

                return (
                  <View className="justify-center flex-row items-center gap-1 mr-2">
                    <View
                      className="rounded-full w-2 h-2"
                      style={{ backgroundColor: item.segmentColor }}
                    />
                    <Text className="text-muted-foreground">
                      {category?.nombre}
                    </Text>
                  </View>
                )
              }}
            />
          )}

          <DonutChart
            showWhen={chartData.filter((item) => item.value > 0).length >= 3}
            data={chartData}
            centerText={`$${new Intl.NumberFormat('es-AR').format(
              chartData.reduce((sum, item) => sum + item.value, 0),
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
