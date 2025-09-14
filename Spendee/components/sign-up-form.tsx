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
import * as React from "react"
import { Pressable, TextInput, View } from "react-native"
import { EyeIcon, EyeOffIcon } from "lucide-react-native"

import { useState, useEffect } from "react"
import { router, useRouter } from "expo-router"

import { initializeApp } from "firebase/app"
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth"
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google" // Importación necesaria
import * as AuthSession from "expo-auth-session"
import * as SecureStore from "expo-secure-store"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from "react-native-toast-message"

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

export function SignUpForm() {
  const passwordInputRef = React.useRef<TextInput>(null)
  const emailInputRef = React.useRef<TextInput>(null)
  const passwordConfirmationInputRef = React.useRef<TextInput>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function getFriendlyAuthMessage(err: any) {
    console.log("Firebase Auth Error:", err.code, err.message)
    const code = err?.code || ""
    if (code.includes("auth/invalid-credential"))
      return "Email o Contraseña incorrectos."
    if (code.includes("auth/too-many-requests"))
      return "Demasiados intentos. Intenta más tarde."
    // fallback
    return err?.message || "Error al iniciar sesión. Intenta de nuevo."
  }

  const [name, setName] = useState("")
  function onNameSubmitEditing() {
    emailInputRef.current?.focus()
  }

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus()
  }
  function onPasswordSubmitEditing() {
    passwordConfirmationInputRef.current?.focus()
  }

  async function onSubmit() {
    if (!email || !password || !passwordConfirmation) {
      setError("Completá todos los campos.")
      showErrorToast("Completá todos los campos.")
      return
    }

    if (password !== passwordConfirmation) {
      setError("Las contraseñas no coinciden.")
      showErrorToast("Las contraseñas no coinciden.")
      return
    }

    // basic password length check
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.")
      showErrorToast("La contraseña debe tener al menos 8 caracteres.")
      return
    }

    setError("")
    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user
      //agregar displayName
      if (name) {
        await updateProfile(user, { displayName: name })
      }

      // Persist JWT (id token) securely and public profile in AsyncStorage
      try {
        const idToken = await user.getIdToken()
        if (idToken) {
          await SecureStore.setItemAsync("jwt", idToken)
        }
      } catch (storeErr) {
        console.warn("Could not save JWT to SecureStore", storeErr)
      }

      try {
        const publicProfile = {
          uid: user.uid,
          displayName: user.displayName || null,
          email: user.email,
          photoURL: user.photoURL || null,
        }
        await AsyncStorage.setItem("userProfile", JSON.stringify(publicProfile))
      } catch (storeErr) {
        console.warn("Could not save profile to AsyncStorage", storeErr)
      }

      // Optionally send email verification here: await user.sendEmailVerification();

      // Navigate to main app
      router.push("/(tabs)")
    } catch (err) {
      const friendlyMessage = getFriendlyAuthMessage(err)
      setError(friendlyMessage)
      showErrorToast(friendlyMessage)
      console.log("SignUp error", err)
    } finally {
      setLoading(false)
    }
  }

  const showErrorToast = (title: string, description?: string) => {
    Toast.show({
      type: "danger",
      text1: title,
      text2: description,
    })
  }
  return (
    <View className='gap-6 w-full'>
      <Card className='border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5'>
        <CardHeader>
          <CardTitle className='text-center text-2xl sm:text-left'>
            Creá tu cuenta
          </CardTitle>
          <CardDescription className='text-center sm:text-left'>
            ¡Bienvenido! Ingresá tus datos para continuar
          </CardDescription>
        </CardHeader>
        <CardContent className='gap-6'>
          <View className='gap-6'>
            <View className='gap-1.5'>
              <Label htmlFor='email'>Nombre</Label>
              <Input
                id='name'
                placeholder='name'
                keyboardType='default'
                autoComplete='name'
                autoCapitalize='words'
                onSubmitEditing={onNameSubmitEditing}
                returnKeyType='next'
                submitBehavior='submit'
                value={name}
                onChangeText={setName}
              />
            </View>
            <View className='gap-1.5'>
              <Label htmlFor='email'>Usuario</Label>
              <Input
                ref={emailInputRef}
                id='email'
                placeholder='mail@example.com'
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
              <View className='flex-row items-center justify-between'>
                <Label htmlFor='password'>Contraseña</Label>
              </View>
              <Input
                ref={passwordInputRef}
                id='password'
                returnKeyType='next'
                secureTextEntry
                onSubmitEditing={onPasswordSubmitEditing}
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <View className='gap-1.5'>
              <View className='flex-row items-center justify-between'>
                <Label htmlFor='password'>Confirmar contraseña</Label>
              </View>
              <Input
                ref={passwordConfirmationInputRef}
                id='conf-password'
                returnKeyType='send'
                secureTextEntry
                onSubmitEditing={onSubmit}
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
              />
            </View>
            <Button className='w-full' onPress={onSubmit}>
              <Text>Continuar</Text>
            </Button>
          </View>
          <View className='flex-row items-center justify-center'>
            <Text className='text-center text-sm'>¿Ya tenés una cuenta? </Text>
            <Pressable
              onPress={() => {
                router.push("/sign-in/SignInPage")
              }}
            >
              <Text className='text-sm underline underline-offset-4'>
                Ingresá
              </Text>
            </Pressable>
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
