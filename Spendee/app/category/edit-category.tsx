import { View, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import IconButton from '@/components/IconButton'
import {
  Paperclip,
  Popcorn,
  Shield,
  Shuffle,
  Sigma,
  Sprout,
  Sun,
  TestTube,
  Trash2,
  TreePalm,
  Users,
  Wine,
  Wrench,
} from 'lucide-react-native'
import { Button } from '@/components/ui/button'
import { useRoute } from '@react-navigation/native'
import { useLocalSearchParams } from 'expo-router'

const EditCategory = () => {
  const { categoryName, categoryDescription, categoryIcon, categoryId } =
    useLocalSearchParams()

  const [name, setName] = useState(String(categoryName) || '')
  const [description, setDescription] = useState(
    String(categoryDescription) || '',
  )
  const [icon, setIcon] = useState(String(categoryIcon) || '')

  const modifyCategory = () => {}
  const deleteCategory = () => {}

  return (
    <View className="flex-1 p-4 gap-4">
      <Text className="text-gray-500">Nombre</Text>
      <Input placeholder={name} />
      <Text className="text-gray-500">Descripcion</Text>
      <Input placeholder={description} />
      <Text className="text-gray-500">Seleccionar ícono</Text>
      <View className="w-full ">
        <Card className="w-full h-[300]">
          <ScrollView>
            <CardContent className="flex-row flex-wrap gap-4 justify-between">
              <IconButton
                icon={Wrench}
                text=""
                onPress={() => setIcon('Wrench')}
                className={
                  icon === 'Wrench'
                    ? 'rounded-full border-pink-300 border-4'
                    : ''
                }
              />
              <IconButton
                icon={Wine}
                text=""
                onPress={() => setIcon('Wine')}
                className={
                  icon === 'Wine' ? 'rounded-full border-pink-300 border-4' : ''
                }
              />
              <IconButton
                icon={Users}
                text=""
                onPress={() => setIcon('Users')}
                className={
                  icon === 'Users'
                    ? 'rounded-full border-pink-300 border-4'
                    : ''
                }
              />
              <IconButton
                icon={TreePalm}
                text=""
                onPress={() => setIcon('TreePalm')}
                className={
                  icon === 'TreePalm'
                    ? 'rounded-full border-pink-300 border-4'
                    : ''
                }
              />
              <IconButton
                icon={Popcorn}
                text=""
                onPress={() => setIcon('Popcorn')}
                className={
                  icon === 'Popcorn'
                    ? 'rounded-full border-pink-300 border-4'
                    : ''
                }
              />
              <IconButton
                icon={TestTube}
                text=""
                onPress={() => setIcon('TestTube')}
                className={
                  icon === 'TestTube'
                    ? 'rounded-full border-pink-300 border-4'
                    : ''
                }
              />
              <IconButton
                icon={Sun}
                text=""
                onPress={() => setIcon('Sun')}
                className={
                  icon === 'Sun' ? 'rounded-full border-pink-300 border-4' : ''
                }
              />
              <IconButton
                icon={Sprout}
                text=""
                onPress={() => setIcon('Sprout')}
                className={
                  icon === 'Sprout'
                    ? 'rounded-full border-pink-300 border-4'
                    : ''
                }
              />
              <IconButton
                icon={Sigma}
                text=""
                onPress={() => setIcon('Sigma')}
                className={
                  icon === 'Sigma'
                    ? 'rounded-full border-pink-300 border-4'
                    : ''
                }
              />
              <IconButton
                icon={Shuffle}
                text=""
                onPress={() => setIcon('Shuffle')}
                className={
                  icon === 'Shuffle'
                    ? 'rounded-full border-pink-300 border-4'
                    : ''
                }
              />
              <IconButton
                icon={Shield}
                text=""
                onPress={() => setIcon('Shield')}
                className={
                  icon === 'Shield'
                    ? 'rounded-full border-pink-300 border-4'
                    : ''
                }
              />
              <IconButton
                icon={Paperclip}
                text=""
                onPress={() => setIcon('Paperclip')}
                className={
                  icon === 'Paperclip'
                    ? 'rounded-full border-pink-300 border-4'
                    : ''
                }
              />
            </CardContent>
          </ScrollView>
        </Card>
      </View>
      <Button onPress={() => modifyCategory()}>
        <Text>Editar categoría</Text>
      </Button>
      <Button onPress={() => deleteCategory()} variant={'destructive'}>
        <Trash2 size={20} color="white" />
        <Text className="text-white">Eliminar categoría</Text>
      </Button>
    </View>
  )
}

export default EditCategory
