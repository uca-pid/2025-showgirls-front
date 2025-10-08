import expenseService, { ExpenseResponse } from '@/services/expense.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const defaultExpenses: ExpenseResponse[] = []

export default function useExpenses(userId: string, limit?: number) {
  const queryClient = useQueryClient()

  const {
    data: expensesData = defaultExpenses,
    refetch,
    isLoading,
    ...rest
  } = useQuery<ExpenseResponse[]>({
    queryKey: ['expenses', userId, limit],
    queryFn: async () => {
      const res = await expenseService.findByUserId(userId)
      return limit ? res.data.slice(0, limit) : res.data
    },
    enabled: !!userId,
  })

  const { mutateAsync: create } = useMutation({
    mutationFn: expenseService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', userId, limit] })
    },
  })

  return { expensesData, refetch, create, isLoading, ...rest }
}
