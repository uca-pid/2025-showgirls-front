import { View, Text, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import IconButton from '@/components/IconButton'
import {
  Ellipsis,
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
import { router, useLocalSearchParams } from 'expo-router'
import ApiService from '../../services/api.service'
import { toastService } from '@/context/ToastContext'
import categoryService from '@/services/category.service'
import expenseService from '@/services/expense.service'

const EditCategory = () => {
  const { categoryName, categoryDescription, categoryIcon, categoryId } =
    useLocalSearchParams()
  const [name, setName] = useState(String(categoryName) || '')
  const [description, setDescription] = useState(
    String(categoryDescription) || '',
  )
  const [icon, setIcon] = useState(String(categoryIcon) || '')

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    toastService.show(message, type === 'success' ? 'success' : undefined)
  }

  const validateForm = () => {
    if (!categoryName || !description || !icon) {
      return 'Por favor completa todos los campos'
    }
    return null
  }

  const modifyCategory = async () => {
    const errorMsg = validateForm()
    if (errorMsg) return showToast(errorMsg)
    console.log(categoryId)
    try {
      const response = await ApiService.put(`/modifyCategory/${categoryId}`, {
        categoria: name,
        descripcion: description,
        icono: icon,
      })

      alert('Categoría modificada con éxito')

      router.back()
    } catch (error) {
      alert('No se pudo modificar la categoría')
    }
  }
  const deleteCategory = async () => {
    Alert.alert(
      'Eliminar categoría',
      'Los gastos asociados a esta categoría pasarán a la categoría "Otros" \n¿Seguro que deseas continuar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar categoría',
          style: 'destructive',
          onPress: async () => {
            await expenseService.edit(Number(categoryId), 7)
            await categoryService.delete(Number(categoryId))
            router.back()
          },
        },
      ],
    )
  }

  return (
    <View className="flex-1 p-4 gap-4">
      <Text className="text-gray-500">Nombre</Text>
      <Input placeholder={name} onChangeText={setName} />
      <Text className="text-gray-500">Descripcion</Text>
      <Input placeholder={description} onChangeText={setDescription} />
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
