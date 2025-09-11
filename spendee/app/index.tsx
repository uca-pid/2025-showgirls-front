import { router } from "expo-router"
import { Pressable, Text, View } from "react-native"

export default function HomeScreen() {
  return (
    <View className='flex-1 items-center justify-center bg-background'>
      <Text className='color-white'>Welcome!</Text>
      <Pressable
        onPress={() => {
          router.push("/sign-in/SignInPage")
        }}
      >
        <Text className='color-white'>Go to login</Text>
      </Pressable>
    </View>
  )
}
