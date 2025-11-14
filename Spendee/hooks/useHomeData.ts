import { useAuth } from '@/context/AuthContext'
import useBalance from '@/hooks/useBalance'
import useBudgets from '@/hooks/useBudget'
import useCategories from '@/hooks/useCategories'
import useChartData from '@/hooks/useChartData'
import useExpenses from '@/hooks/useExpenses'

export default function useHomeData() {
  const { user } = useAuth()
  const uid = user?.uid ?? ''

  const { currentBudget, isFetching: fetchingBudget } = useBudgets(uid)
  const {
    balanceData,
    refetch: refetchBalance,
    isFetching: fetchingBalance,
  } = useBalance(uid)
  const {
    categoriesData,
    refetch: refetchCategories,
    isFetching: fetchingCategories,
  } = useCategories()
  const {
    expensesData,
    refetch: refetchExpenses,
    isFetching: fetchingExpenses,
  } = useExpenses(uid, { limit: 5, order: 'desc' })
  const {
    chartData,
    refetch: refetchChart,
    isFetching: fetchingChart,
  } = useChartData()

  const refreshing =
    fetchingBalance ||
    fetchingCategories ||
    fetchingExpenses ||
    fetchingChart ||
    fetchingBudget

  const refetchAll = () => {
    refetchBalance()
    refetchCategories()
    refetchExpenses()
    refetchChart()
  }

  return {
    currentBudget,
    balanceData,
    categoriesData,
    expensesData,
    chartData,
    refreshing,
    refetchAll,
  }
}
