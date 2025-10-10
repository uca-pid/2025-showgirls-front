import Container from '@/components/Container'
import DonutChart from '@/components/DonutChart'
import IconButton from '@/components/IconButton'
import ItemCard from '@/components/ItemCard'
import ItemMenu from '@/components/ItemMenu'
import Section from '@/components/Section'
import SectionCard from '@/components/SectionCard'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { auth } from '@/firebase.config'
import useCategories from '@/hooks/useCategories'
import useChartData from '@/hooks/useChartData'
import useExpenses from '@/hooks/useExpenses'
import { getIcon } from '@/lib/getIcon'
import ApiService from '@/services/api.service'
import balanceService from '@/services/balance.service'
import { useIsFocused } from '@react-navigation/native'
import { router } from 'expo-router'
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
  Plus,
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
import { FlatList, ScrollView, Text, View } from 'react-native'

const ExpensesPage = () => {
  const { user } = auth.currentUser ? useAuth() : { user: null }
  const { categoriesData, isLoading: loadingCategories } = useCategories()
  const { chartData, isLoading: loadingChartData } = useChartData()
  const { expensesData, isLoading: loadingExpenses } = useExpenses(
    user?.uid ?? '',
  )

  return (
    <Container>
      <Section title="Mis Gastos">
        <SectionCard activity={loadingChartData}>
          <Text className="text-muted-foreground">Mis gastos</Text>
          <DonutChart
            data={chartData}
            centerText={
              loadingChartData
                ? ''
                : `$${chartData.reduce((sum, item) => sum + item.value, 0)}`
            }
            centerTextColor="white"
            size={210}
            strokeWidth={20}
          />
        </SectionCard>
      </Section>

      <Section
        title="Últimos gastos"
        actionText="Ver gastos"
        actionIcon={ChevronRight}
      >
        <FlatList
          scrollEnabled={false}
          data={categoriesData}
          renderItem={({ item }) => {
            return (
              <ItemCard
                title={item.nombre}
                description={item.descripcion}
                icon={getIcon(item.icono)}
                iconColor={item.color}
              />
            )
          }}
        />
      </Section>
    </Container>
  )
}

export default ExpensesPage
