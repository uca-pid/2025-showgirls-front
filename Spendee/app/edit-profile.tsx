import { View } from "react-native"
import React from "react"
import { Text } from "@/components/ui/text"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const EditProfilePage = () => {
  return (
    <View className='bg-background h-full w-full items-center gap-4 p-4'>
      <View className='w-full '>
        <Text className='text-sm text- color-muted-foreground pl-4 '>
          CAMBIAR NOMBRE
        </Text>
        <Card className='w-full h-auto'>
          <CardContent className='gap-4'>
            <Label htmlFor='newName'>
              <Text>Nuevo nombre</Text>
            </Label>
            <Input id='newName' placeholder='Nombre' />
            <Label htmlFor='newName'>
              <Text>Contraseña</Text>
            </Label>
            <Input id='newName' secureTextEntry placeholder='Contraseña' />
            <Button className='mt-[10px]'>
              <Text>Actualizar</Text>
            </Button>
          </CardContent>
        </Card>
      </View>
      <View className='w-full '>
        <Text className='text-sm text- color-muted-foreground pl-4 '>
          COLORES
        </Text>
        <Card className='w-full h-auto p-4'>
          <CardContent className='flex-row gap-x-3 flex-wrap gap-y-4 justify-center'>
            <View className='h-[50px] w-[50px] bg-user-1 rounded-xl' />
            <View className='h-[50px] w-[50px] bg-user-2 rounded-xl' />
            <View className='h-[50px] w-[50px] bg-primary rounded-xl' />
            <View className='h-[50px] w-[50px] bg-primary rounded-xl' />
            <View className='h-[50px] w-[50px] bg-primary rounded-xl' />
            <View className='h-[50px] w-[50px] bg-primary rounded-xl' />
            <View className='h-[50px] w-[50px] bg-primary rounded-xl' />
            <View className='h-[50px] w-[50px] bg-primary rounded-xl' />
          </CardContent>
        </Card>
      </View>
    </View>
  )
}

export default EditProfilePage
