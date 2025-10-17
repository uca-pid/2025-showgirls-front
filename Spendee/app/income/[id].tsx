import { Card, CardTitle } from '@/components/ui/card'
import incomeService, { IncomeResponse } from '@/services/income.service'
import { useGlobalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'

const IncomeDetailPage = () => {
  const [income, setIncome] = useState<IncomeResponse>()
  const { id } = useGlobalSearchParams()

  useEffect(() => {
    const getIncome = async () => {
      const res = await incomeService.findById(Number(id))
      setIncome(res.data)
    }
    getIncome()
  }, [])

  return (
    <View className="bg-background w-full h-full items-center p-4">
      <Card className="w-full">
        <CardTitle>{income?.ingreso}</CardTitle>
      </Card>
    </View>
  )
}

export default IncomeDetailPage
