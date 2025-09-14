import { View } from "react-native"
import React from "react"
import { SignUpForm } from "@/components/sign-up-form"

const SignUpPage = () => {
  return (
    <View className='w-full h-full items-center justify-center bg-background'>
      <SignUpForm />
    </View>
  )
}

export default SignUpPage
