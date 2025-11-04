import { View } from 'react-native'
import React, { useState } from 'react'
import { Text } from '@/components/ui/text'
import Slider from '@react-native-community/slider'
import Container from './Container'
import Section from './Section'
import SectionCard from './SectionCard'
import { router } from 'expo-router'
import { Button } from './ui/button'

export interface Category {
  nombre: string
  color: string
}

export interface SliderCardProps {
  categories: Category[]
  amount: number
}

const SliderCard = ({ categories, amount }: SliderCardProps) => {
  const [values, setValues] = useState<number[]>(categories.map(() => 0))
  const totalAssigned = values.reduce((acc, val) => acc + val, 0)
  const remaining = amount - totalAssigned
  const handleValueChange = (value: number, index: number) => {
    const newValues = [...values]
    const currentTotal = newValues.reduce((acc, v) => acc + v, 0)
    const difference = value - newValues[index]
    if (currentTotal + difference > amount) {
      return
    }
    newValues[index] = value
    setValues(newValues)
  }

  return (
    <Container>
      <Section>
        <View className="position-absolute left-0 items-center">
          <Text className="text-xl font-bold text-center">
            Monto total: ${amount.toFixed(0)}
          </Text>
          <Text className="text-m text-center text-gray-600">
            Restante: ${remaining.toFixed(0)}
          </Text>
        </View>
        {categories.map((category, index) => (
          <View key={index} className="mb-1">
            <Text className="text-lg font-medium mb-2">
              {category.nombre}: ${values[index].toFixed(0)}
            </Text>
            <SectionCard className="p-5">
              <Slider
                style={{ width: '100%', height: 20 }}
                minimumValue={0}
                maximumValue={amount}
                step={1}
                value={values[index]}
                onValueChange={(value) => handleValueChange(value, index)}
                minimumTrackTintColor={category.color}
                maximumTrackTintColor="#E0E0E0"
                thumbTintColor={category.color}
              />
            </SectionCard>
          </View>
        ))}
        <Button
          className="w-full bg-pink-300"
          onPress={() => router.dismissTo('/budget/modal/add')}
        >
          <Text>Aceptar</Text>
        </Button>
      </Section>
    </Container>
  )
}

export default SliderCard
