import React, { act, useEffect, useState } from "react";
import { View, FlatList, Alert } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { getAuth } from "firebase/auth";
import {
  BellDot,
  ChevronRight,
  Icon,
  LogOut,
  Settings,
  User2,
} from "lucide-react-native";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<{
    uid?: string;
    displayName?: string;
    email?: string;
    photoURL?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      try {
        const json = await AsyncStorage.getItem("userProfile");
        if (!mounted) return;
        if (json) {
          setProfile(JSON.parse(json));
        }
      } catch (err) {
        console.error("Error loading profile from AsyncStorage", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const DATA = [
    {
      title: "Editar Perfil",
      description: profile?.email,
      icon: <User2 size={25} color="white" />,
      action: () => router.push("/"),
    },
    {
      title: "Notificaciones",
      description: "Mute",
      icon: <BellDot size={25} color="white" />,
    },
    {
      title: "Configuración",
      description: "Seguridad, Privacidad",
      icon: <Settings size={25} color="white" />,
    },
    {
      title: "Cerrar Sesión",
      description: "Salir de la cuenta",
      icon: <LogOut size={25} color="white" />,
      action: () => handleSignOut(),
      variant: "destructive",
    },
  ];

  const handleSignOut = () => {
    // Real sign-out: clear storage, sign out from firebase if available, then navigate
    Alert.alert("Cerrar sesión", "¿Querés cerrar tu sesión?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          try {
            await SecureStore.deleteItemAsync("jwt");
            await AsyncStorage.removeItem("userProfile");
            // try firebase sign out if auth initialized
            try {
              const auth = getAuth();
              await auth.signOut();
            } catch (e) {
              // ignore if firebase not configured in this runtime
              console.warn("Firebase signOut threw:", e);
            }
          } catch (err) {
            console.error("Error clearing auth storage", err);
          } finally {
            router.replace("/sign-in/SignInPage");
          }
        },
      },
    ]);
  };

  return (
    <View className="items-center justify-center mt-10 ">
      {loading ? (
        <Text>Cargando...</Text>
      ) : profile ? (
        <View className="items-center gap-4">
          <Avatar
            alt={"Zach Nugent's Avatar"}
            className="h-24 w-24 border-2 border-white bg-black"
          >
            <AvatarImage
              source={{
                uri: profile.photoURL
                  ? profile.photoURL
                  : "https://github.com/mrzachnugent.png",
              }}
            />
            <AvatarFallback>
              <Text className="color-white">
                {profile.displayName?.charAt(0)}
              </Text>
            </AvatarFallback>
          </Avatar>
          <Text className="">{profile.displayName || "Sin nombre"}</Text>
        </View>
      ) : (
        <Text>No hay datos de perfil almacenados.</Text>
      )}

      <FlatList
        className="w-screen p-4"
        data={DATA}
        renderItem={({ item, index }) => (
          <Card
            className="rounded-none border-0 border-t-[1.5px]"
            style={
              index === 0 && DATA.length > 1
                ? {
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    borderTopWidth: 0,
                  }
                : index === DATA.length - 1 && DATA.length > 1
                  ? {
                      borderBottomLeftRadius: 30,
                      borderBottomRightRadius: 30,
                    }
                  : DATA.length === 1
                    ? { borderRadius: 30 }
                    : {}
            }
            key={index}
            onTouchEnd={item.action !== undefined ? item.action : () => {}}
          >
            <CardContent className="flex-row justify-between items-center">
              {item.icon}
              <View className="w-4/5 pl-4">
                <Text className="text-lg font-medium">{item.title}</Text>
                <Text className="color-gray-500">{item.description}</Text>
              </View>
              <ChevronRight size={22} color="white" />
            </CardContent>
          </Card>
        )}
      />
    </View>
  );
}
