import React, { useState } from 'react'
import { View } from 'react-native'
import { Text } from '@/components/ui/text'
import Container from '@/components/Container'
import { Button } from '@/components/ui/button'
import DateTimePicker, {
  DateType,
  useDefaultStyles,
} from 'react-native-ui-datepicker'

const DatePicker = () => {
  const defaultStyles = useDefaultStyles()
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date() as DateType,
    endDate: new Date() as DateType,
  })
  return (
    <View className="w-full h-screen bg-background items-center py-4">
      <Text className="text-lg font-bold">Elegí un rango de fechas</Text>
      <Text className="text-base text-muted-foreground">
        El presupuesto se aplicará a este rango
      </Text>
      <Container>
        <View className="flex-row gap-5">
          <DateTimePicker
            mode="range"
            startDate={selectedRange.startDate}
            endDate={selectedRange.endDate}
            onChange={({ startDate, endDate }) => {
              setSelectedRange({ startDate, endDate })
            }}
            styles={defaultStyles}
            minDate={new Date()}
          />
        </View>
        <Button className="w-full bg-pink-300" onPress={() => {}}>
          <Text>Confirmar fecha</Text>
        </Button>
      </Container>
    </View>
  )
}

export default DatePicker
