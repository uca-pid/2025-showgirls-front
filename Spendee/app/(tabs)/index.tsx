import React, { useEffect, useState } from "react";
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
import { onAuthStateChanged, getAuth } from "firebase/auth";

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
  const [transaccion, setTransaccion] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const headerHight = useHeaderHeight();
  const [profile, setProfile] = useState<{
    uid?: string;
    displayName?: string;
    email?: string;
    photoURL?: string;
  } | null>(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setProfile({
          uid: user.uid,
          displayName: user.displayName ?? "",
          email: user.email ?? "",
          photoURL: user.photoURL ?? "",
        });
      } else {
        setProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleTransaction = () => {
    const numericAmount = parseFloat(amount);
    if (transaccion === "income") {
      addIncome();
    }
    if (transaccion === "expense") {
      addExpense();
    }
    setBalance(calculateBalance(balance, numericAmount, transaccion));
  };

  const addIncome = () => {
    console.log("Adding income:", amount);
    const user = profile?.uid;
    const numericAmount = parseFloat(amount);
    console.log("User ID:", user);
    fetch("http://192.168.0.21:3000/ingreso", {
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
        console.log("Status:", res.status);
        return res.json();
      })
      .then((data) => console.log("Respuesta backend:", data))
      .catch((err) => console.error("Error en fetch:", err));
  };

  const addExpense = () => {
    console.log("Adding expense:", amount);
    const user = profile?.uid;
    const numericAmount = parseFloat(amount);
    console.log("User ID:", user);
    fetch("http://192.168.0.21:3000/gasto", {
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
        console.log("Status:", res.status);
        return res.json();
      })
      .then((data) => console.log("Respuesta backend:", data))
      .catch((err) => console.error("Error en fetch:", err));
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
                  handleTransaction();
                  setAmount(amount);
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
