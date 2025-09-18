import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Text } from "@/components/ui/text"
import { View } from "react-native"

import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import { useState } from "react"
import { router } from "expo-router"

const auth = getAuth()

async function checkEmail(email: string) {
  const res = await fetch("http://192.168.1.79:3000/verify-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })

  const data = await res.json()
  return data[0]
}

async function resetPassword(verificationEmail: string) {
  sendPasswordResetEmail(auth, verificationEmail).then(() =>
    router.replace("/sign-in/SignInPage"),
  )
}

export function ForgotPasswordForm() {
  const [verificationEmail, setVerificationEmail] = useState<string>("")

  function onSubmit() {
    resetPassword(verificationEmail)
  }

  return (
    <View className="gap-6 w-full justify-center">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">
            Olvidé mi contraseña
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Ingresá tu email para recuperar tu contraseña
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="mail@example.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                returnKeyType="send"
                onSubmitEditing={onSubmit}
                onChangeText={setVerificationEmail}
              />
            </View>
            <Button className="w-full" onPress={onSubmit}>
              <Text>Recuperar contraseña</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  )
}
