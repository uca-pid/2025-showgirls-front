import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { toastService } from '@/context/ToastContext'
import { auth } from '@/firebase.config'
import useCategories from '@/hooks/useCategories'
import useExpenses from '@/hooks/useExpenses'
import balanceService from '@/services/balance.service'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ChevronDown } from 'lucide-react-native'
import { useState } from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

export default function AddExpensePage() {
  const user = auth.currentUser
  if (user) {
    var balanceData = balanceService.findByUserId(user.uid)
    var userId = user.uid
  }
  const router = useRouter()
  const { categoriesData } = useCategories()
  const { addExpense } = useExpenses(user ? user.uid : '')
  const { categoryId, expense } = useLocalSearchParams()
  const [amount, setAmount] = useState(expense ? (expense as string) : '')
  const [error, setError] = useState('')

  const formatAmount = (value: string) => {
    if (!value) return ''
    return parseInt(value, 10).toLocaleString('es-AR')
  }

  const onSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      setError('Ingresa un monto')
      return
    } else if (!categoryId) {
      setError('Selecciona una categoría')
      return
    } else {
      try {
        await addExpense({
          usuarioId: userId,
          gasto: Number(amount),
          montoAnterior: (await balanceData).data.balance,
          categoriaId: Number(categoryId),
        })
        toastService.show('Gasto añadido con éxito', 'success')
        router.dismissAll()
        router.replace('/')
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          scrollEnabled={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Card className="bg-background w-full h-screen py-6 border-0">
            <CardHeader className="w-full justify-between flex-row">
              <Text
                className="text-lg color-pink-300"
                onPress={() => router.back()}
              >
                Cerrar
              </Text>
              <Text className="font-semibold text-lg">Nuevo Gasto</Text>
              <Text className="text-lg color-pink-300" onPress={onSubmit}>
                Agregar
              </Text>
            </CardHeader>

            <CardContent className="gap-6 w-full h-full items-center">
              <View className="flex-row items-center justify-center gap-2">
                <Text className="text-3xl color-pink-300">$</Text>
                <View className="items-center justify-center w-[250px] h-[64px] border-b-2 border-b-pink-300">
                  <TextInput
                    style={{
                      fontSize: 42,
                      textAlign: 'center',
                      width: '100%',
                      height: '100%',
                    }}
                    maxLength={9}
                    keyboardType="number-pad"
                    returnKeyType="next"
                    onSubmitEditing={onSubmit}
                    onChangeText={setAmount}
                    value={amount}
                    placeholder="0"
                    placeholderTextColor="white"
                  />
                </View>
              </View>

              <Button
                variant="ghost"
                className="gap-0"
                onPress={() =>
                  router.push({
                    pathname: '/expense/modal/categories-list',
                    params: { expense: amount },
                  })
                }
              >
                <Text className="text-base">Categoría: </Text>
                {categoriesData && categoryId ? (
                  <Text className="text-base font-semibold">
                    {
                      categoriesData.find(
                        (cat) => cat.id === Number(categoryId),
                      )?.nombre
                    }
                  </Text>
                ) : (
                  <Text className="text-muted-foreground text-base">
                    Seleccionar
                  </Text>
                )}
                <ChevronDown color="white" size={18} />
              </Button>
              {error && <Text className="text-red-700 text-base">{error}</Text>}
              <Button className="w-full bg-pink-300" onPress={onSubmit}>
                <Text>Añadir Gasto</Text>
              </Button>
            </CardContent>
          </Card>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}
