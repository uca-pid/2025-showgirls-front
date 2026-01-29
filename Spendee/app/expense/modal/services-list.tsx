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

   type service = {
      id: number
      name: string
      price: number
      status: string
    }

    const [ServiceData, setServiceData] = useState<service[]>([])
    const { workshopId, workshopName } = useLocalSearchParams()
  
    //consulta a la API de servicios
    useEffect(() => {
      const fetchService = async () => {
        try {
          console.log(`https://api.estaller.vschiaffino.com/users/mechanic/${workshopId}`)
          const response = await fetch(`https://api.estaller.vschiaffino.com/services/mechanic/${workshopId}`)
          const data = await response.json()
          if (Array.isArray(data)) {
            const Service: service[] = data.map((element: any) => ({
              id: element.id,
              name: element.name,
              price: element.price,
              status: element.status,
            }))
            setServiceData(Service)
          } else {
            console.log('Unexpected response for services:', data)
          }
        } catch (error) {
          console.error('Error fetching services:', error)
        }
      }
  
      fetchService()
    }, [])

  console.log('ServiceData:', ServiceData)

  const { colorScheme } = useColorScheme()

  return (
    <View className="w-full h-screen bg-background items-center py-4">
      <Text className="text-lg font-bold">Elegí un taller mecanico</Text>
      <Text className="text-base text-muted-foreground">
      </Text>
      <View className="w-full h-screen p-4">
        <FlatList
          data={ServiceData}
          renderItem={({ item, index }) => (
            <ItemButton
              borderBottom={index !== (ServiceData?.length ?? 0) - 1}
              background="background"
              text={item.name}
              onPress={() =>
                router.dismissTo({
                  pathname: '/expense/modal/add-service',
                  params: { serviceId: item.id, serviceName: item.name, servicePrice: item.price, workshopId: workshopId, workshopName: workshopName },
                })
              }
              badgeText={`$ ${item.price.toString()}`}
            />
          )}
        />
      </View>
    </View>
  )
}

export default CategoriesList
