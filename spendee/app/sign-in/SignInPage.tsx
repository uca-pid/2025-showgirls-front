import { View } from "react-native"
import React from "react"
import { SignInForm } from "@/components/sign-in-form"

const SignInPage = () => {
  return (
    <View className='w-full h-full items-center justify-center bg-background'>
      <SignInForm />
    </View>
  )
}

export default SignInPage
