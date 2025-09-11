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
import { EyeIcon, EyeOffIcon } from "lucide-react-native"

export function SignUpForm() {
  const [passwordVisible, setPasswordVisible] = React.useState(false)
  const [passwordConfVisible, setPasswordConfVisible] = React.useState(false)
  const passwordInputRef = React.useRef<TextInput>(null)
  const passwordConfirmationInputRef = React.useRef<TextInput>(null)

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus()
  }

  function onSubmit() {
    // TODO: Submit form and navigate to protected screen if successful
  }

  function viewPassword(): void {
    !passwordVisible ? setPasswordVisible(true) : setPasswordVisible(false)
  }

  function viewConfPassword(): void {
    !passwordConfVisible
      ? setPasswordConfVisible(true)
      : setPasswordConfVisible(false)
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
              <View className='flex-row items-center justify-between'>
                <Label htmlFor='password'>Contraseña</Label>
                {!passwordVisible ? (
                  <EyeIcon
                    size={20}
                    color='white'
                    onPress={() => viewPassword()}
                  />
                ) : (
                  <EyeOffIcon
                    size={20}
                    color='white'
                    onPress={() => viewPassword()}
                  />
                )}
              </View>
              <Input
                ref={passwordInputRef}
                id='password'
                secureTextEntry={passwordVisible}
                returnKeyType='next'
                onSubmitEditing={onEmailSubmitEditing}
              />
            </View>
            <View className='gap-1.5'>
              <View className='flex-row items-center justify-between'>
                <Label htmlFor='password'>Confirmar contraseña</Label>
                {!passwordConfVisible ? (
                  <EyeIcon
                    size={20}
                    color='white'
                    onPress={() => viewConfPassword()}
                  />
                ) : (
                  <EyeOffIcon
                    size={20}
                    color='white'
                    onPress={() => viewConfPassword()}
                  />
                )}
              </View>
              <Input
                ref={passwordConfirmationInputRef}
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
