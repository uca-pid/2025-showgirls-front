import { View, Text, FlatList, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { PieChart } from 'react-native-gifted-charts'
import {
  BookOpen,
  Bus,
  ChevronRight,
  Ellipsis,
  Gamepad2,
  Heart,
  House,
  LucideIcon,
  Paperclip,
  Plus,
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
import ApiService from '../services/api.service'
import { useIsFocused } from '@react-navigation/native'
import { auth } from '@/firebase.config'
import balanceService from '../services/balance.service'
import ItemMenu from '@/components/ItemMenu'
import IconButton from '@/components/IconButton'
import { router } from 'expo-router'
import { Button } from '@/components/ui/button'

const index = () => {
  const [balance, setBalance] = useState(0)
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const [selected, setSelected] = useState(false)

  const user = auth.currentUser

  useEffect(() => {
    const userId = user?.uid
    if (userId) setData(userId)
  }, [user])

  const setData = async (userId: string) => {
    await balanceService
      .findByUserId(userId)
      .then((res) => res.data)
      .then((data) => {
        setIncome(data.sumaIngresos)
        setExpense(data.sumaGastos)
        setBalance(data.balance)
      })
  }

  // Chart data (initially empty — will be loaded from server)
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
        console.log(res)
        const items = res?.data ?? []
        console.log(items)
        if (!Array.isArray(items)) return

        const mapped = items.map((c: any) => ({
          categoryIcon:
            iconNameToEmoji[c.icono] ??
            iconNameToEmoji[c.icon] ??
            c.icono ??
            c.icon ??
            String(c.categoria?.charAt?.(0) ?? '📦'),
          value: Number(
            c.totalGastos ?? c.value ?? c.amount ?? c.total ?? c.monto ?? 0,
          ),
          categoryColor: c.color ?? '#A78BFA',
          categoryName: c.categoria ?? c.name ?? '',
          categoryId: c.id ?? c._id ?? null,
        }))

        if (mounted) setChartData(mapped)
      } catch (err) {
        console.warn('Error fetching categories:', err)
        // keep chartData empty if failure
      } finally {
        if (mounted) setChartLoading(false)
      }
    }

    if (isFocused) fetchCategories()

    return () => {
      mounted = false
    }
  }, [isFocused])

  return (
    <View className="w-full h-full bg-background pt-8">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="items-center gap-6 pb-8"
      >
        <Card className="w-[92%] bg-foreground border-0 rounded-m p-2 py-4 gap-2 justify-center">
          <CardTitle className="text-secondary text-m pl-2">
            Gastos por categoría
          </CardTitle>
          <CardContent className="gap-2 items-center">
            {chartLoading ? (
              <View className="py-6">
                <Text className="text-center text-gray-500">
                  Cargando categorías...
                </Text>
              </View>
            ) : chartData && chartData.length > 0 ? (
              <>
                <PieChart
                  donut
                  innerRadius={95}
                  strokeColor="#fafafa"
                  strokeWidth={5}
                  data={chartData}
                  centerLabelComponent={() => (
                    <View className="items-center">
                      <Text className="text-lg font-semibold text-gray-800">
                        Gastos Totales
                      </Text>
                      <Text className="text-xl font-bold text-gray-800">
                        ${expense}
                      </Text>
                    </View>
                  )}
                />
                <FlatList
                  scrollEnabled={false}
                  className="w-screen p-4"
                  data={chartData}
                  renderItem={({ item, index }) => (
                    <Card
                      className="rounded-none bg-foreground border-0 relative"
                      style={
                        index === 0 && chartData.length > 1
                          ? {
                              borderTopLeftRadius: 30,
                              borderTopRightRadius: 30,
                              borderTopWidth: 0,
                            }
                          : index === chartData.length - 1 &&
                              chartData.length > 1
                            ? {
                                borderBottomLeftRadius: 30,
                                borderBottomRightRadius: 30,
                              }
                            : chartData.length === 1
                              ? { borderRadius: 30 }
                              : {}
                      }
                      key={index}
                    >
                      {index !== 0 && chartData.length > 1 ? (
                        <View className="absolute border-t-[1.2px] border-gray-300 w-[90%] top-0 left-[5%]"></View>
                      ) : (
                        <></>
                      )}
                      <CardContent className="flex-row justify-between items-center">
                        <Button onLongPress={() => setSelected(!selected)}>
                          <ItemMenu
                            text={item.categoryName}
                            icon={item.categoryIcon}
                            color="#F9A8D4"
                            selected={selected}
                          />
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                />
              </>
            ) : (
              <View className="py-6">
                <Text className="text-center text-gray-500">
                  No hay categorías
                </Text>
              </View>
            )}
          </CardContent>
        </Card>
        <IconButton
          icon={Plus}
          onPress={() => router.push('./category')}
          text={'Agregar Categoria'}
        />
      </ScrollView>
    </View>
  )
}

export default index
