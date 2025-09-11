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
import { router } from "expo-router"
import * as React from "react"
import { Pressable, TextInput, View } from "react-native"

export function SignUpForm() {
  const passwordInputRef = React.useRef<TextInput>(null)

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus()
  }

  function onSubmit() {
    // TODO: Submit form and navigate to protected screen if successful
  }

  return (
    <View className='gap-6'>
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
              <Label htmlFor='email'>Usuario</Label>
              <Input
                id='email'
                placeholder='mail@example.com'
                keyboardType='email-address'
                autoComplete='email'
                autoCapitalize='none'
                onSubmitEditing={onEmailSubmitEditing}
                returnKeyType='next'
                submitBehavior='submit'
              />
            </View>
            <View className='gap-1.5'>
              <View className='flex-row items-center'>
                <Label htmlFor='password'>Contraseña</Label>
              </View>
              <Input
                ref={passwordInputRef}
                id='password'
                secureTextEntry
                returnKeyType='send'
                onSubmitEditing={onSubmit}
              />
            </View>
            <View className='gap-1.5'>
              <View className='flex-row items-center'>
                <Label htmlFor='password'>Confirmar contraseña</Label>
              </View>
              <Input
                ref={passwordInputRef}
                id='password'
                secureTextEntry
                returnKeyType='send'
                onSubmitEditing={onSubmit}
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
