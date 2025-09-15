import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, Alert, Image } from "react-native"
import { Button } from "@/components/ui/button"
import { useRouter } from "expo-router"
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { getAuth } from 'firebase/auth';

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<{ uid?: string; displayName?: string; email?: string; photoURL?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      try {
        const json = await AsyncStorage.getItem('userProfile');
        if (!mounted) return;
        if (json) {
          setProfile(JSON.parse(json));
        }
      } catch (err) {
        console.error('Error loading profile from AsyncStorage', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadProfile();
    return () => {
      mounted = false;
    }
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
            await SecureStore.deleteItemAsync('jwt');
            await AsyncStorage.removeItem('userProfile');
            // try firebase sign out if auth initialized
            try {
              const auth = getAuth();
              await auth.signOut();
            } catch (e) {
              // ignore if firebase not configured in this runtime
              console.warn('Firebase signOut threw:', e);
            }
          } catch (err) {
            console.error('Error clearing auth storage', err);
          } finally {
            router.replace('/sign-in/SignInPage');
          }
        },
      },
    ]);
  }

  return (
    <View className="flex-1 items-center justify-center p-5">
      <Text>Perfil</Text>
      {loading ? (
        <Text style={styles.text}>Cargando...</Text>
      ) : profile ? (
        <View style={{ alignItems: 'center' }}>
          {profile.photoURL ? (
            <Image source={{ uri: profile.photoURL }} style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 12 }} />
          ) : null}
          <Text style={styles.text}>{profile.displayName || 'Sin nombre'}</Text>
          <Text style={styles.text}>{profile.email || 'Sin email'}</Text>
        </View>
      ) : (
        <Text style={styles.text}>No hay datos de perfil almacenados.</Text>
      )}
      <View className="space-y-3 mt-6 gap-3">
        <Button className="bg-blue-500" onPress={handleSignOut}>
          <Text className="text-white text-center text-bold">Editar Perfil</Text>
        </Button>
        <Button className="bg-blue-500" onPress={handleSignOut}>
          <Text className="text-white text-center text-bold">Cerrar sesión</Text>
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 20, marginBottom: 8 },
  text: { fontSize: 14, marginBottom: 16, color: "#555" },
})