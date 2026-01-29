import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { toastService } from '@/context/ToastContext'
import { auth } from '@/firebase.config'
import useCategories from '@/hooks/useCategories'
import useExpenses from '@/hooks/useExpenses'
import usePiggy from '@/hooks/usePiggy'
import balanceService from '@/services/balance.service'
import useThemeColor from '@/theme/useThemeColor'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ChevronDown } from 'lucide-react-native'
import { useColorScheme } from 'nativewind'
import { useState } from 'react'
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

export default function AddExpensePage() {
  const { colorHex } = useThemeColor()
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { updateObjective } = usePiggy()

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
    }

    try {
      setIsSubmitting(true) // <-- empieza el loading

      await addExpense({
        usuarioId: userId,
        gasto: Number(amount),
        montoAnterior: (await balanceData).data.balance,
        categoriaId: Number(categoryId),
      })

      await updateObjective('expense') // <-- acá se verá el spinner

      toastService.show('Gasto añadido con éxito', 'success')
      router.dismissAll()
      router.replace('/')
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false) // <-- termina el loading sí o sí
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
                style={{ color: colorHex }}
                className="text-lg"
                onPress={() => router.back()}
              >
                Cerrar
              </Text>
              <Text
                style={{ color: colorHex }}
                className="font-semibold text-lg"
              >
                Nuevo Gasto
              </Text>
              <Text
                style={{ color: colorHex }}
                className="text-lg"
                onPress={onSubmit}
              >
                Agregar
              </Text>
            </CardHeader>

            <CardContent className="gap-6 w-full h-full items-center">
              <View className="flex-row items-center justify-center gap-2">
                <Text style={{ color: colorHex }} className="text-3xl">
                  $
                </Text>
                <View
                  className="items-center justify-center w-[250px] h-[64px] border-b-2"
                  style={{ borderColor: colorHex }}
                >
                  <TextInput
                    style={{
                      color:
                        useColorScheme().colorScheme === 'dark'
                          ? 'white'
                          : 'black',
                      fontSize: 42,
                      textAlign: 'center',
                      width: '100%',
                      height: '100%',
                      paddingBottom: 10,
                    }}
                    maxLength={9}
                    keyboardType="number-pad"
                    returnKeyType="next"
                    onSubmitEditing={onSubmit}
                    onChangeText={setAmount}
                    value={amount}
                    placeholder="0"
                    placeholderTextColor={
                      useColorScheme().colorScheme === 'dark'
                        ? 'white'
                        : 'black'
                    }
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
                <ChevronDown
                  color={
                    useColorScheme().colorScheme === 'dark' ? 'white' : 'black'
                  }
                  size={18}
                />
              </Button>
              {error && <Text className="text-red-700 text-base">{error}</Text>}
              <Button
                style={{ backgroundColor: colorHex }}
                className="w-full"
                onPress={onSubmit}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <Text className="text-white font-semibold">
                    Agregar gasto
                  </Text>
                )}
              </Button>
            </CardContent>
          </Card>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}
