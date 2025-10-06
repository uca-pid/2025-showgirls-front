import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalSearchParams } from 'expo-router'
import expenseService, { ExpenseResponse } from '../../services/expense.service'
import { Card, CardTitle } from '@/components/ui/card'

const ExpenseDetailPage = () => {
  const [expense, setExpense] = useState<ExpenseResponse>()
  const { id } = useGlobalSearchParams()

  useEffect(() => {
    const getExpense = async () => {
      const res = await expenseService.findByExpenseId(Number(id))
      setExpense(res.data)
    }
    getExpense()
  }, [])

  return (
    <View className="bg-background w-full h-full items-center p-4">
      <Card className="w-full">
        <CardTitle>{expense?.gasto}</CardTitle>
      </Card>
    </View>
  )
}

export default ExpenseDetailPage
