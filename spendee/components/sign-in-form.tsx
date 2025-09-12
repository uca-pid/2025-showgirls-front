import { SocialConnections } from "@/components/social-connections"
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
import { Separator } from "@/components/ui/separator"
import { Text } from "@/components/ui/text"
import { navigate } from "expo-router/build/global-state/routing"
import * as React from "react"
import { Pressable, type TextInput, View } from "react-native"
import { useState, useEffect } from "react"
import { router, useRouter } from "expo-router"

import { initializeApp } from "firebase/app"
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth"
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google" // Importación necesaria
import * as AuthSession from "expo-auth-session"
import * as SecureStore from "expo-secure-store"
import AsyncStorage from "@react-native-async-storage/async-storage"

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

export function SignInForm() {
  const passwordInputRef = React.useRef<TextInput>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // <-- ADICIONADO: función para mapear errores de Firebase a mensajes amigables
  function getFriendlyAuthMessage(err: any) {
    console.log("Firebase Auth Error:", err.code, err.message)
    const code = err?.code || ""
    if (code.includes("auth/invalid-credential"))
      return "Email o contraseña incorrectos."
    if (code.includes("auth/too-many-requests"))
      return "Demasiados intentos. Intenta más tarde."
    // fallback
    return err?.message || "Error al iniciar sesión. Intenta de nuevo."
  }

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus()
  }

  async function onSubmit() {
    if (!email || !password) {
      setError("Completa email y contraseña.")
      return
    }

    setError("")
    setLoading(true)
    try {
      // signInWithEmailAndPassword returns a UserCredential
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user
      // Log the common profile fields you can use in the app
      console.log("Firebase sign-in successful. user:", {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        providerData: user.providerData,
      })

      // Alternative source for current user after sign-in
      console.log("auth.currentUser:", auth.currentUser)

      // --- Persist credentials/profile ---
      try {
        // Try to get a fresh ID token (JWT) for secure storage
        const idToken = await user.getIdToken()
        if (idToken) {
          await SecureStore.setItemAsync("jwt", idToken)
          console.log("Saved JWT to SecureStore")
        }
      } catch (storeErr) {
        console.error("Error saving JWT to SecureStore", storeErr)
      }

      try {
        const publicProfile = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }
        await AsyncStorage.setItem("userProfile", JSON.stringify(publicProfile))
        console.log("Saved user profile to AsyncStorage")
      } catch (storeErr) {
        console.error("Error saving profile to AsyncStorage", storeErr)
      }

      // TODO: If you store extra profile data in Firestore, fetch it here.
      // e.g. const profile = await getDoc(doc(firestore, 'users', user.uid));
      router.push("/(tabs)")
    } catch (firebaseLoginError) {
      console.error(firebaseLoginError)
      const friendlyMessage = getFriendlyAuthMessage(firebaseLoginError)
      setError(friendlyMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='gap-6 w-full'>
      <Card className='border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5'>
        <CardHeader>
          <CardTitle
            className='text-center text-2xl sm:text-left'
            testID='loginTitle'
          >
            Iniciar sesión
          </CardTitle>
          <CardDescription className='text-center sm:text-left'>
            ¡Bienvenido! Iniciá sesión para continuar
          </CardDescription>
        </CardHeader>
        <CardContent className='gap-6'>
          <View className='gap-6'>
            <View className='gap-1.5'>
              <Label htmlFor='email'>Usuario</Label>
              <Input
                id='email'
                placeholder='m@example.com'
                keyboardType='email-address'
                autoComplete='email'
                autoCapitalize='none'
                onSubmitEditing={onEmailSubmitEditing}
                returnKeyType='next'
                submitBehavior='submit'
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View className='gap-1.5'>
              <View className='flex-row items-center'>
                <Label htmlFor='password'>Contraseña</Label>
                <Button
                  variant='link'
                  size='sm'
                  className='web:h-fit ml-auto h-4 px-1 py-0 sm:h-4'
                  onPress={() => {
                    // TODO: Navigate to forgot password screen
                  }}
                >
                  <Text className='font-normal leading-4'>
                    Olvidé mi contraseña
                  </Text>
                </Button>
              </View>
              <Input
                ref={passwordInputRef}
                id='password'
                secureTextEntry
                returnKeyType='send'
                onSubmitEditing={onSubmit}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <Button className='w-full' onPress={onSubmit}>
              <Text>Continuar</Text>
            </Button>
            <View className='flex-row items-center justify-center'>
              <Text className='text-sm'>¿No tenés cuenta? </Text>
              <Pressable
                onPress={() => {
                  router.push("/sign-up/SignUpPage")
                }}
              >
                <Text className='text-sm underline underline-offset-4'>
                  Registrate
                </Text>
              </Pressable>
            </View>
          </View>
          <View className='flex-row items-center'>
            <Separator className='flex-1' />
            <Text className='text-muted-foreground px-4 text-sm'>o</Text>
            <Separator className='flex-1' />
          </View>
          <SocialConnections />
        </CardContent>
      </Card>
    </View>
  )
}
