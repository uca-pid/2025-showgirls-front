import { View, Text, FlatList, Pressable } from 'react-native'
import React from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { PieChart } from 'react-native-gifted-charts'
import { ChevronRight } from 'lucide-react-native'
import { ScrollView } from 'react-native-gesture-handler'

const index = () => {
  const data = [
    {
      categoryIcon: '💼',
      value: 1000,
      categoryColor: '#F87171',
      categoryName: 'Trabajo',
    },
    {
      categoryIcon: '🏠',
      value: 200,
      categoryColor: '#34D399',
      categoryName: 'Hogar',
    },
    {
      categoryIcon: '🍔',
      value: 187,
      categoryColor: '#60A5FA',
      categoryName: 'Comida',
    },
    {
      categoryIcon: '🚗',
      value: 350,
      categoryColor: '#FBBF24',
      categoryName: 'Transporte',
    },
    {
      categoryIcon: '🎉',
      value: 901,
      categoryColor: '#A78BFA',
      categoryName: 'Entretenimiento',
    },
  ]
  return (
    <View className="w-full h-full items-center bg-background pt-8 gap-4">
      <Card className="w-[92%] bg-foreground border-0 rounded-m p-2 py-4 gap-2 justify-center">
        <CardTitle className="text-secondary text-m pl-2">
          Gastos por categoría
        </CardTitle>
        <CardContent className="gap-2 items-center">
          <PieChart
            donut
            innerRadius={95}
            strokeColor="#fafafa"
            strokeWidth={5}
            data={data}
            centerLabelComponent={() => (
              <View className="items-center">
                <Text className="text-lg font-semibold text-gray-800">
                  Gastos Totales
                </Text>
                <Text className="text-xl font-bold text-gray-800">$10</Text>
              </View>
            )}
          />
          <FlatList
            className="w-screen p-4"
            data={data}
            renderItem={({ item, index }) => (
              <Card
                className="rounded-none bg-foreground border-0 relative"
                style={
                  index === 0 && data.length > 1
                    ? {
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        borderTopWidth: 0,
                      }
                    : index === data.length - 1 && data.length > 1
                      ? {
                          borderBottomLeftRadius: 30,
                          borderBottomRightRadius: 30,
                        }
                      : data.length === 1
                        ? { borderRadius: 30 }
                        : {}
                }
                key={index}
              >
                {index !== 0 && data.length > 1 ? (
                  <View className="absolute border-t-[1.2px] border-gray-300 w-[90%] top-0 left-[5%]"></View>
                ) : (
                  <></>
                )}
                <CardContent className="flex-row justify-between items-center">
                  <Text>{item.categoryIcon}</Text>
                  <View className="w-4/5 pl-4 flex-row justify-between">
                    <Text numberOfLines={2} className="text-lg">
                      {item.categoryName}
                    </Text>
                    <Text numberOfLines={2} className="text-lg">
                      $ {item.value}
                    </Text>
                  </View>
                  <ChevronRight size={22} color="black" />
                </CardContent>
              </Card>
            )}
          />
        </CardContent>
      </Card>
    </View>
  )
}

export default index
