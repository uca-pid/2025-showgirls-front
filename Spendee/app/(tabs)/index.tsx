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
  Plus,
} from 'lucide-react-native'
import { FlatList, View } from 'react-native'

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
  const { categoriesData, isLoading: loadingCategories } = useCategories()
  const { balanceData, isLoading: loadingBalance } = useBalance(user?.uid ?? '')
  const { expensesData, isLoading: loadingExpenses } = useExpenses(
    user?.uid ?? '',
    5,
    'desc',
  )
  const { chartData, isLoading: loadingChartData } = useChartData()

  const formattedBalance = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balanceData.balance)

  return (
    <Container>
      <Section>
        <SectionCard activity={loadingBalance} justify="between" flex="row">
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
          <Avatar alt="avatar" className="size-16">
            <AvatarImage
              source={{
                uri: 'https://avatars.githubusercontent.com/u/128428130?s=400&u=154b02377441fc7a0291585f397c42ec976eebb0&v=4 ',
              }}
            />
          </Avatar>
        </SectionCard>
      </Section>

      <Section
        title="Acciones Rápidas"
        actionIcon={Plus}
        actionText="Añadir"
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

      <Section title="Mis Gastos">
        <SectionCard
          activity={loadingBalance}
          onPress={() => router.push('/expense')}
        >
          <View className="flex-row items-center gap-2 w-full flex-wrap">
            <View className="rounded-full w-2 h-2 bg-red-500" />
            <Text className="text-muted-foreground">Mis gastos</Text>
            <View className="rounded-full w-2 h-2 bg-red-500" />
            <Text className="text-muted-foreground">Mis gastos</Text>
            <View className="rounded-full w-2 h-2 bg-red-500" />
            <Text className="text-muted-foreground">Mis gastos</Text>
            <View className="rounded-full w-2 h-2 bg-red-500" />
            <Text className="text-muted-foreground">Mis gastos</Text>
          </View>
          <DonutChart
            data={chartData}
            centerText={
              loadingChartData
                ? ''
                : `$${chartData.reduce((sum, item) => sum + item.value, 0)}`
            }
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
              />
            )
          }}
        />
      </Section>
    </Container>
  )
}
