import React from "react"
import { View, Text, Button, StyleSheet } from "react-native"
import { useRouter } from "expo-router"

export default function HomePage() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Página principal</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 20, marginBottom: 12 },
})