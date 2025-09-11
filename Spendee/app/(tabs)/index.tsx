import React, {useState} from "react"
import { View, Text, Button, StyleSheet, TouchableOpacity, Modal, TextInput } from "react-native"
import { useRouter } from "expo-router"

export default function HomePage() {
  const router = useRouter()
  const [balance, setBalance] = useState(0);
  const [transaccion, setTransaccion] = useState(String);
  const [amount, setAmount] = useState(String);
  const [modalVisible, setModalVisible] = useState(false);

  const handleTransaction = (amount: string) => {
    const numericAmount = parseFloat(amount);
    if (transaccion === 'income') {
      setBalance(balance + numericAmount);
    } else if (transaccion === 'expense') {
      setBalance(balance - numericAmount);
    }
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
          onPress={() => {setTransaccion('income'); setModalVisible(true)}}
          className="bg-green-500 rounded-2xl px-6 py-4 shadow"
        >
          <Text className="text-white font-semibold text-lg">
            + Ingreso
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {setTransaccion('expense'); setModalVisible(true)}}
          className="bg-red-500 rounded-2xl px-6 py-4 shadow">
          <Text className="text-white font-semibold text-lg">
            - Egreso
          </Text>
        </TouchableOpacity>
      </View>
      
      <Modal transparent={true} visible={modalVisible} animationType="slide">
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
                  handleTransaction(amount);
                  setAmount("");
                  setModalVisible(false);
                }}
                className="bg-blue-500 rounded-xl px-5 py-3"
              >
                <Text className="text-white font-semibold">Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </Modal>

    </View>
  )
}

