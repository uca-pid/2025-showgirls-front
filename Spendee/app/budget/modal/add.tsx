import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { toastService } from '@/context/ToastContext'
import { auth } from '@/firebase.config'
import useBudgets from '@/hooks/useBudget'
import piggyService from '@/services/piggy.service'
import useThemeColor from '@/theme/useThemeColor'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ChevronDown } from 'lucide-react-native'
import { useColorScheme } from 'nativewind'
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
import DateTimePicker, {
  DateType,
  useDefaultStyles,
} from 'react-native-ui-datepicker'

export default function AddBudgetPage() {
  const { colorHex } = useThemeColor()
  const user = auth.currentUser
  if (user) {
    var userId = user.uid
  }
  const router = useRouter()
  const { addBudget, budgetDates } = useBudgets(userId!)
  const { expense, catValues } = useLocalSearchParams()
  const [amount, setAmount] = useState(expense ? (expense as string) : '')
  const [error, setError] = useState('')
  const defaultStyles = useDefaultStyles()
  const [selectedRange, setSelectedRange] = useState({
    startDate: null as DateType | null,
    endDate: null as DateType | null,
  })
  const onSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      setError('Ingresa un monto')
      return
    } else if (!selectedRange.startDate || !selectedRange.endDate) {
      setError('Selecciona un rango de fechas')
      return
    } else if (catValues == undefined) {
      setError('Selecciona las categorías')
      return
    } else {
      try {
        addBudget({
          usuarioId: userId,
          monto: Number(amount),
          fechaInicio: new Date(selectedRange.startDate as string),
          fechaFin: new Date(selectedRange.endDate as string),
          PresupuestoCategoria: JSON.parse(catValues as string),
        })
        await piggyService.checkObjective('budget')
        toastService.show('Presupuesto añadido con éxito', 'success')
        router.dismissAll()
        router.replace('/')
        router.push('/budget/history')
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
                      fontSize: 42,
                      color:
                        useColorScheme().colorScheme === 'dark'
                          ? 'white'
                          : 'black',
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
              <View className="gap-2">
                <Button
                  variant="ghost"
                  className="gap-0"
                  disabled={!amount}
                  onPress={() =>
                    router.push({
                      pathname: '/budget/modal/category-picker',
                      params: { expense: amount, path: '/budget/modal/add' },
                    })
                  }
                >
                  <Text className="text-base">Categoría: </Text>
                  {catValues != undefined ? (
                    <Text className="text-base font-semibold">Asignadas</Text>
                  ) : (
                    <Text className="text-muted-foreground text-base">
                      Seleccionar
                    </Text>
                  )}
                  <ChevronDown
                    color={
                      useColorScheme().colorScheme === 'dark'
                        ? 'white'
                        : 'black'
                    }
                    size={18}
                  />
                </Button>
                <DateTimePicker
                  mode="range"
                  startDate={selectedRange.startDate || null}
                  endDate={selectedRange.endDate || null}
                  onChange={({ startDate, endDate }) => {
                    setSelectedRange({ startDate, endDate })
                  }}
                  styles={defaultStyles}
                  minDate={new Date()}
                  disabledDates={budgetDates}
                />
              </View>
              {error && <Text className="text-red-700 text-base">{error}</Text>}
              <Button
                style={{ backgroundColor: colorHex }}
                className="w-full"
                onPress={onSubmit}
              >
                <Text>Añadir Presupuesto</Text>
              </Button>
            </CardContent>
          </Card>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}
