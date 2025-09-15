import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Amphora } from "lucide-react-native";

export const calculateBalance = (
  balance: number,
  amount: number,
  type: string
) => {
  if (type === "income") {
    return balance + amount;
  } else if (type === "expense") {
    return balance - amount;
  }
  return balance;
};

export default function HomePage() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [transaccion, setTransaccion] = useState(String);
  const [amount, setAmount] = useState(String);
  const [modalVisible, setModalVisible] = useState(false);

  const handleTransaction = (amount: string) => {
    const numericAmount = parseFloat(amount);
    setBalance(calculateBalance(balance, numericAmount, transaccion));
  };

  return (
    <View className="flex-1 bg-gray-100 items-center justify-center p-5">
      <Text className="text-lg font-semibold mb-4">Bienvenido a Spendee!</Text>

      <View>
        <Card className="w-72 mb-6 bg-gray-300 border-gray-300">
          <CardTitle className="text-black text-center">
            Balance actual
          </CardTitle>
          <CardContent>
            <Text className="text-2xl font-bold text-black text-center">
              ${balance}
            </Text>
          </CardContent>
        </Card>
      </View>

      <View className="flex-row space-x-4 gap-4">
        <Button
          onPress={() => {
            setTransaccion("income");
            setModalVisible(true);
          }}
          className="size-2xl bg-green-500"
        >
          <Text className="text-white font-bold">+ Ingreso</Text>
        </Button>

        <Button
          onPress={() => {
            setTransaccion("expense");
            setModalVisible(true);
          }}
          className="size-2xl bg-red-500"
        >
          <Text className="text-white font-bold">- Egreso</Text>
        </Button>
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
  );
}
