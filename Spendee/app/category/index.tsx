import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
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
  TreePalm,
  Users,
  Wine,
  Wrench,
} from 'lucide-react-native'
import { Button } from '@/components/ui/button'
import { auth } from '@/firebase.config'
import ApiService from '../../services/api.service'
import { toastService } from '@/context/ToastContext'

const index = () => {
  const [categoryName, setCategoryName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('')

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

  const addCategory = async () => {
    const userId = user?.uid
    const errorMsg = validateForm()
    if (errorMsg) return showToast(errorMsg)
    try {
      await ApiService.post('/customCategory', {
        categoria: categoryName,
        icono: icon,
        color: 'blue',
        descripcion: description,
      })
      showToast('Categoría agregada correctamente', 'success')
    } catch (error) {
      showToast('Error al agregar categoría')
    }
  }
  return (
    <View className="flex-1 p-4 gap-4">
      <Text className="text-gray-500">Nombre</Text>
      <Input
        placeholder="Nombre de la categoría"
        value={categoryName}
        onChangeText={setCategoryName}
      />
      <Text className="text-gray-500">Descripcion</Text>
      <Input
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />
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
      <Button onPress={() => addCategory()}>
        <Text>Agregar categoría</Text>
      </Button>
    </View>
  )
}

export default index
