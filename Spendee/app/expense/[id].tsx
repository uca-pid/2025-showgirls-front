import { Button, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useGlobalSearchParams } from 'expo-router'
import expenseService, { ExpenseResponse } from '../../services/expense.service'
import { Card, CardContent, CardTitle } from '@/components/ui/card'

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

  async function handleDeleteExpense() {
    if (!id) return

    // Try to confirm in environments that support a confirmation dialog (web).
    const confirmed =
      typeof (global as any).confirm === 'function'
        ? (global as any).confirm('¿Desea eliminar este gasto?')
        : true
    if (!confirmed) return

    try {
      const svc: any = expenseService

      if (typeof svc.deleteExpense === 'function') {
        await svc.deleteExpense(Number(id))
      } else if (typeof svc.delete === 'function') {
        await svc.delete(Number(id))
      } else if (typeof svc.remove === 'function') {
        await svc.remove(Number(id))
      } else if (typeof svc.deleteByExpenseId === 'function') {
        await svc.deleteByExpenseId(Number(id))
      } else {
        throw new Error('Delete method not available on expenseService')
      }

      // Navigate back after successful deletion
      router.back()
    } catch (error) {
      console.error('Failed to delete expense:', error)
      // You might want to show a user-facing error UI here
    }
  }
  
  return (
    <View className="bg-background w-full h-full items-center p-4">
      <Card className="w-full">
        <CardContent className="flex-row justify-between items-center">
          <CardTitle>{expense?.fecha ? new Date(expense.fecha).toLocaleDateString() : 'Sin Fecha'} ${expense?.gasto}</CardTitle>
          <Button title="Eliminar" onPress={() => {handleDeleteExpense()}} />
        </CardContent>

      </Card>
    </View>
  )
}

export default ExpenseDetailPage
