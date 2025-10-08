import DonutChart from '@/components/DonutChart'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import useBalance from '@/hooks/useBalance'
import useCategories from '@/hooks/useCategories'
import useChartData from '@/hooks/useChartData'
import useExpenses from '@/hooks/useExpenses'
import React from 'react'
import { ScrollView, Text } from 'react-native'

const index = () => {
  const { user } = useAuth()
  const { categoriesData } = useCategories()
  const { balanceData } = useBalance(user?.uid ?? '')
  const { expensesData } = useExpenses(user?.uid ?? '', 5)
  const { chartData, isLoading } = useChartData()

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerClassName="items-center gap-6 p-6 pb-[100px]"
    >
      <Card className="w-full border-0 rounded-[30px] p-6 gap-2 justify-center">
        <Text className="text-muted-foreground">Mis gastos</Text>
        <CardContent className="justify-center items-center">
          <DonutChart
            data={chartData}
            centerText={
              isLoading
                ? ''
                : `$${chartData.reduce((sum, item) => sum + item.value, 0)}`
            }
            centerTextColor="white"
            size={210}
            strokeWidth={20}
          />
        </CardContent>
      </Card>
      <Card className="w-full border-0 rounded-[30px] p-6 gap-2 justify-center">
        <Text className="text-muted-foreground">Mis gastos</Text>
        <CardContent className="justify-center items-center">
          <DonutChart
            data={chartData}
            centerText={
              isLoading
                ? ''
                : `$${chartData.reduce((sum, item) => sum + item.value, 0)}`
            }
            centerTextColor="white"
            size={210}
            strokeWidth={20}
          />
        </CardContent>
      </Card>
      <Card className="w-full border-0 rounded-[30px] p-6 gap-2 justify-center">
        <Text className="text-muted-foreground">Mis gastos</Text>
        <CardContent className="justify-center items-center">
          <DonutChart
            data={chartData}
            centerText={
              isLoading
                ? ''
                : `$${chartData.reduce((sum, item) => sum + item.value, 0)}`
            }
            centerTextColor="white"
            size={210}
            strokeWidth={20}
          />
        </CardContent>
      </Card>
      <Card className="w-full border-0 rounded-[30px] p-6 gap-2 justify-center">
        <Text className="text-muted-foreground">Mis gastos</Text>
        <CardContent className="justify-center items-center">
          <DonutChart
            data={chartData}
            centerText={
              isLoading
                ? ''
                : `$${chartData.reduce((sum, item) => sum + item.value, 0)}`
            }
            centerTextColor="white"
            size={210}
            strokeWidth={20}
          />
        </CardContent>
      </Card>
      <Card className="w-full border-0 rounded-[30px] p-6 gap-2 justify-center">
        <Text className="text-muted-foreground">Mis gastos</Text>
        <CardContent className="justify-center items-center">
          <DonutChart
            data={chartData}
            centerText={
              isLoading
                ? ''
                : `$${chartData.reduce((sum, item) => sum + item.value, 0)}`
            }
            centerTextColor="white"
            size={210}
            strokeWidth={20}
          />
        </CardContent>
      </Card>
      <Card className="w-full border-0 rounded-[30px] p-6 gap-2 justify-center">
        <Text className="text-muted-foreground">Mis gastos</Text>
        <CardContent className="justify-center items-center">
          <DonutChart
            data={chartData}
            centerText={
              isLoading
                ? ''
                : `$${chartData.reduce((sum, item) => sum + item.value, 0)}`
            }
            centerTextColor="white"
            size={210}
            strokeWidth={20}
          />
        </CardContent>
      </Card>
    </ScrollView>
  )
}

export default index
