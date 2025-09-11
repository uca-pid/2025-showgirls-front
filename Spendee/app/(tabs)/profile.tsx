import React from "react"
import { View, Text, Button, StyleSheet, Alert } from "react-native"
import { useRouter } from "expo-router"

export default function ProfilePage() {
  const router = useRouter()

  const handleSignOut = () => {
    // Implementa aquí el sign-out real (firebase/auth, etc.)
    Alert.alert("Cerrar sesión", "Se cerró la sesión (placeholder).", [
      { text: "OK", onPress: () => router.replace("/sign-in/SignInPage") },
    ])
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.text}>Aquí va la información del usuario.</Text>
      <Button title="Cerrar sesión" onPress={handleSignOut} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 20, marginBottom: 8 },
  text: { fontSize: 14, marginBottom: 16, color: "#555" },
})