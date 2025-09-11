import React, {useState} from "react"
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"

export default function HomePage() {
  const router = useRouter()
  const [balance, setBalance] = useState(0);

  const addIncome = (amount = 1000) => {
    setBalance(balance + amount);
  };
  
  const addExpense = (amount = 500) => {
    setBalance(balance - amount);
  };

  return (
    <View className="flex-1 bg-gray-100 items-center justify-center p-5">
      <Text className="text-lg font-semibold mb-4">Bienvenido a Spendee!</Text>

      <View className="bg-white rounded-2xl shadow-lg p-6 mb-10 w-4/5 items-center">
          <Text className="text-lg text-gray-500">Balance actual</Text>
          <Text className="text-4xl font-bold text-green-600 mt-2">
            ${balance}
          </Text>
      </View>
      <View className="flex-row space-x-4">
        <TouchableOpacity
          onPress={() => addIncome()}
          className="bg-green-500 rounded-2xl px-6 py-4 shadow"
        >
          <Text className="text-white font-semibold text-lg">
            + Ingreso
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => addExpense()}
          className="bg-red-500 rounded-2xl px-6 py-4 shadow"
        >
          <Text className="text-white font-semibold text-lg">
            - Egreso
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

