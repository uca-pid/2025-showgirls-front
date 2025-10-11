import Container from '@/components/Container'
import { useAuth } from '@/context/AuthContext'
import useExpenses from '@/hooks/useExpenses'
import React from 'react'
import { RefreshControl } from 'react-native'

const ExpensesList = () => {
  const { user } = useAuth()
  const { expensesData, isRefetching, refetch } = useExpenses(
    user ? user.uid : '',
    0,
  )

  return (
    <Container
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    ></Container>
  )
}

export default ExpensesList
