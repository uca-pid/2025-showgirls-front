import IconButton from '@/components/IconButton'
import Section from '@/components/Section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/context/AuthContext'
import { toastService } from '@/context/ToastContext'
import useCategories from '@/hooks/useCategories'
import useExpenses from '@/hooks/useExpenses'
import { colorOptions } from '@/lib/colors'
import { iconOptions } from '@/lib/icons'
import { router, useLocalSearchParams } from 'expo-router'
import { Trash2 } from 'lucide-react-native'
import React, { useState } from 'react'
import { Alert, FlatList, Pressable, View } from 'react-native'
import ApiService from '../../services/api.service'
import piggyService from '@/services/piggy.service'

const EditCategory = () => {
  const { user } = useAuth()
  const {
    categoryName,
    categoryDescription,
    categoryIcon,
    categoryId,
    categoryColor,
  } = useLocalSearchParams()
  const [name, setName] = useState(String(categoryName) || '')
  const [description, setDescription] = useState(
    String(categoryDescription) || '',
  )
  const [icon, setIcon] = useState(String(categoryIcon) || '')
  const [color, setColor] = useState(
    colorOptions.findIndex(
      (color, index) => color.hex == String(categoryColor),
    ),
  )

  const { moveExpenses, isRefetching: refetchingExpenses } = useExpenses(
    user ? user.uid : '',
  )
  const { deleteCategory, isRefetching: refetchingCategories } = useCategories()

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
    try {
      const response = await ApiService.put(`/modifyCategory/${categoryId}`, {
        categoria: name,
        descripcion: description,
        icono: icon,
        color: colorOptions[color].hex,
      })
      await piggyService.checkObjective('category_edit')

      alert('Categoría modificada con éxito')

      router.back()
    } catch (error) {
      alert('No se pudo modificar la categoría')
    }
  }
  const handleDeleteCategory = async () => {
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
            await moveExpenses(Number(categoryId))
            await deleteCategory(Number(categoryId))
            toastService.show('Categoría eliminada con éxito', 'success')
            router.back()
          },
        },
      ],
    )
  }

  return (
    <Section
      activity={refetchingCategories || refetchingExpenses}
      className="p-4"
    >
      <Text className="text-gray-500">Nombre</Text>
      <Input placeholder={name} onChangeText={setName} />
      <Text className="text-gray-500">Descripcion</Text>
      <Input placeholder={description} onChangeText={setDescription} />
      <Text className="text-gray-500">Seleccionar color</Text>

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
      <Text className="text-gray-500">Seleccionar ícono</Text>
      <View className="w-full ">
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
                icon === item.name
                  ? 'rounded-full bg-pink-300/50 border-2 border-white'
                  : ''
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
      <Button onPress={() => modifyCategory()}>
        <Text>Editar categoría</Text>
      </Button>
      <Button onPress={() => handleDeleteCategory()} variant={'destructive'}>
        <Trash2 size={20} color="white" />
        <Text className="text-white">Eliminar categoría</Text>
      </Button>
    </Section>
  )
}

export default EditCategory
