import expenseService from '@/services/expense.service'
import { useQuery } from '@tanstack/react-query'

export default function useExpenseDetail(expenseId: number) {
  const { data, refetch, ...rest } = useQuery({
    queryKey: ['expenseDetail', expenseId],
    queryFn: () => expenseService.findByExpenseId(expenseId),
  })

  return { expense: data?.data, refetch, ...rest }
}
