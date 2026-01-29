import ItemButton from '@/components/ItemButton'
import { Text } from '@/components/ui/text'
import useCategories from '@/hooks/useCategories'
import { router, useLocalSearchParams } from 'expo-router'
import { useColorScheme } from 'nativewind'
import {
  BookOpen,
  Bus,
  ChevronRight,
  Ellipsis,
  Gamepad2,
  Heart,
  House,
  LucideIcon,
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
  Utensils,
  Wine,
  Wrench,
} from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, View } from 'react-native'

const CategoriesList = () => {

   type Workshop = {
      id: number
      name: string
    }
  
    const [workshopsData, setWorkshopsData] = useState<Workshop[]>([])
  
    //consulta a la API de servicios
    useEffect(() => {
      const fetchWorkshops = async () => {
        try {
          const response = await fetch('https://api.estaller.vschiaffino.com/users/workshops')
          const data = await response.json()
          if (Array.isArray(data)) {
            const workshops: Workshop[] = data.map((element: any) => ({
              id: element.id,
              name: element.fullName,
            }))
            setWorkshopsData(workshops)
          } else {
            console.log('Unexpected response for services:', data)
          }
        } catch (error) {
          console.error('Error fetching services:', error)
        }
      }
  
      fetchWorkshops()
    }, [])

  console.log('workshopsData:', workshopsData)

  const { colorScheme } = useColorScheme()

  return (
    <View className="w-full h-screen bg-background items-center py-4">
      <Text className="text-lg font-bold">Elegí un taller mecanico</Text>
      <Text className="text-base text-muted-foreground">
      </Text>
      <View className="w-full h-screen p-4">
        <FlatList
          data={workshopsData}
          renderItem={({ item, index }) => (
            <ItemButton
              borderBottom={index !== (workshopsData?.length ?? 0) - 1}
              background="background"
              text={item.name}
              onPress={() =>
                router.dismissTo({
                  pathname: '/expense/modal/add-service',
                  params: { workshopName: item.name, workshopId: item.id },
                })
              }
            />
          )}
        />
      </View>
    </View>
  )
}

export default CategoriesList
