import expenseService, { ExpenseResponse } from '@/services/expense.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const defaultExpenses: ExpenseResponse[] = []

export default function useExpenses(
  userId: string,
  limit?: number,
  order: 'asc' | 'desc' = 'asc',
) {
  const queryClient = useQueryClient()

  const {
    data: expensesData = defaultExpenses,
    refetch,
    isLoading,
    ...rest
  } = useQuery<ExpenseResponse[]>({
    queryKey: ['expenses', userId, limit, order],
    queryFn: async () => {
      console.log(limit, order)
      const res = await expenseService.findByUserId(userId, limit, order)
      return res.data
    },
  })

  const { mutateAsync: create } = useMutation({
    mutationFn: expenseService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['expenses', userId, limit, order],
      })
    },
  })

  return { expensesData, refetch, create, isLoading, ...rest }
}
