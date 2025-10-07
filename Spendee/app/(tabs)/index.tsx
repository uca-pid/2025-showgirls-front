import DonutChart from '@/components/DonutChart'
import IconMenu from '@/components/IconMenu'
import ItemMenu from '@/components/ItemMenu'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { auth } from '@/firebase.config'
import { useIsFocused } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import {
  ArrowBigDown,
  BanknoteArrowDown,
  BanknoteArrowUp,
  BookOpen,
  Bus,
  Ellipsis,
  Gamepad2,
  Heart,
  House,
  LucideIcon,
  Paperclip,
  Popcorn,
  Shield,
  Shuffle,
  Sigma,
  Sprout,
  Sun,
  TestTube,
  TreePalm,
  Users,
  Utensils,
  Wine,
  Wrench,
} from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { FlatList, Pressable, ScrollView, View } from 'react-native'
import ApiService from '../../services/api.service'
import balanceService from '../../services/balance.service'
import expenseService, { ExpenseResponse } from '../../services/expense.service'

export default function HomePage() {
  const [balance, setBalance] = useState(0)
  const [userExpenses, setUserExpenses] = useState<ExpenseResponse[]>([])
  const user = auth.currentUser

  useEffect(() => {
    const userId = user?.uid
    if (userId !== undefined) setData(userId)
  }, [user])

  const fetchExpenses = async (userId: string) => {
    try {
      const res = await expenseService.findByUserId(userId)
      setUserExpenses(res.data)
    } catch (err) {
      console.warn('Error fetching expenses:', err)
    }
  }

  const setData = async (userId: string) => {
    fetchExpenses(userId)
    await balanceService
      .findByUserId(userId)
      .then((res) => res.data)
      .then((data) => {
        setBalance(data.balance)
      })
  }

  const actions = [
    {
      text: 'Ingresar',
      icon: BanknoteArrowUp,
      onPress: () => {
        router.push('/income/modal/add')
      },
    },
    {
      text: 'Egresar',
      icon: BanknoteArrowDown,
      onPress: () => {
        router.push('/expense/modal/add')
      },
    },
  ]

  const [chartData, setChartData] = useState<any[]>([])
  const [chartLoading, setChartLoading] = useState(false)
  const isFocused = useIsFocused()

  const iconNameToEmoji: Record<string, LucideIcon> = {
    bus: Bus,
    utensils: Utensils,
    home: House,
    heart: Heart,
    gamepad: Gamepad2,
    book: BookOpen,
    Wrench: Wrench,
    Wine: Wine,
    Sprout: Sprout,
    Users: Users,
    TreePalm: TreePalm,
    TestTube: TestTube,
    Sun: Sun,
    Sigma: Sigma,
    Popcorn: Popcorn,
    Shuffle: Shuffle,
    Shield: Shield,
    Paperclip: Paperclip,
    '': Ellipsis,
    'ellipsis-h': Ellipsis,
  }

  useEffect(() => {
    let mounted = true
    const fetchCategories = async () => {
      setChartLoading(true)
      try {
        const res = await ApiService.get('/categories')
        const items = res?.data ?? []
        if (!Array.isArray(items)) return

        const mapped = items.map((c: any) => {
          return {
            categoryIcon: iconNameToEmoji[c.icono],
            value: Number(c.totalGastos),
            categoryColor: c.color,
            categoryName: c.nombre,
            categoryId: c.id,
          }
        })
        if (mounted) {
          setChartData(mapped)
        }
      } catch (err) {
        console.warn('Error fetching categories:', err)
      } finally {
        if (mounted) setChartLoading(false)
      }
    }

    if (isFocused) fetchCategories()

    return () => {
      mounted = false
    }
  }, [isFocused])

  const total = chartData.reduce((sum, item) => sum + item.value, 0)
  return (
    <LinearGradient
      colors={['#F9A8D4', '#FCA5A5']}
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        flex: 1,
        gap: 20,
      }}
      start={{ x: 0.5, y: 0.0 }}
      end={{ x: 0.5, y: 1.0 }}
      locations={[0, 0.7]}
    >
      <ScrollView
        className="w-screen h-screen"
        contentContainerClassName="align-center items-center gap-4 pb-4"
      >
        <Card className="w-[92%] bg-foreground border-0 rounded-m p-2 py-4 gap-2 justify-center">
          <CardTitle className="text-secondary text-m pl-2">
            Balance actual
          </CardTitle>
          <CardContent className="gap-2">
            <Text className="text-4xl font-bold text-secondary text-left">
              $
              {new Intl.NumberFormat('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(balance)}
            </Text>
            <IconMenu actions={actions} />
          </CardContent>
        </Card>

        <Card className="w-[92%] bg-foreground border-0 rounded-m p-2 py-4 gap-2 justify-center">
          <Pressable onPress={() => router.push('/expense')}>
            <CardTitle className="text-secondary text-m pl-2">
              Gastos por categoría
            </CardTitle>
            <CardContent className="gap-2 items-center">
              {chartLoading ? (
                <View className="items-center py-6">
                  <Text className="text-gray-500">Cargando categorías...</Text>
                </View>
              ) : chartData && chartData.length > 0 ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <DonutChart
                    data={chartData}
                    centerText={`Total: $${total}`}
                    size={210}
                    strokeWidth={20}
                  />
                </View>
              ) : (
                <View className="items-center py-6">
                  <Text className="text-gray-500">
                    No hay categorías para mostrar.
                  </Text>
                </View>
              )}
            </CardContent>
          </Pressable>
          <CardFooter className="p-0 items-center">
            <FlatList
              scrollEnabled={false}
              className="w-full"
              data={userExpenses}
              renderItem={({ item, index }) => (
                <Card
                  className="rounded-none bg-foreground border-0 relative py-2" //Hacer variable este padding para el componente en un futuro
                  style={
                    index === 0 && userExpenses.length > 1
                      ? {
                          borderTopLeftRadius: 30,
                          borderTopRightRadius: 30,
                          borderTopWidth: 0,
                        }
                      : index === userExpenses.length - 1 &&
                          userExpenses.length > 1
                        ? {
                            borderBottomLeftRadius: 30,
                            borderBottomRightRadius: 30,
                          }
                        : userExpenses.length === 1
                          ? { borderRadius: 30 }
                          : {}
                  }
                  key={item.id}
                >
                  {index !== 0 && userExpenses.length > 1 ? (
                    <View className="absolute border-t-[1.2px] border-gray-300 w-[90%] top-0 left-[5%]"></View>
                  ) : (
                    <></>
                  )}
                  <CardContent className="flex-row justify-between items-center">
                    <ItemMenu
                      onPress={() => {
                        router.push({
                          pathname: '/expense/[id]',
                          params: { id: item.id },
                        })
                      }}
                      text={`$ ${item.gasto.toString()}`}
                      icon={ArrowBigDown}
                      color="#F9A8D4"
                    />
                  </CardContent>
                </Card>
              )}
            />
          </CardFooter>
        </Card>
      </ScrollView>
    </LinearGradient>
  )
}
