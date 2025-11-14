import { getIcon } from '@/lib/getIcon'
import { CategoryResponse } from '@/services/category.service'
import { ExpenseResponse } from '@/services/expense.service'
import { router } from 'expo-router'
import { ChevronRight } from 'lucide-react-native'
import React from 'react'
import { FlatList } from 'react-native'
import ItemCard from '../ItemCard'
import Section from '../Section'

type LastExpensesSection = {
  expenses?: ExpenseResponse[]
  categories?: CategoryResponse[]
}

export default function LastExpensesSection({
  expenses,
  categories,
}: LastExpensesSection) {
  return (
    <Section
      title="Últimos gastos"
      actionText="Ver gastos"
      actionIcon={ChevronRight}
      onActionPress={() => router.push('/expense/list')}
      showWhen={expenses?.length! > 0}
    >
      <FlatList
        scrollEnabled={false}
        data={expenses}
        renderItem={({ item }) => {
          const category = categories?.find(
            (cat) => cat.id === item.categoriaId,
          )
          const title = 'Gasto en ' + category?.nombre
          const icon = getIcon(category?.icono ?? '')
          const color = category?.color ?? 'white'
          const date = new Date(item.fecha).toLocaleDateString('en-GB')
          const amount = `-$${item.gasto}`

          return (
            <ItemCard
              title={title}
              description={date}
              badgeText={amount}
              icon={icon}
              iconColor={color}
              onPress={() =>
                router.push({
                  pathname: '/expense/[id]',
                  params: { id: item.id },
                })
              }
            />
          )
        }}
      />
    </Section>
  )
}
