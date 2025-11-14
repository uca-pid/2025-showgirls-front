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
import { useColorScheme } from 'nativewind'
import { useState, useEffect } from 'react'
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

  //definicion del type de datos workshop
   type Workshop = {
    id: number
    name: string
  }
  
  const { workshopId ,workshopName, serviceId, serviceName, servicePrice = 0 } = useLocalSearchParams()


  const user = auth.currentUser
  if (user) {
    var balanceData = balanceService.findByUserId(user.uid)
    var userId = user.uid
  }
  const router = useRouter()

  const { addExpense } = useExpenses(user ? user.uid : '')
  const { categoryId, expense } = useLocalSearchParams()
  const [amount, setAmount] = useState(expense ? (expense as string) : '')
  const [error, setError] = useState('')

  const formatAmount = (value: string) => {
    if (!value) return ''
    return parseInt(value, 10).toLocaleString('es-AR')
  }

  const onSubmit = async () => {
    if (Number(servicePrice) <= 0) {
      setError('Ingresa un monto')
      return
    } else if (!workshopId) {
      setError('Selecciona un taller')
      return
    } else if (!serviceId) {
      setError('Selecciona un servicio')
      return
    } else {
      try {
        await addExpense({
          usuarioId: userId,
          gasto: Number(servicePrice),
          montoAnterior: (await balanceData).data.balance,
          categoriaId: 8, //ID fijo para "Talleres Mecanicos"
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
              <Text className="font-semibold text-lg">Estaller</Text>
              <Text className="text-lg color-pink-300" onPress={onSubmit}>
                Agregar
              </Text>
            </CardHeader>

            <CardContent className="gap-4 w-full h-full items-center">
              <Button
                variant="ghost"
                className="gap-0"
                onPress={() =>
                  router.push({
                    pathname: '/expense/modal/workshops-list',
                    params: { expense: amount },
                  })
                }
              >
                <Text className="text-base">Taller: </Text>
                {workshopId ? (
                  <Text className="text-base font-semibold">
                    {
                      workshopName
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
              <Button
                variant="ghost"
                className="gap-0"
                onPress={() =>
                  router.push({
                    pathname: '/expense/modal/services-list',
                    params: { workshopId: workshopId, workshopName: workshopName },
                  })
                }
                disabled={!workshopId}
              >
                <Text className="text-base">Servicio: </Text>
                {serviceId ? (
                  <Text className="text-base font-semibold">
                    {
                      serviceName
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
              <View className="flex-row items-center justify-center gap-2">
                <Text className="text-3xl color-pink-300">$</Text>
                <View className="items-center justify-center w-[250px] h-[64px] border-b-2 border-b-pink-300">
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
                    value={servicePrice ? String(servicePrice) : amount}
                    placeholder={servicePrice ? `${servicePrice}`: "0"}
                    placeholderTextColor={
                      useColorScheme().colorScheme === 'dark'
                        ? 'white'
                        : 'black'
                    }
                    editable={false}
                  />
                </View>
              </View>
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
