import { useEffect, useState } from 'react'
import {
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  ScrollView,
  Pressable,
} from 'react-native'
import { Card, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
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
import { useIsFocused } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { auth } from '@/firebase.config'
import ApiService from '../../services/api.service'
import balanceService from '../../services/balance.service'
import IconMenu from '@/components/IconMenu'
import { router } from 'expo-router'
import expenseService from '../../services/expense.service'
import { ExpenseResponse } from '../../services/expense.service'
import ItemMenu from '@/components/ItemMenu'
import DonutChart from '@/components/DonutChart'
import { useSharedValue } from 'react-native-reanimated'

export default function HomePage() {
  const [balance, setBalance] = useState(0)
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const [userExpenses, setUserExpenses] = useState<ExpenseResponse[]>([])
  const [transaccion, setTransaccion] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<number>(0)

  const user = auth.currentUser

  useEffect(() => {
    const userId = user?.uid
    if (userId !== undefined) setData(userId)
  }, [user])

  const calculateBalance = (balance: number, amount: number, type: string) => {
    if (type === 'income') {
      return balance + amount
    } else if (type === 'expense') {
      return balance - amount
    }
    return balance
  }

  const handleTransaction = async () => {
    const numericAmount = parseFloat(amount.replace(',', '.'))
    if (transaccion === 'income') {
      setIncome(income + numericAmount)
      await addIncome()
    }
    if (transaccion === 'expense') {
      setExpense(expense + numericAmount)
      await addExpense()
    }
    setBalance(calculateBalance(balance, numericAmount, transaccion))
  }

  const verifyAmount = () => {
    const numericAmount = parseFloat(amount.replace(',', '.'))
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Por favor, ingrese un monto válido mayor que cero.')
      return
    }
    setAmount(amount)
    handleTransaction()
  }

  const addIncome = async () => {
    const userId = user?.uid
    const numericAmount = parseFloat(amount.replace(',', '.'))
    await ApiService.post('/ingreso', {
      userId: userId,
      ingreso: numericAmount,
      montoAnterior: balance,
    })
  }

  const addExpense = async () => {
    const userId = user?.uid
    const numericAmount = parseFloat(amount.replace(',', '.'))
    await ApiService.post('/gasto', {
      userId: userId,
      gasto: numericAmount,
      montoAnterior: balance,
      categoriaId: selectedCategory,
    })
  }

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
        setIncome(data.sumaIngresos)
        setExpense(data.sumaGastos)
        setBalance(data.balance)
      })
  }

  const actions = [
    {
      text: 'Ingresar',
      icon: BanknoteArrowUp,
      onPress: () => {
        setTransaccion('income')
        setModalVisible(true)
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

  const data = [
    { value: 40, color: '#FF6B6B', icon: Heart },
    { value: 30, color: '#4ECDC4', icon: Wine },
    { value: 30, color: '#FFD93D', icon: TreePalm },
  ]

  const colors = chartData.map((item) => item.categoryColor)
  const total = chartData.reduce((sum, item) => sum + item.value, 0)
  const decimals = useSharedValue(chartData.map((item) => item.value / total))

  const radius = 100
  const strokeWidth = 20
  const outerStrokeWidth = 30
  const gap = 0.01

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

        <Modal transparent={true} visible={modalVisible} animationType="fade">
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-white rounded-2xl p-6 w-4/5 shadow-lg">
              <Text className="text-xl font-bold text-gray-800 mb-4">
                {transaccion === 'income'
                  ? 'Agregar Ingreso'
                  : 'Agregar Egreso'}
              </Text>

              <TextInput
                placeholder="Ingrese monto"
                placeholderTextColor="gray"
                keyboardType="numeric"
                onChangeText={setAmount}
                className="border border-gray-300 rounded-lg p-3 mb-4 text-lg"
              />
              <View className="flex-row justify-between">
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="bg-gray-400 rounded-xl px-5 py-3"
                >
                  <Text className="text-white font-semibold">Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={async () => {
                    await verifyAmount()
                    setModalVisible(false)
                  }}
                  className="bg-blue-500 rounded-xl px-5 py-3"
                >
                  <Text className="text-white font-semibold">Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </LinearGradient>
  )
}
