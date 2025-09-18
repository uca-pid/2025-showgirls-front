import React, { useEffect, useState } from "react"
import { View, TouchableOpacity, Modal, TextInput } from "react-native"
import { router, useRouter } from "expo-router"
import { Card, CardTitle, CardContent } from "@/components/ui/card"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react-native"
import { useHeaderHeight } from "@react-navigation/elements"
import { onAuthStateChanged, getAuth } from "firebase/auth"
import { LinearGradient } from "expo-linear-gradient"

const IP_PUBLIC = "192.168.1.35"

export const calculateBalance = (
  balance: number,
  amount: number,
  type: string,
) => {
  if (type === "income") {
    return balance + amount
  } else if (type === "expense") {
    return balance - amount
  }
  return balance
}

export default function HomePage() {
  const [balance, setBalance] = useState(0)
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const [transaccion, setTransaccion] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [modalVisible, setModalVisible] = useState(false)
  const headerHight = useHeaderHeight()
  const [profile, setProfile] = useState<{
    uid?: string
    displayName?: string
    email?: string
    photoURL?: string
  } | null>(null)

  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setProfile({
          uid: user.uid,
          displayName: user.displayName ?? "",
          email: user.email ?? "",
          photoURL: user.photoURL ?? "",
        })
        getBalance(user.uid)
      } else {
        router.replace("/sign-in/SignInPage")
      }
    })

    return () => unsubscribe()
  }, [])

  const handleTransaction = () => {
    const numericAmount = parseFloat(amount)
    if (transaccion === "income") {
      setIncome(income + numericAmount)
      addIncome()
    }
    if (transaccion === "expense") {
      setExpense(expense + numericAmount)
      addExpense()
    }
    setBalance(calculateBalance(balance, numericAmount, transaccion))
  }

  const addIncome = () => {
    const user = profile?.uid
    const numericAmount = parseFloat(amount)
    console.log("User ID:", user)
    fetch(`http://${IP_PUBLIC}:3000/ingreso`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user,
        ingreso: numericAmount,
        montoAnterior: balance,
      }),
    })
      .then((res) => {
        console.log("Status:", res.status)
        return res.json()
      })
      .then((data) => console.log("Respuesta backend:", data))
      .catch((err) => console.error("Error en fetch:", err))
  }

  const addExpense = () => {
    const user = profile?.uid
    const numericAmount = parseFloat(amount)
    fetch(`http://${IP_PUBLIC}:3000/gasto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user,
        gasto: numericAmount,
        montoAnterior: balance,
      }),
    })
      .then((res) => {
        console.log("Status:", res.status)
        return res.json()
      })
      .then((data) => console.log("Respuesta backend:", data))
      .catch((err) => console.error("Error en fetch:", err))
  }

  const getBalance = (userId: string) => {
    fetch(`http://${IP_PUBLIC}:3000/balance/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setBalance(data.balance)
        setIncome(data.sumaIngresos)
        setExpense(data.sumaGastos)
        console.log("Balance fetched:", data)
      })
      .catch((err) => console.error("Error fetching balance:", err))
  }

  return (
    <LinearGradient
      colors={["#F9A8D4", "#121212"]}
      style={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        flex: 1,
        gap: 20,
        paddingTop: headerHight,
      }}
      start={{ x: 0.5, y: 0.0 }}
      end={{ x: 0.5, y: 1.0 }}
      locations={[0, 0.7]}
    >
      <Card className="w-[92%] bg-foreground border-0 rounded-m p-2 pt-4 gap-2 justify-center">
        <CardTitle className="text-secondary text-m pl-2">
          Balance actual
        </CardTitle>
        <CardContent>
          <Text className="text-4xl font-bold text-secondary text-left">
            ${new Intl.NumberFormat("es-AR").format(balance)}
          </Text>
        </CardContent>

        <View className="flex-row gap-4 p-2 align-center justify-center">
          <Button
            variant={"secondary"}
            onPress={() => {
              setTransaccion("income")
              setModalVisible(true)
            }}
            className="size-2xl"
          >
            <Plus size={20} color={"white"} />
            <Text className="text-white font-bold">Ingreso</Text>
          </Button>

          <Button
            variant={"secondary"}
            onPress={() => {
              setTransaccion("expense")
              setModalVisible(true)
            }}
            className="size-2xl"
          >
            <Minus size={20} color={"white"} />
            <Text className="text-white font-bold">Egreso</Text>
          </Button>
        </View>
        <View className="w-full p-4">
          <View className="justify-between w-full flex-row">
            <Text className="text-secondary">Ingresos Totales</Text>
            <Text className="text-secondary">
              ${new Intl.NumberFormat("es-AR").format(income)}
            </Text>
          </View>

          <View className="justify-between w-full flex-row">
            <Text className="text-secondary">Egresos Totales</Text>
            <Text className="text-secondary">
              ${new Intl.NumberFormat("es-AR").format(expense)}
            </Text>
          </View>
        </View>
      </Card>
      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-2xl p-6 w-4/5 shadow-lg">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              {transaccion === "income" ? "Agregar Ingreso" : "Agregar Egreso"}
            </Text>

            <TextInput
              placeholder="Ingrese monto"
              keyboardType="numeric"
              value={amount}
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
                onPress={() => {
                  handleTransaction()
                  setAmount(amount)
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
    </LinearGradient>
  )
}
