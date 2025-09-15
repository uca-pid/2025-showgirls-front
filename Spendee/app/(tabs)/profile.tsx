import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { getAuth } from "firebase/auth";

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
    <View className="items-center justify-center">
      {loading ? (
        <Text>Cargando...</Text>
      ) : profile ? (
        <View className="items-center gap-10">
          <View className="relative p-20 mb-4 rounded-lg shadow-md w-screen bg-purple-300 items-center"></View>
          <Avatar
            alt={"Zach Nugent's Avatar"}
            className="absolute top-[45%] mb-4 h-24 w-24 border-2 border-white bg-black"
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
          <Text className="m-15">{profile.displayName || "Sin nombre"}</Text>
        </View>
      ) : (
        <Text>No hay datos de perfil almacenados.</Text>
      )}
      <View className="space-y-3 mt-6 gap-3 items-center">
        <Button className="bg-purple-300">
          <Text className="text-white text-center text-bold color-white">
            Editar Perfil
          </Text>
        </Button>
        <Button className="bg-purple-300" onPress={handleSignOut}>
          <Text className="text-white text-center text-bold color-white">
            Cerrar sesión
          </Text>
        </Button>
      </View>
    </View>
  );
}
