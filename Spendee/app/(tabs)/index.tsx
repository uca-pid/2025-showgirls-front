import DonutChart from '@/components/DonutChart'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/context/AuthContext'
import useBalance from '@/hooks/useBalance'
import useCategories from '@/hooks/useCategories'
import useChartData from '@/hooks/useChartData'
import useExpenses from '@/hooks/useExpenses'
import { getIcon } from '@/lib/getIcon'
import { Link, router } from 'expo-router'
import { BanknoteArrowDown, BanknoteArrowUp } from 'lucide-react-native'
import { FlatList, ScrollView, View } from 'react-native'

const actions = [
  {
    text: 'Ingresar',
    textColor: 'white',
    icon: BanknoteArrowUp,
    onPress: () => {
      router.push('/income/modal/add')
    },
  },
  {
    text: 'Egresar',
    textColor: 'white',
    icon: BanknoteArrowDown,
    onPress: () => {
      router.push('/expense/modal/add')
    },
  },
]

export default function HomePage() {
  const { user } = useAuth()
  const { categoriesData } = useCategories()
  const { balanceData } = useBalance(user?.uid ?? '')
  const { expensesData } = useExpenses(user?.uid ?? '', 5)
  const { chartData, isLoading } = useChartData()

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      className="w-screen h-screen"
      contentContainerClassName="align-center items-center gap-4 p-6"
    >
      <Card
        className={`w-full border-0 rounded-[30px] p-6 gap-2 justify-center`}
      >
        <CardContent className="gap-2 p-0 flex-row justify-between">
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
              $
              {new Intl.NumberFormat('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(balanceData.balance)}
            </Text>
          </View>
          <Avatar alt="avatar" className="size-16">
            <AvatarImage
              source={{
                uri: 'https://avatars.githubusercontent.com/u/128428130?s=400&u=154b02377441fc7a0291585f397c42ec976eebb0&v=4 ',
              }}
            />
          </Avatar>
        </CardContent>
      </Card>

      <Card className="w-full border-0 rounded-[30px] p-6 gap-2 justify-center">
        <Link href="/expense" asChild>
          <Text className="text-muted-foreground">Mis gastos</Text>
        </Link>
        <CardContent
          className="justify-center items-center"
          onTouchEnd={() => router.push('/expense')}
        >
          <DonutChart
            data={chartData}
            centerText={
              isLoading
                ? ''
                : `$${chartData.reduce((sum, item) => sum + item.value, 0)}`
            }
            centerTextColor="white"
            size={210}
            strokeWidth={20}
          />
        </CardContent>
      </Card>
      <FlatList
        scrollEnabled={false}
        data={expensesData}
        renderItem={({ item, index }) => (
          <Card
            className={`border-0 flex-row w-full justify-between p-4 items-center mb-${index !== expensesData.length - 1 ? '2' : '[120px]'}`}
          >
            <View className="gap-1">
              <View className="flex-row items-center gap-2">
                <Text>
                  Gasto en{' '}
                  {
                    categoriesData.find((cat) => cat.id === item.categoriaId)
                      ?.nombre
                  }
                </Text>
              </View>
              <Text className="text-muted-foreground">
                {new Date(item.fecha).toLocaleDateString('en-GB')}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Icon
                size={20}
                color={
                  categoriesData.find((cat) => cat.id === item.categoriaId)
                    ?.color
                }
                as={getIcon(
                  categoriesData.find((cat) => cat.id === item.categoriaId)
                    ?.icono ?? '',
                )}
              />
              <Badge variant="outline">
                <Text className="text-sm">{String('$' + item.gasto)}</Text>
              </Badge>
            </View>
          </Card>
          //   <ItemButton
          //     key={item.id}
          //     text={String('$ ' + item.gasto)}
          //     borderBottom={index !== expensesData.length - 1}
          //     iconLeft={getIcon(
          //       categoriesData.find((cat) => cat.id === item.categoriaId)
          //         ?.icono ?? '',
          //     )}
          //     iconLeftColor={
          //       categoriesData.find((cat) => cat.id === item.categoriaId)
          //         ?.color
          //     }
          //   />
        )}
      />
    </ScrollView>
  )
}
