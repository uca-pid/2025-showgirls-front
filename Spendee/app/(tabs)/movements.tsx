import Container from '@/components/Container'
import MovementsSection from '@/components/movements/MovementsSection'
import { useAuth } from '@/context/AuthContext'
import useMovements from '@/hooks/useMovements'
import React from 'react'
import { RefreshControl } from 'react-native'

const TransactionsPage = () => {
  const { user } = useAuth()
  const { movementsData, isRefetching, isFetching, refetch } = useMovements(
    user?.uid || '',
    {
      groupBy: 'month',
      order: 'desc',
    },
  )
  const refreshing = isRefetching || isFetching

  return (
    <Container
      activity={refreshing}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refetch}
          tintColor={!refreshing ? 'gray' : 'black'}
        />
      }
    >
      <MovementsSection movementsData={movementsData!} />
    </Container>
  )
}

export default TransactionsPage
