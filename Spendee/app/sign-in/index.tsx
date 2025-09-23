import { SocialConnections } from '@/components/social-connections'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Text } from '@/components/ui/text'
import * as React from 'react'
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  type TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google' // Importación necesaria
import * as AuthSession from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'
import userService from '../services/user.service'

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export default function SignInForm() {
  const passwordInputRef = React.useRef<TextInput>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus()
  }

  async function onSubmit() {
    setLoading(true)
    await userService.login(auth, email, password)
    setLoading(false)
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="gap-6 w-full h-full justify-center bg-background">
        <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5 bg-background">
          <CardHeader>
            <CardTitle
              className="text-center text-2xl sm:text-left"
              testID="loginTitle"
            >
              Bienvenido a Spendee!
            </CardTitle>
            <CardDescription className=" text-center sm:text-left">
              Iniciá sesión para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-6">
            <View className="gap-6">
              <View className="gap-1.5">
                <Label htmlFor="email">Usuario</Label>
                <Input
                  id="email"
                  placeholder="mail@example.com"
                  keyboardType="email-address"
                  autoComplete="email"
                  autoCapitalize="none"
                  onSubmitEditing={onEmailSubmitEditing}
                  returnKeyType="next"
                  submitBehavior="submit"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <View className="gap-1.5">
                <View className="flex-row items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <Button
                    variant="link"
                    size="sm"
                    className="web:h-fit ml-auto h-4 px-1 py-0 sm:h-4"
                    onPress={() => {
                      router.push('/sign-in/forgot-password')
                    }}
                  >
                    <Text className="font-normal leading-4">
                      Olvidé mi contraseña
                    </Text>
                  </Button>
                </View>
                <Input
                  ref={passwordInputRef}
                  id="password"
                  secureTextEntry
                  returnKeyType="send"
                  onSubmitEditing={onSubmit}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <Button
                className="w-full"
                onPress={loading ? () => {} : onSubmit}
              >
                {loading ? (
                  <ActivityIndicator color="#000000" />
                ) : (
                  <Text>Continuar</Text>
                )}
              </Button>
              <View className="flex-row items-center justify-center">
                <Text className="text-sm">¿No tenés cuenta? </Text>
                <Pressable
                  onPress={() => {
                    router.replace('/sign-up')
                  }}
                >
                  <Text className="text-sm underline underline-offset-4">
                    Registrate
                  </Text>
                </Pressable>
              </View>
            </View>
            <View className="flex-row items-center">
              {/** 
              <Separator className="flex-1" />
              <Text className="text-muted-foreground px-4 text-sm">o</Text>
              <Separator className="flex-1" />
              <SocialConnections />*/}
            </View>
          </CardContent>
        </Card>
      </View>
    </TouchableWithoutFeedback>
  )
}
