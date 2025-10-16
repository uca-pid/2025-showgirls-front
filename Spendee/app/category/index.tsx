import IconButton from '@/components/IconButton'
import Section from '@/components/Section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { toastService } from '@/context/ToastContext'
import { auth } from '@/firebase.config'
import useCategories from '@/hooks/useCategories'
import { router } from 'expo-router'
import {
  Paperclip,
  Popcorn,
  Shield,
  Shuffle,
  Sigma,
  Sprout,
  Sun,
  TestTube,
  TreePalm,
  Users,
  Wine,
  Wrench,
} from 'lucide-react-native'
import React, { useState } from 'react'
import { FlatList, Pressable, View } from 'react-native'

const iconOptions = [
  { icon: Wrench, name: 'Wrench' },
  { icon: Wine, name: 'Wine' },
  { icon: Users, name: 'Users' },
  { icon: TreePalm, name: 'TreePalm' },
  { icon: Popcorn, name: 'Popcorn' },
  { icon: TestTube, name: 'TestTube' },
  { icon: Sun, name: 'Sun' },
  { icon: Sprout, name: 'Sprout' },
  { icon: Sigma, name: 'Sigma' },
  { icon: Shuffle, name: 'Shuffle' },
  { icon: Shield, name: 'Shield' },
  { icon: Paperclip, name: 'Paperclip' },
]

const colorOptions = [
  { colorName: 'rose', hex: '#fda4af' },
  { colorName: 'pink', hex: '#f9a8d4' },
  { colorName: 'fuchsia', hex: '#f0abfc' },
  { colorName: 'purple', hex: '#d8b4fe' },
  { colorName: 'violet', hex: '#c4b5fd' },
  { colorName: 'indigo', hex: '#a5b4fc' },
  { colorName: 'blue', hex: '#93c5fd' },
  { colorName: 'lightBlue', hex: '#7dd3fc' },
  { colorName: 'cyan', hex: '#67e8f9' },
  { colorName: 'teal', hex: '#5eead4' },
  { colorName: 'emerald', hex: '#6ee7b7' },
  { colorName: 'green', hex: '#86efac' },
  { colorName: 'lime', hex: '#bef264' },
  { colorName: 'yellow', hex: '#fde047' },
  { colorName: 'amber', hex: '#fcd34d' },
  { colorName: 'orange', hex: '#fdba74' },
  { colorName: 'red', hex: '#ef4444' },
  { colorName: 'warmGray', hex: '#d6d3d1' },
]

const index = () => {
  const [categoryName, setCategoryName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('')
  const [color, setColor] = useState(0)

  const { addCategory, isLoading } = useCategories()

  const user = auth.currentUser

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    toastService.show(message, type === 'success' ? 'success' : undefined)
  }

  const validateForm = () => {
    if (!categoryName || !description || !icon) {
      return 'Por favor completa todos los campos'
    }
    return null
  }

  const handleAddCategory = async () => {
    const errorMsg = validateForm()
    if (errorMsg) return showToast(errorMsg)
    try {
      await addCategory({
        nombre: categoryName,
        icono: icon,
        color: colorOptions[color].hex,
        descripcion: description,
      })
      showToast('Categoría agregada correctamente', 'success')
      router.back()
    } catch (error) {
      showToast('Error al agregar categoría')
    }
  }
  return (
    <Section className="p-4" activity={isLoading}>
      <Text className="text-white">Nombre</Text>
      <Input
        placeholder="Nombre de la categoría"
        value={categoryName}
        onChangeText={setCategoryName}
      />

      <Text className="text-white">Descripcion</Text>
      <Input
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />
      <Text className="text-white">Seleccionar color</Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={colorOptions}
        renderItem={({ item, index }) => (
          <Pressable onPress={() => setColor(index)}>
            <View
              className="w-[50px] h-[50px] rounded-full"
              style={{
                backgroundColor: item.hex,
                borderWidth: color === index ? 1.5 : 0,
                borderColor: 'white',
              }}
            />
          </Pressable>
        )}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      />

      <Text className="text-white">Seleccionar ícono</Text>
      <View className="flex-row items-center justify-center h-[250px]">
        <FlatList
          data={iconOptions}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <IconButton
              icon={item.icon}
              text=""
              onPress={() => setIcon(item.name)}
              className={
                icon === item.name ? 'rounded-full bg-pink-300/50' : ''
              }
            />
          )}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        />
      </View>
      <Button onPress={() => handleAddCategory()}>
        <Text>Agregar categoría</Text>
      </Button>
    </Section>
  )
}

export default index
