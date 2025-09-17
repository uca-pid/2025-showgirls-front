import React, { useState } from "react";
import { View, TouchableOpacity, Modal, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Amphora, Minus, Plus } from "lucide-react-native";
import { useHeaderHeight } from "@react-navigation/elements";

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
  const headerHight = useHeaderHeight();

  const handleTransaction = (amount: string) => {
    const numericAmount = parseFloat(amount);
    setBalance(calculateBalance(balance, numericAmount, transaccion));
  };

  return (
    <View className={`flex-1 items-center pt-${headerHight}px bg-background`}>
      <View className="bg-[#b28bcb] h-[27 0px] w-full relative items-center relative">
        <Text className="absolute top-[55px] font-bold left-4 mb-0">
          Hola, User
        </Text>
        <Card className="w-[92%] bg-foreground border-0 rounded-none gap-1 absolute top-[80px]">
          <CardTitle className="text-secondary text-m pl-2">
            Balance actual
          </CardTitle>
          <CardContent className="items-start pl-2">
            <Text className="text-4xl font-bold text-secondary text-left">
              ${new Intl.NumberFormat("es-AR").format(balance)}
            </Text>
          </CardContent>

          <View className="flex-row space-x-4 gap-4 pb-2 pt-2 align-center justify-center">
            <Button
              variant={"secondary"}
              onPress={() => {
                setTransaccion("income");
                setModalVisible(true);
              }}
              className="size-2xl"
            >
              <Plus size={20} color={"white"} />
              <Text className="text-white font-bold">Ingreso</Text>
            </Button>

            <Button
              variant={"secondary"}
              onPress={() => {
                setTransaccion("expense");
                setModalVisible(true);
              }}
              className="size-2xl"
            >
              <Minus size={20} color={"white"} />
              <Text className="text-white font-bold">Egreso</Text>
            </Button>
          </View>
        </Card>
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
