import { View } from "react-native"
import React from "react"
import { Text } from "@/components/ui/text"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import "@/global.css"

const COLORS = [
  "#b28bcb",
  "#6ca2da",
  "#51b399",
  "#4f46e5",
  "#7caf74",
  "#aca153",
  "#ce8e5f",
  "#d2849c",
]

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
        <Text className='text-sm color- color-muted-foreground pl-4 '>
          TEMA
        </Text>
        <Card className='w-full h-auto p-4'>
          <CardTitle>
            <Text>Paleta de colores</Text>
          </CardTitle>
          <CardContent className='flex-row gap-x-3 flex-wrap gap-y-4 justify-center'>
            {COLORS.map((color, index) => (
              <View
                className={`h-[50px] w-[50px] bg-rob-roy-200 rounded-xl`}
                key={index}
              />
            ))}
          </CardContent>
        </Card>
      </View>
    </View>
  )
}

export default EditProfilePage
