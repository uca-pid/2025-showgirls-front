import expenseService, {
  ExpensesByMonthResponse,
} from '@/services/expense.service'
import { useQuery } from '@tanstack/react-query'

export default function useExpensesByMonth(userId: string) {
  const { data, ...rest } = useQuery<ExpensesByMonthResponse[]>({
    queryKey: ['expensesByMonth', userId],
    queryFn: async () =>
      (await expenseService.findExpensesByMonth(userId)).data,
  })

  return { expensesByMonthData: data, ...rest }
}
