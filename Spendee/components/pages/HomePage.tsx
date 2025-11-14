import Container from '@/components/Container'
import BalanceSection from '@/components/home/BalanceSection'
import BudgetSection from '@/components/home/BudgetSection'
import ExpensesByCategorySection from '@/components/home/ExpensesByCategorySection'
import LastExpensesSection from '@/components/home/LastExpensesSection'
import QuickActionsSection from '@/components/home/QuickActionsSection'
import useHomeData from '@/hooks/useHomeData'
import { RefreshControl } from 'react-native'

export default function HomePage() {
  const {
    currentBudget,
    balanceData,
    categoriesData,
    expensesData,
    chartData,
    refreshing,
    refetchAll,
  } = useHomeData()

  return (
    <Container
      activity={refreshing}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refetchAll}
          tintColor={!refreshing ? 'gray' : 'black'}
        />
      }
    >
      <BalanceSection balanceData={balanceData} />
      <QuickActionsSection />
      <BudgetSection currentBudget={currentBudget} />
      <ExpensesByCategorySection
        categories={categoriesData}
        chartData={chartData}
        expenses={expensesData}
      />
      <LastExpensesSection
        expenses={expensesData}
        categories={categoriesData}
      />
    </Container>
  )
}
